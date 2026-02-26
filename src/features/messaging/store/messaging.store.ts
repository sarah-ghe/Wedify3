import { defineStore } from 'pinia'
import type { Conversation, Message, MessagingState } from '../types'

export const useMessagingStore = defineStore('messaging', {
    state: (): MessagingState => ({
        conversations: [],
        activeConversationId: null,
        messages: {}, // Record<conversationId, Message[]>
        unreadCount: 0,
        loadingConversations: false,
        loadingMessages: false,
        sending: false,
        error: null,
    }),

    getters: {
        // Active conversation object
        activeConversation: (state): Conversation | undefined =>
            state.conversations.find((c) => c.id === state.activeConversationId),

        // Messages for the active conversation
        activeMessages: (state): Message[] =>
            state.activeConversationId
                ? (state.messages[state.activeConversationId] ?? [])
                : [],

        // Sorted conversations — most recent first
        sortedConversations: (state): Conversation[] =>
            [...state.conversations].sort(
                (a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            ),

        // All conversation IDs — used for realtime subscription setup
        conversationIds: (state): string[] =>
            state.conversations.map((c) => c.id),

        // Per-conversation unread count
        unreadPerConversation: (state): Record<string, number> =>
            state.conversations.reduce<Record<string, number>>((acc, c) => {
                acc[c.id] = c.unreadCount ?? 0
                return acc
            }, {}),
    },

    actions: {
        // ── CONVERSATIONS ──────────────────────────────────────────────────────

        setConversations(conversations: Conversation[]) {
            this.conversations = conversations
        },

        upsertConversation(conversation: Conversation) {
            const index = this.conversations.findIndex((c) => c.id === conversation.id)
            if (index >= 0) {
                this.conversations[index] = conversation
            } else {
                this.conversations.unshift(conversation)
            }
        },

        removeConversation(id: string) {
            this.conversations = this.conversations.filter((c) => c.id !== id)
            if (this.activeConversationId === id) {
                this.activeConversationId = null
            }
            delete this.messages[id]
        },

        setActiveConversation(id: string | null) {
            this.activeConversationId = id
        },

        /**
         * Update last message preview and timestamp on a conversation.
         * Called when a new message arrives via realtime.
         */
        updateConversationPreview(conversationId: string, message: Message) {
            const conversation = this.conversations.find((c) => c.id === conversationId)
            if (!conversation) return

            conversation.lastMessage = message.isDeleted
                ? 'This message was deleted'
                : message.content ?? undefined
            conversation.lastMessageAt = message.createdAt
            conversation.updatedAt = message.createdAt
        },

        updateConversationUnreadCount(conversationId: string, count: number) {
            const conversation = this.conversations.find((c) => c.id === conversationId)
            if (conversation) conversation.unreadCount = count
        },

        resetConversationUnreadCount(conversationId: string) {
            const conversation = this.conversations.find((c) => c.id === conversationId)
            if (conversation) conversation.unreadCount = 0
        },

        // ── MESSAGES ───────────────────────────────────────────────────────────

        setMessages(conversationId: string, messages: Message[]) {
            this.messages[conversationId] = messages
        },

        /**
         * Prepend older messages (pagination / load more).
         */
        prependMessages(conversationId: string, messages: Message[]) {
            const existing = this.messages[conversationId] ?? []
            this.messages[conversationId] = [...messages, ...existing]
        },

        /**
         * Append a new message to a conversation.
         * Used by both optimistic sends and realtime inserts.
         */
        appendMessage(conversationId: string, message: Message) {
            if (!this.messages[conversationId]) {
                this.messages[conversationId] = []
            }
            // Prevent duplicates — replace optimistic message by matching temp id or real id
            const index = this.messages[conversationId].findIndex(
                (m) => m.id === message.id
            )
            if (index >= 0) {
                this.messages[conversationId][index] = message
            } else {
                this.messages[conversationId].push(message)
            }
            this.updateConversationPreview(conversationId, message)
        },

        /**
         * Replace an optimistic message (temp ID) with the real server message.
         */
        replaceOptimisticMessage(
            conversationId: string,
            tempId: string,
            message: Message
        ) {
            const messages = this.messages[conversationId]
            if (!messages) return
            const index = messages.findIndex((m) => m.id === tempId)
            if (index >= 0) {
                messages[index] = message
            }
        },

        /**
         * Update a message in place — used for read receipts and soft deletes.
         */
        updateMessage(conversationId: string, updated: Message) {
            const messages = this.messages[conversationId]
            if (!messages) return
            const index = messages.findIndex((m) => m.id === updated.id)
            if (index >= 0) {
                messages[index] = updated
            }
        },

        /**
         * Mark all messages in a conversation as read in local state.
         * Called after markConversationAsRead() service call succeeds.
         */
        markMessagesReadLocally(conversationId: string, currentUserId: string) {
            const messages = this.messages[conversationId]
            if (!messages) return
            const now = new Date().toISOString()
            this.messages[conversationId] = messages.map((m) =>
                m.senderId !== currentUserId && !m.readAt
                    ? { ...m, status: 'read', readAt: now }
                    : m
            )
        },

        // ── UNREAD COUNT ───────────────────────────────────────────────────────

        setUnreadCount(count: number) {
            this.unreadCount = count
        },

        incrementUnread() {
            this.unreadCount++
        },

        decrementUnread(by = 1) {
            this.unreadCount = Math.max(0, this.unreadCount - by)
        },

        // ── LOADING & ERROR ────────────────────────────────────────────────────

        setLoadingConversations(val: boolean) {
            this.loadingConversations = val
        },

        setLoadingMessages(val: boolean) {
            this.loadingMessages = val
        },

        setSending(val: boolean) {
            this.sending = val
        },

        setError(message: string | null) {
            this.error = message
        },

        clearError() {
            this.error = null
        },
    },
})