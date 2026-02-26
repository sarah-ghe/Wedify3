import { computed, onUnmounted } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useMessagingStore } from '@/features/messaging/store/messaging.store'
import { fetchUnreadCount } from '@/features/messaging/services/MessageService'
import { subscribeToUnreadMessages, unsubscribeChannel } from '@/features/messaging/services/RealtimeService'
import { useAuthStore } from '@/features/auth/stores/auth.store'

/**
 * useUnreadCount — global unread badge, lives in Navbar / App shell.
 *
 * Mount once in your App.vue or MainLayout after user logs in.
 * Stays alive the entire session.
 *
 * UI calls:
 *   const { unreadCount, initialize, teardown } = useUnreadCount()
 */
export function useUnreadCount() {
    const store = useMessagingStore()
    const authStore = useAuthStore()

    const currentUser = computed(() => authStore.user)

    let globalChannel: RealtimeChannel | null = null

    const unreadCount = computed(() => store.unreadCount)

    // ── INITIALIZE ────────────────────────────────────────────────────────────

    /**
     * Call once after conversations are loaded.
     * Fetches current unread count and sets up realtime subscription.
     */
    async function initialize(): Promise<void> {
        if (!currentUser.value) return

        const conversationIds = store.conversationIds
        if (!conversationIds.length) return

        // Prevent duplicate subscriptions
        if (globalChannel) return

        try {
            const count = await fetchUnreadCount(currentUser.value.id, conversationIds)
            store.setUnreadCount(count)

            // Start global realtime subscription
            globalChannel = subscribeToUnreadMessages(
                currentUser.value.id,
                conversationIds,
                {
                    onNewUnread: () => {
                        // Only increment if this conversation is not currently open
                        // If it IS open, useMessages handles marking as read immediately
                        const activeId = store.activeConversationId
                        store.incrementUnread()
                        if (activeId) store.decrementUnread() // cancel out — already reading
                    },
                    onConversationUpdated: async (conversationId) => {
                        // Refresh unread count for that specific conversation
                        const count = await fetchUnreadCount(
                            currentUser.value!.id,
                            [conversationId]
                        )
                        store.updateConversationUnreadCount(conversationId, count)
                    },
                }
            )
        } catch (err: any) {
            console.error('useUnreadCount initialize error:', err.message)
        }
    }

    // ── TEARDOWN ──────────────────────────────────────────────────────────────

    /**
     * Call on logout or app teardown.
     */
    async function teardown(): Promise<void> {
        if (globalChannel) {
            await unsubscribeChannel(globalChannel)
            globalChannel = null
        }
        store.setUnreadCount(0)
    }

    // Auto-teardown on component unmount
    onUnmounted(() => { teardown() })

    return {
        unreadCount,
        initialize,
        teardown,
    }
}
