import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useUnreadCount } from '@/features/messaging/composables/useUnreadCount'

vi.mock('@/features/messaging/store/messaging.store', () => ({
    useMessagingStore: () => mockStore,
}))
vi.mock('@/features/auth/stores/auth.store', () => ({
    useAuthStore: () => mockAuthStore,
}))
vi.mock('@/features/messaging/services/MessageService', () => ({
    fetchUnreadCount: vi.fn(),
}))
vi.mock('@/features/messaging/services/RealtimeService', () => ({
    subscribeToUnreadMessages: vi.fn(),
    unsubscribeChannel: vi.fn(),
}))

import { fetchUnreadCount } from '@/features/messaging/services/MessageService'
import { subscribeToUnreadMessages, unsubscribeChannel } from '@/features/messaging/services/RealtimeService'

const mockStore = {
    unreadCount: 0,
    setUnreadCount: vi.fn(),
    conversationIds: ['c1', 'c2'],
    activeConversationId: null as string | null,
    incrementUnread: vi.fn(),
    decrementUnread: vi.fn(),
    updateConversationUnreadCount: vi.fn(),
}
const mockAuthStore = {
    user: ref<{ id: string } | null>({ id: 'u1' }),
}

describe('useUnreadCount', () => {
    beforeEach(() => {
        Object.assign(mockStore, {
            unreadCount: 0,
            setUnreadCount: vi.fn(),
            conversationIds: ['c1', 'c2'],
            activeConversationId: null as string | null,
            incrementUnread: vi.fn(),
            decrementUnread: vi.fn(),
            updateConversationUnreadCount: vi.fn(),
        })
        mockAuthStore.user.value = { id: 'u1' }
        vi.clearAllMocks()
    })

    it('does nothing if no user', async () => {
        mockAuthStore.user.value = null as any
        const { initialize } = useUnreadCount()
        await initialize()
        expect(fetchUnreadCount).not.toHaveBeenCalled()
    })

    it('does nothing if no conversations', async () => {
        mockStore.conversationIds = []
        const { initialize } = useUnreadCount()
        await initialize()
        expect(fetchUnreadCount).not.toHaveBeenCalled()
    })

    it('does nothing if already subscribed', async () => {
        (fetchUnreadCount as any).mockResolvedValue(5)
        const fakeChannel = {}
        ;(subscribeToUnreadMessages as any).mockReturnValue(fakeChannel)
        const { initialize } = useUnreadCount()
        await initialize()
        await initialize()
        expect(fetchUnreadCount).toHaveBeenCalledTimes(1)
    })

    it('fetches unread count and subscribes', async () => {
        (fetchUnreadCount as any).mockResolvedValue(5)
        const fakeChannel = {}
        ;(subscribeToUnreadMessages as any).mockReturnValue(fakeChannel)
        const { initialize } = useUnreadCount()
        await initialize()
        expect(fetchUnreadCount).toHaveBeenCalledWith('u1', ['c1', 'c2'])
        expect(mockStore.setUnreadCount).toHaveBeenCalledWith(5)
        expect(subscribeToUnreadMessages).toHaveBeenCalled()
    })

    it('handles onNewUnread callback', async () => {
        (fetchUnreadCount as any).mockResolvedValue(2)
        let onNewUnread: Function | undefined
        ;(subscribeToUnreadMessages as any).mockImplementation((_uid: any, _cids: any, cb: any) => {
            onNewUnread = cb.onNewUnread
            return {}
        })
        const { initialize } = useUnreadCount()
        await initialize()
        onNewUnread!()
        expect(mockStore.incrementUnread).toHaveBeenCalled()
        expect(mockStore.decrementUnread).not.toHaveBeenCalled()
        // Simulate active conversation
        mockStore.activeConversationId = 'c1'
        onNewUnread!()
        expect(mockStore.decrementUnread).toHaveBeenCalled()
    })

    it('teardown unsubscribes and resets count', async () => {
        (fetchUnreadCount as any).mockResolvedValue(1)
        const fakeChannel = {}
        ;(subscribeToUnreadMessages as any).mockReturnValue(fakeChannel)
        const { initialize, teardown } = useUnreadCount()
        await initialize()
        await teardown()
        expect(unsubscribeChannel).toHaveBeenCalledWith(fakeChannel)
        expect(mockStore.setUnreadCount).toHaveBeenCalledWith(0)
    })
})
