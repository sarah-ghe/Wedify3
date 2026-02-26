import { computed } from 'vue'
import type { CreateConversationPayload } from '../types'
import { useMessagingStore } from '@/features/messaging/store/messaging.store'
import {
    archiveConversation,
    blockConversation,
    fetchConversations,
    getOrCreateConversation,
    softDeleteConversation
} from '@/features/messaging/services/ConversationService'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { SenderRole } from '../types'

/**
 * useConversations — manages the conversations list.
 *
 * UI calls:
 *   const { conversations, loading, load, startConversation, archive, remove } = useConversations()
 */
export function useConversations() {
    const store = useMessagingStore()
    const authStore = useAuthStore()

    const currentUser = computed(() => authStore.user)
    const currentRole = computed(() => authStore.role) // 'couple' | 'vendor' | null

    // ── EXPOSED STATE ────────────────────────────────────────────────────────

    const conversations = computed(() => store.sortedConversations)
    const loading = computed(() => store.loadingConversations)
    const error = computed(() => store.error)

    // ── LOAD ─────────────────────────────────────────────────────────────────

    async function load(): Promise<void> {
        if (!currentUser.value || !isSenderRole(currentRole.value)) return
        store.setLoadingConversations(true)
        store.clearError()
        try {
            const data = await fetchConversations(currentUser.value.id, currentRole.value)
            store.setConversations(data)
        } catch (err: any) {
            store.setError(err.message)
        } finally {
            store.setLoadingConversations(false)
        }
    }

    // ── START / GET CONVERSATION ──────────────────────────────────────────────

    async function startConversation(
        payload: CreateConversationPayload
    ) {
        store.clearError()
        try {
            const conversation = await getOrCreateConversation(payload)
            store.upsertConversation(conversation)
            return conversation
        } catch (err: any) {
            store.setError(err.message)
            return null
        }
    }

    // ── SET ACTIVE ────────────────────────────────────────────────────────────

    function setActive(conversationId: string | null) {
        store.setActiveConversation(conversationId)
    }

    // ── ARCHIVE ───────────────────────────────────────────────────────────────

    async function archive(conversationId: string): Promise<void> {
        if (!currentUser.value || !isSenderRole(currentRole.value)) return
        try {
            await archiveConversation(conversationId, currentUser.value.id, currentRole.value)
            const conv = store.conversations.find((c) => c.id === conversationId)
            if (conv) conv.status = 'archived'
        } catch (err: any) {
            store.setError(err.message)
        }
    }

    // ── BLOCK ─────────────────────────────────────────────────────────────────

    async function block(conversationId: string): Promise<void> {
        if (!currentUser.value || !isSenderRole(currentRole.value)) return
        try {
            await blockConversation(conversationId, currentUser.value.id, currentRole.value)
            const conv = store.conversations.find((c) => c.id === conversationId)
            if (conv) conv.status = 'blocked'
        } catch (err: any) {
            store.setError(err.message)
        }
    }

    // ── SOFT DELETE ───────────────────────────────────────────────────────────

    async function remove(conversationId: string): Promise<void> {
        if (!isSenderRole(currentRole.value)) return
        try {
            await softDeleteConversation(conversationId, currentRole.value)
            store.removeConversation(conversationId)
        } catch (err: any) {
            store.setError(err.message)
        }
    }

    // ── TYPE GUARD ────────────────────────────────────────────────────────────

    function isSenderRole(role: string | null): role is SenderRole {
        return role === 'couple' || role === 'vendor' || role === 'bot'
    }

    return {
        // state
        conversations,
        loading,
        error,
        activeConversationId: computed(() => store.activeConversationId),
        activeConversation: computed(() => store.activeConversation),
        // actions
        load,
        startConversation,
        setActive,
        archive,
        block,
        remove,
    }
}
