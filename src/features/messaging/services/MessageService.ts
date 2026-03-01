import { supabase } from '@/lib/supabase'
import type {
    Message,
    Attachment,
    SendMessagePayload,
    SendBotMessagePayload,
    FetchMessagesOptions,
    ContentType,
} from '../types'

const DEFAULT_LIMIT = 30

// ─── FETCH ───────────────────────────────────────────────────────────────────

/**
 * Fetch messages for a conversation with pagination.
 * Ordered oldest → newest for rendering in a chat UI.
 * Includes attachments via join.
 */
export async function fetchMessages(
    conversationId: string,
    options: FetchMessagesOptions = {}
): Promise<Message[]> {
    const { limit = DEFAULT_LIMIT, before } = options

    let query = supabase
        .from('messaging_messages')
        .select(`
      *,
      attachments:messaging_attachments (*)
    `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false }) // fetch newest first
        .limit(limit)

    // Cursor-based pagination — get messages before a given timestamp
    if (before) {
        query = query.lt('created_at', before)
    }

    const { data, error } = await query

    if (error) throw new Error(`fetchMessages: ${error.message}`)

    // Reverse so UI renders oldest → newest
    return (data ?? []).reverse().map(mapMessage)
}

/**
 * Fetch a single message by ID.
 */
export async function fetchMessageById(id: string): Promise<Message> {
    const { data, error } = await supabase
        .from('messaging_messages')
        .select('*, attachments:messaging_attachments (*)')
        .eq('id', id)
        .single()

    if (error) throw new Error(`fetchMessageById: ${error.message}`)
    return mapMessage(data)
}

// ─── SEND ─────────────────────────────────────────────────────────────────────

/**
 * Send a message from a user (couple or vendor).
 * Handles file uploads to Supabase Storage if attachments are present.
 */
export async function sendMessage(
    payload: SendMessagePayload,
    senderId: string,
    senderRole: 'couple' | 'vendor'
): Promise<Message> {
    const { conversationId, content, contentType = 'text', metadata, attachments } = payload

    // Insert message row
    const { data, error } = await supabase
        .from('messaging_messages')
        .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            sender_role: senderRole,
            content,
            content_type: contentType,
            status: 'sent',
            metadata: metadata ?? null,
            is_deleted: false,
        })
        .select()
        .single()

    if (error) throw new Error(`sendMessage: ${error.message}`)

    // Handle file attachments if any
    if (attachments?.length) {
        await uploadAttachments(data.id, conversationId, attachments)
    }

    // Fetch full message with attachments
    return fetchMessageById(data.id)
}

/**
 * Send a message from the bot (Make.io integration).
 * No file attachments, no senderRole restriction.
 */
export async function sendBotMessage(
    payload: SendBotMessagePayload
): Promise<Message> {
    const { conversationId, content, contentType = 'system', metadata } = payload

    const { data, error } = await supabase
        .from('messaging_messages')
        .insert({
            conversation_id: conversationId,
            sender_id: 'bot',
            sender_role: 'bot',
            content,
            content_type: contentType,
            status: 'delivered', // bot messages are immediately delivered
            metadata: metadata ?? null,
            is_deleted: false,
        })
        .select()
        .single()

    if (error) throw new Error(`sendBotMessage: ${error.message}`)
    return mapMessage(data)
}

// ─── READ STATE ───────────────────────────────────────────────────────────────

/**
 * Mark all messages in a conversation as read for the current user.
 * Only marks messages NOT sent by the current user.
 * Called when user opens a conversation.
 */
export async function markConversationAsRead(
    conversationId: string,
    userId: string
): Promise<void> {
    const { error } = await supabase
        .from('messaging_messages')
        .update({
            status: 'read',
            read_at: new Date().toISOString(),
        })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .is('read_at', null) // only update unread messages

    if (error) throw new Error(`markConversationAsRead: ${error.message}`)
}

/**
 * Get total unread message count for a user across all their conversations.
 * Uses the partial index idx_messages_unread for performance.
 */
export async function fetchUnreadCount(
    userId: string,
    conversationIds: string[]
): Promise<number> {
    if (!conversationIds.length) return 0

    const { count, error } = await supabase
        .from('messaging_messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .neq('sender_id', userId)
        .is('read_at', null)

    if (error) throw new Error(`fetchUnreadCount: ${error.message}`)
    return count ?? 0
}

/**
 * Get unread count per conversation — used for per-conversation badges.
 */
export async function fetchUnreadCountPerConversation(
    userId: string,
    conversationIds: string[]
): Promise<Record<string, number>> {
    if (!conversationIds.length) return {}

    const { data, error } = await supabase
        .from('messaging_messages')
        .select('conversation_id')
        .in('conversation_id', conversationIds)
        .neq('sender_id', userId)
        .is('read_at', null)

    if (error) throw new Error(`fetchUnreadCountPerConversation: ${error.message}`)

    // Count per conversationId
    return (data ?? []).reduce<Record<string, number>>((acc, row) => {
        acc[row.conversation_id] = (acc[row.conversation_id] ?? 0) + 1
        return acc
    }, {})
}

// ─── SOFT DELETE ─────────────────────────────────────────────────────────────

/**
 * Soft delete a message. Only the sender can delete their own message.
 * Content is nulled out — UI renders "This message was deleted".
 * Message row stays in DB for audit/booking evidence integrity.
 */
export async function softDeleteMessage(
    messageId: string,
    requesterId: string
): Promise<void> {
    // Verify ownership first
    const message = await fetchMessageById(messageId)
    if (message.senderId !== requesterId) {
        throw new Error('Unauthorized: cannot delete another user\'s message')
    }
    if (message.isDeleted) {
        throw new Error('Message is already deleted')
    }

    const { error } = await supabase
        .from('messaging_messages')
        .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            content: null, // wipe content but keep the row
        })
        .eq('id', messageId)

    if (error) throw new Error(`softDeleteMessage: ${error.message}`)
}

// ─── ATTACHMENTS ─────────────────────────────────────────────────────────────

/**
 * Upload files to Supabase Storage and insert attachment rows.
 * Path: messaging/{conversationId}/{messageId}/{filename}
 */
async function uploadAttachments(
    messageId: string,
    conversationId: string,
    files: File[]
): Promise<Attachment[]> {
    const uploads = files.map(async (file) => {
        const ext = file.name.split('.').pop()
        const path = `messaging/${conversationId}/${messageId}/${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
            .from(messages_bucket)
            .upload(path, file)

        if (uploadError) throw new Error(`uploadAttachment: ${uploadError.message}`)

        const { data: urlData } = supabase.storage
            .from(messages_bucket)
            .getPublicUrl(path)

        const { data, error } = await supabase
            .from('messaging_attachments')
            .insert({
                message_id: messageId,
                url: urlData.publicUrl,
                file_name: file.name,
                file_size: file.size,
                mime_type: file.type,
            })
            .select()
            .single()

        if (error) throw new Error(`insertAttachment: ${error.message}`)
        return mapAttachment(data)
    })

    return Promise.all(uploads)
}

// ─── MAPPERS ─────────────────────────────────────────────────────────────────

export function mapMessage(raw: Record<string, any>): Message {
    return {
        id: raw.id,
        conversationId: raw.conversation_id,
        senderId: raw.sender_id,
        senderRole: raw.sender_role,
        content: raw.content,
        contentType: raw.content_type as ContentType,
        status: raw.status,
        readAt: raw.read_at ?? undefined,
        isDeleted: raw.is_deleted ?? false,
        deletedAt: raw.deleted_at ?? undefined,
        metadata: raw.metadata ?? undefined,
        createdAt: raw.created_at,
        attachments: (raw.attachments ?? []).map(mapAttachment),
    }
}

function mapAttachment(raw: Record<string, any>): Attachment {
    return {
        id: raw.id,
        messageId: raw.message_id,
        url: raw.url,
        fileName: raw.file_name ?? undefined,
        fileSize: raw.file_size ?? undefined,
        mimeType: raw.mime_type ?? undefined,
        createdAt: raw.created_at,
    }
}