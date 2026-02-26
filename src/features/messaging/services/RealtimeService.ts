import {supabase} from '@/lib/supabase'
import type {Message, PresenceState, TypingPayload} from '../types'
import type {RealtimeChannel} from '@supabase/supabase-js'
import {mapMessage as mapMessageFromRealtime} from '@/features/messaging/services/MessageService'

/**
 * Realtime service — manages Supabase Realtime subscriptions.
 *
 * Two separate channel strategies:
 * 1. Active conversation channel — subscribes to messages in the open conversation.
 *    Created/destroyed as user navigates between conversations.
 *
 * 2. Global unread channel — subscribes to all new messages for the current user.
 *    Stays alive for the entire session. Updates the unread badge.
 */

// ─── ACTIVE CONVERSATION CHANNEL ─────────────────────────────────────────────

/**
 * Subscribe to new messages in a specific conversation.
 * Call onMessage with each new message so the composable can append to state.
 * Call onTyping when the other party is typing.
 */
export function subscribeToConversation(
    conversationId: string,
    currentUserId: string,
    callbacks: {
        onMessage: (message: Message) => void
        onMessageUpdated: (message: Message) => void // for read receipts & deletes
        onTyping?: (payload: TypingPayload) => void
    }
): RealtimeChannel {
    return supabase
        .channel(`conversation:${conversationId}`)

        // New messages
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messaging_messages',
                filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
                const message = mapMessageFromRealtime(payload.new)
                // Don't append own messages — already added optimistically
                if (message.senderId !== currentUserId) {
                    callbacks.onMessage(message)
                }
            }
        )

        // Message updates (read receipts, soft deletes)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'messaging_messages',
                filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
                callbacks.onMessageUpdated(mapMessageFromRealtime(payload.new))
            }
        )

        // Typing indicator via broadcast
        .on('broadcast', {event: 'typing'}, (payload) => {
            if (payload.payload.userId !== currentUserId) {
                callbacks.onTyping?.(payload.payload as TypingPayload)
            }
        })

        .subscribe()
}

/**
 * Broadcast typing indicator to the other party in the conversation.
 */
export function broadcastTyping(
    channel: RealtimeChannel,
    userId: string,
    conversationId: string,
    isTyping: boolean
): void {
    channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, conversationId, isTyping } satisfies TypingPayload,
    })
}

// ─── GLOBAL UNREAD CHANNEL ───────────────────────────────────────────────────

/**
 * Subscribe to new messages across ALL the user's conversations.
 * Used to update the global unread badge in the navbar/dashboard.
 * This channel stays alive the entire session — never unsubscribe until logout.
 *
 * @param currentUserId
 * @param conversationIds - array of conversation IDs the user participates in
 * @param callbacks - onNewUnread: called with the new message to increment unread count
 *                    onConversationUpdated: called with conversationId to update last message preview and timestamp in conversation list
 * @returns RealtimeChannel - keep reference to this channel to unsubscribe on logout
 */
export function subscribeToUnreadMessages(
    currentUserId: string,
    conversationIds: string[],
    callbacks: {
        onNewUnread: (message: Message) => void
        onConversationUpdated: (conversationId: string) => void
    }
): RealtimeChannel {
    return supabase
        .channel(`unread:${currentUserId}`)

        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messaging_messages',
            },
            (payload) => {
                const message = mapMessageFromRealtime(payload.new)
                const isForCurrentUser =
                    conversationIds.includes(message.conversationId) &&
                    message.senderId !== currentUserId

                if (isForCurrentUser) {
                    callbacks.onNewUnread(message)
                    callbacks.onConversationUpdated(message.conversationId)
                }
            }
        )

        // When conversation updated_at changes (new message), bubble up
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'messaging_conversations',
            },
            (payload) => {
                if (conversationIds.includes(payload.new.id)) {
                    callbacks.onConversationUpdated(payload.new.id)
                }
            }
        )

        .subscribe()
}

// ─── PRESENCE ────────────────────────────────────────────────────────────────

/**
 * Optional: track online presence per conversation.
 * Use for "online" indicator next to participant name.
 */
export function subscribeToPresence(
    conversationId: string,
    userId: string,
    onPresenceChange: (state: Record<string, PresenceState[]>) => void
): RealtimeChannel {
    const channel = supabase.channel(`presence:${conversationId}`, {
        config: { presence: { key: userId } },
    })

    channel
        .on('presence', { event: 'sync' }, () => {
            onPresenceChange(channel.presenceState<PresenceState>())
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({
                    userId,
                    onlineAt: new Date().toISOString(),
                } satisfies PresenceState)
            }
        })

    return channel
}

// ─── CLEANUP ─────────────────────────────────────────────────────────────────

export async function unsubscribeChannel(channel: RealtimeChannel): Promise<void> {
    await supabase.removeChannel(channel)
}
