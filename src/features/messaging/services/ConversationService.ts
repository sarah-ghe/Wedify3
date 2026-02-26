import { supabase } from '@/lib/supabase'
import type {
    Conversation,
    CreateConversationPayload,
    SenderRole,
} from '../types'

// ─── FETCH ───────────────────────────────────────────────────────────────────

/**
 * Fetch all conversations for the current user.
 * Filters out conversations the user has soft-deleted.
 * Joins participant info from the other side of the conversation.
 */
export async function fetchConversations(
    userId: string,
    role: SenderRole
): Promise<Conversation[]> {
    const isCouple = role === 'couple'
    const deletedFlag = isCouple ? 'deleted_by_couple' : 'deleted_by_vendor'
    const userColumn = isCouple ? 'couple_id' : 'vendor_id'
    const otherColumn = isCouple ? 'vendor_id' : 'couple_id'

    const { data, error } = await supabase
        .from('messaging_conversations')
        .select(`
      *,
      participant:${otherColumn} (
        id,
        raw_user_meta_data->name,
        raw_user_meta_data->avatar_url
      ),
      lastMsg:messaging_messages (
        content,
        created_at,
        is_deleted
      )
    `)
        .eq(userColumn, userId)
        .eq(deletedFlag, false)
        .order('updated_at', { ascending: false })

    if (error) throw new Error(`fetchConversations: ${error.message}`)

    return (data ?? []).map(mapConversation)
}

/**
 * Fetch a single conversation by ID.
 */
export async function fetchConversationById(id: string): Promise<Conversation> {
    const { data, error } = await supabase
        .from('messaging_conversations')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw new Error(`fetchConversationById: ${error.message}`)
    return mapConversation(data)
}

// ─── CREATE / UPSERT ─────────────────────────────────────────────────────────

/**
 * Get existing conversation between couple and vendor,
 * or create one if it doesn't exist.
 * The unique(couple_id, vendor_id) DB constraint makes this safe.
 */
export async function getOrCreateConversation(
    payload: CreateConversationPayload
): Promise<Conversation> {
    const { coupleId, vendorId } = payload

    // Check if conversation already exists
    const { data: existing } = await supabase
        .from('messaging_conversations')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('vendor_id', vendorId)
        .maybeSingle()

    if (existing) {
        // If one party had deleted it, restore visibility for both
        // since the conversation is being reactivated
        if (existing.deleted_by_couple || existing.deleted_by_vendor) {
            await restoreConversation(existing.id)
        }
        return mapConversation(existing)
    }

    // Create new conversation
    const { data, error } = await supabase
        .from('messaging_conversations')
        .insert({
            couple_id: coupleId,
            vendor_id: vendorId,
            status: 'active',
        })
        .select()
        .single()

    if (error) throw new Error(`getOrCreateConversation: ${error.message}`)
    return mapConversation(data)
}

// ─── STATUS UPDATES ──────────────────────────────────────────────────────────

export async function archiveConversation(
    id: string,
    userId: string,
    role: SenderRole
): Promise<void> {
    const isCouple = role === 'couple'
    const { error } = await supabase
        .from('messaging_conversations')
        .update({
            status: 'archived',
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        // Only allow the participant to archive their own conversation
        .eq(isCouple ? 'couple_id' : 'vendor_id', userId)

    if (error) throw new Error(`archiveConversation: ${error.message}`)
}

export async function blockConversation(
    id: string,
    userId: string,
    role: SenderRole
): Promise<void> {
    const isCouple = role === 'couple'
    const { error } = await supabase
        .from('messaging_conversations')
        .update({ status: 'blocked', updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq(isCouple ? 'couple_id' : 'vendor_id', userId)

    if (error) throw new Error(`blockConversation: ${error.message}`)
}

// ─── SOFT DELETE ─────────────────────────────────────────────────────────────

/**
 * Soft delete a conversation from one participant's view.
 * The other party still sees it.
 * If both parties delete it, it becomes invisible to both but stays in DB.
 */
export async function softDeleteConversation(
    id: string,
    role: SenderRole
): Promise<void> {
    const isCouple = role === 'couple'
    const { error } = await supabase
        .from('messaging_conversations')
        .update({
            ...(isCouple
                ? { deleted_by_couple: true, deleted_by_couple_at: new Date().toISOString() }
                : { deleted_by_vendor: true, deleted_by_vendor_at: new Date().toISOString() }),
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) throw new Error(`softDeleteConversation: ${error.message}`)
}

/**
 * Restore a soft-deleted conversation when a new message is sent.
 * Both parties get visibility back.
 */
export async function restoreConversation(id: string): Promise<void> {
    const { error } = await supabase
        .from('messaging_conversations')
        .update({
            deleted_by_couple: false,
            deleted_by_vendor: false,
            deleted_by_couple_at: null,
            deleted_by_vendor_at: null,
            status: 'active',
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) throw new Error(`restoreConversation: ${error.message}`)
}

// ─── MAPPER ──────────────────────────────────────────────────────────────────

function mapConversation(raw: Record<string, any>): Conversation {
    return {
        id: raw.id,
        coupleId: raw.couple_id,
        vendorId: raw.vendor_id,
        status: raw.status,
        deletedByCouple: raw.deleted_by_couple ?? false,
        deletedByVendor: raw.deleted_by_vendor ?? false,
        deletedByCoupleAt: raw.deleted_by_couple_at ?? undefined,
        deletedByVendorAt: raw.deleted_by_vendor_at ?? undefined,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        participant: raw.participant
            ? {
                id: raw.participant.id,
                role: raw.couple_id === raw.participant?.id ? 'couple' : 'vendor',
                name: raw.participant?.name ?? 'Unknown',
                avatarUrl: raw.participant?.avatar_url ?? undefined,
            }
            : undefined,
        lastMessage: raw.lastMsg?.[0]?.is_deleted
            ? 'This message was deleted'
            : raw.lastMsg?.[0]?.content ?? undefined,
        lastMessageAt: raw.lastMsg?.[0]?.created_at ?? undefined,
    }
}