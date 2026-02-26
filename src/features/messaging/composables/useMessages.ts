import { ref, computed } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { Message, SendMessagePayload } from '../types'
import type { RealtimeChannel } from '@supabase/supabase-js'
import {
    fetchMessages,
    markConversationAsRead,
    sendMessage,
    softDeleteMessage
} from '@/features/messaging/services/MessageService'
import {
    broadcastTyping,
    subscribeToConversation,
    unsubscribeChannel
} from '@/features/messaging/services/RealtimeService'
import { useMessagingStore } from '@/features/messaging/store/messaging.store'

const TYPING_DEBOUNCE_MS = 1500

/**
 * useMessages — manages messages for the active open conversation.
 *
 * UI calls:
 *   const { messages, sending, send, loadMore, deleteMessage, open, close } = useMessages()
 */
export function useMessages() {
    const store = useMessagingStore()
    const authStore = useAuthStore()

    const currentUser = computed(() => authStore.user)
    const currentRole = computed(() => authStore.role)

    let activeChannel: RealtimeChannel | null = null
    let typingTimeout: ReturnType<typeof setTimeout> | null = null

    const hasMore = ref(true)
    const otherPartyTyping = ref(false)

    // ── EXPOSED STATE ────────────────────────────────────────────────────────

    const messages = computed(() => store.activeMessages)
    const loading = computed(() => store.loadingMessages)
    const sending = computed(() => store.sending)
    const error = computed(() => store.error)

    // ── OPEN CONVERSATION ────────────────────────────────────────────────────

    /**
     * Open a conversation: load messages, mark as read, subscribe to realtime.
     * Call this when user taps a conversation in the list.
     */
    async function open(conversationId: string): Promise<void> {
        if (!currentUser.value) return

        // Close previous conversation channel if open
        await close()

        store.setActiveConversation(conversationId)
        store.setLoadingMessages(true)
        store.clearError()
        hasMore.value = true

        try {
            // Only fetch if not already cached
            if (!store.messages[conversationId]?.length) {
                const data = await fetchMessages(conversationId)
                store.setMessages(conversationId, data)
                hasMore.value = data.length === 30 // default limit
            }

            // Mark all messages as read
            await markConversationAsRead(conversationId, currentUser.value.id)
            store.markMessagesReadLocally(conversationId, currentUser.value.id)
            store.resetConversationUnreadCount(conversationId)

            // Subscribe to realtime
            activeChannel = subscribeToConversation(
                conversationId,
                currentUser.value.id,
                {
                    onMessage: (message) => {
                        store.appendMessage(conversationId, message)
                        // Auto-mark as read since conversation is open
                        markConversationAsRead(conversationId, currentUser.value!.id)
                    },
                    onMessageUpdated: (message) => {
                        store.updateMessage(conversationId, message)
                    },
                    onTyping: (payload) => {
                        otherPartyTyping.value = payload.isTyping
                        // Auto-clear typing indicator after 3s in case stop event is missed
                        if (payload.isTyping) {
                            setTimeout(() => { otherPartyTyping.value = false }, 3000)
                        }
                    },
                }
            )
        } catch (err: any) {
            store.setError(err.message)
        } finally {
            store.setLoadingMessages(false)
        }
    }

    // ── CLOSE CONVERSATION ────────────────────────────────────────────────────

    /**
     * Close the active conversation and unsubscribe from realtime.
     * Call this in onUnmounted of the chat view component.
     */
    async function close(): Promise<void> {
        if (activeChannel) {
            await unsubscribeChannel(activeChannel)
            activeChannel = null
        }
        if (typingTimeout) {
            clearTimeout(typingTimeout)
            typingTimeout = null
        }
        otherPartyTyping.value = false
        store.setActiveConversation(null)
    }

    // ── LOAD MORE (PAGINATION) ────────────────────────────────────────────────

    /**
     * Load older messages — called when user scrolls to top of chat.
     */
    async function loadMore(): Promise<void> {
        const conversationId = store.activeConversationId
        if (!conversationId || !hasMore.value || store.loadingMessages) return

        const oldest = messages.value[0]
        if (!oldest) return

        store.setLoadingMessages(true)
        try {
            const older = await fetchMessages(conversationId, { before: oldest.createdAt })
            if (older.length) {
                store.prependMessages(conversationId, older)
                hasMore.value = older.length === 30
            } else {
                hasMore.value = false
            }
        } catch (err: any) {
            store.setError(err.message)
        } finally {
            store.setLoadingMessages(false)
        }
    }

    // ── SEND ──────────────────────────────────────────────────────────────────

    /**
     * Send a message with optimistic UI update.
     * Message appears instantly, then gets replaced with server response.
     */
    async function send(payload: SendMessagePayload): Promise<void> {
        const conversationId = store.activeConversationId
        if (!conversationId || !currentUser.value) return

        store.setSending(true)
        store.clearError()

        // Stop typing indicator when message is sent
        stopTyping()

        // Optimistic message with temp ID
        const tempId = `temp_${Date.now()}`
        const optimistic: Message = {
            id: tempId,
            conversationId,
            senderId: currentUser.value.id,
            senderRole: currentRole.value as 'couple' | 'vendor',
            content: payload.content,
            contentType: payload.contentType ?? 'text',
            status: 'sent',
            isDeleted: false,
            createdAt: new Date().toISOString(),
        }
        store.appendMessage(conversationId, optimistic)

        try {
            const message = await sendMessage(payload, currentUser.value.id, currentRole.value as 'couple' | 'vendor')
            store.replaceOptimisticMessage(conversationId, tempId, message)
        } catch (err: any) {
            // Remove optimistic message on failure
            store.updateMessage(conversationId, { ...optimistic, status: 'sent' })
            store.setError(err.message)
        } finally {
            store.setSending(false)
        }
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    async function deleteMessage(messageId: string): Promise<void> {
        if (!currentUser.value) return
        const conversationId = store.activeConversationId
        if (!conversationId) return

        try {
            await softDeleteMessage(messageId, currentUser.value.id)
            // Update local state — mark as deleted
            const existing = messages.value.find((m) => m.id === messageId)
            if (existing) {
                store.updateMessage(conversationId, {
                    ...existing,
                    isDeleted: true,
                    deletedAt: new Date().toISOString(),
                    content: null,
                })
            }
        } catch (err: any) {
            store.setError(err.message)
        }
    }

    // ── TYPING ────────────────────────────────────────────────────────────────

    /**
     * Call this on every keypress in the message input.
     * Debounced — broadcasts typing=true immediately, typing=false after idle.
     */
    function onTyping(): void {
        if (!activeChannel || !currentUser.value || !store.activeConversationId) return

        broadcastTyping(activeChannel, currentUser.value.id, store.activeConversationId, true)

        if (typingTimeout) clearTimeout(typingTimeout)
        typingTimeout = setTimeout(() => {
            stopTyping()
        }, TYPING_DEBOUNCE_MS)
    }

    function stopTyping(): void {
        if (!activeChannel || !currentUser.value || !store.activeConversationId) return
        broadcastTyping(activeChannel, currentUser.value.id, store.activeConversationId, false)
        if (typingTimeout) {
            clearTimeout(typingTimeout)
            typingTimeout = null
        }
    }

    return {
        // state
        messages,
        loading,
        sending,
        error,
        hasMore,
        otherPartyTyping,
        // actions
        open,
        close,
        loadMore,
        send,
        deleteMessage,
        onTyping,
        stopTyping,
    }
}
