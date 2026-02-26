// tests/features/messaging/services/RealtimeService.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as RealtimeService from '@/features/messaging/services/RealtimeService'
import { supabase } from '@/lib/supabase'

const mockChannel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    send: vi.fn(),
    presenceState: vi.fn(),
    track: vi.fn(),
}

vi.mock('@/lib/supabase', () => ({
    supabase: {
        channel: vi.fn(() => mockChannel),
        removeChannel: vi.fn(),
    },
}))

beforeEach(() => {
    vi.clearAllMocks()
})

describe('RealtimeService', () => {
    it('subscribeToConversation sets up all handlers and subscribes', () => {
        const onMessage = vi.fn()
        const onMessageUpdated = vi.fn()
        const onTyping = vi.fn()
        const channel = RealtimeService.subscribeToConversation(
            'c1',
            'u1',
            { onMessage, onMessageUpdated, onTyping }
        )
        expect(supabase.channel).toHaveBeenCalledWith('conversation:c1')
        expect(mockChannel.on).toHaveBeenCalledTimes(3)
        expect(channel).toBe(mockChannel)
    })

    it('broadcastTyping sends typing event', () => {
        RealtimeService.broadcastTyping(mockChannel as any, 'u1', 'c1', true)
        expect(mockChannel.send).toHaveBeenCalledWith({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: 'u1', conversationId: 'c1', isTyping: true },
        })
    })

    it('subscribeToUnreadMessages sets up handlers and subscribes', () => {
        const onNewUnread = vi.fn()
        const onConversationUpdated = vi.fn()
        const channel = RealtimeService.subscribeToUnreadMessages(
            'u1',
            ['c1', 'c2'],
            { onNewUnread, onConversationUpdated }
        )
        expect(supabase.channel).toHaveBeenCalledWith('unread:u1')
        expect(mockChannel.on).toHaveBeenCalledTimes(2)
        expect(channel).toBe(mockChannel)
    })

    it('subscribeToPresence sets up presence and subscribes', async () => {
        mockChannel.subscribe = vi.fn((cb) => {
            cb('SUBSCRIBED')
            return mockChannel
        })
        const onPresenceChange = vi.fn()
        const channel = RealtimeService.subscribeToPresence('c1', 'u1', onPresenceChange)
        expect(supabase.channel).toHaveBeenCalledWith('presence:c1', { config: { presence: { key: 'u1' } } })
        expect(mockChannel.on).toHaveBeenCalledWith('presence', { event: 'sync' }, expect.any(Function))
        expect(channel).toBe(mockChannel)
    })

    it('unsubscribeChannel calls removeChannel', async () => {
        await RealtimeService.unsubscribeChannel(mockChannel as any)
        expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel)
    })
})
