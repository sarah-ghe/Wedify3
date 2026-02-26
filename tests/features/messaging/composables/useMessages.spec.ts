import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useMessages } from '@/features/messaging/composables/useMessages'
import type { Message } from '@/features/messaging/types'

vi.mock('@/features/messaging/store/messaging.store', () => ({
    useMessagingStore: () => mockStore,
}))
vi.mock('@/features/auth/stores/auth.store', () => ({
    useAuthStore: () => mockAuthStore,
}))
vi.mock('@/features/messaging/services/MessageService', () => ({
    fetchMessages: vi.fn(),
    markConversationAsRead: vi.fn(),
    sendMessage: vi.fn(),
    softDeleteMessage: vi.fn(),
}))
vi.mock('@/features/messaging/services/RealtimeService', () => ({
    broadcastTyping: vi.fn(),
    subscribeToConversation: vi.fn(),
    unsubscribeChannel: vi.fn(),
}))

import {
    fetchMessages,
    markConversationAsRead,
    sendMessage,
    softDeleteMessage,
} from '@/features/messaging/services/MessageService'
import {
    broadcastTyping,
    subscribeToConversation,
    unsubscribeChannel,
} from '@/features/messaging/services/RealtimeService'

const baseMessage: Message = {
    id: 'm1',
    conversationId: 'c1',
    senderId: 'u1',
    senderRole: 'couple',
    content: 'Hello',
    contentType: 'text',
    status: 'sent',
    isDeleted: false,
    createdAt: '2023-01-01T00:00:00Z',
}

const mockStore = {
    activeConversationId: 'c1',
    activeMessages: [baseMessage],
    messages: { c1: [baseMessage] },
    loadingMessages: false,
    sending: false,
    error: null,
    setActiveConversation: vi.fn(),
    setLoadingMessages: vi.fn(),
    clearError: vi.fn(),
    setMessages: vi.fn(),
    markMessagesReadLocally: vi.fn(),
    resetConversationUnreadCount: vi.fn(),
    appendMessage: vi.fn(),
    replaceOptimisticMessage: vi.fn(),
    updateMessage: vi.fn(),
    prependMessages: vi.fn(),
    setSending: vi.fn(),
    setError: vi.fn(),
    removeConversation: vi.fn(),
}
const mockAuthStore = {
    user: ref<{ id: string } | null>({ id: 'u1' }),
    role: ref<'couple' | 'vendor' | null>('couple'),
}

describe('useMessages', () => {
    beforeEach(() => {
        Object.assign(mockStore, {
            activeConversationId: 'c1',
            activeMessages: [baseMessage],
            messages: { c1: [baseMessage] },
            loadingMessages: false,
            sending: false,
            error: null,
            setActiveConversation: vi.fn(),
            setLoadingMessages: vi.fn(),
            clearError: vi.fn(),
            setMessages: vi.fn(),
            markMessagesReadLocally: vi.fn(),
            resetConversationUnreadCount: vi.fn(),
            appendMessage: vi.fn(),
            replaceOptimisticMessage: vi.fn(),
            updateMessage: vi.fn(),
            prependMessages: vi.fn(),
            setSending: vi.fn(),
            setError: vi.fn(),
            removeConversation: vi.fn(),
        })
        mockAuthStore.user.value = { id: 'u1' }
        mockAuthStore.role.value = 'couple'
        vi.clearAllMocks()
    })

    it('opens a conversation and loads messages', async () => {
        (fetchMessages as any).mockResolvedValue([baseMessage])
        ;(subscribeToConversation as any).mockReturnValue({})

        const { open } = useMessages()
        await open('c1')
        expect(mockStore.setActiveConversation).toHaveBeenCalledWith('c1')
        expect(mockStore.setLoadingMessages).toHaveBeenCalledWith(true)
        expect(fetchMessages).toHaveBeenCalledWith('c1')
        expect(mockStore.setMessages).toHaveBeenCalledWith('c1', [baseMessage])
        expect(markConversationAsRead).toHaveBeenCalledWith('c1', 'u1')
        expect(mockStore.markMessagesReadLocally).toHaveBeenCalledWith('c1', 'u1')
        expect(mockStore.resetConversationUnreadCount).toHaveBeenCalledWith('c1')
        expect(subscribeToConversation).toHaveBeenCalled()
        expect(mockStore.setLoadingMessages).toHaveBeenCalledWith(false)
    })

    it('does not open if no user', async () => {
        mockAuthStore.user.value = null as any
        const { open } = useMessages()
        await open('c1')
        expect(mockStore.setActiveConversation).not.toHaveBeenCalled()
    })

    it('closes a conversation and unsubscribes', async () => {
        const fakeChannel = {}
        ;(subscribeToConversation as any).mockReturnValue(fakeChannel)
        const { open, close } = useMessages()
        await open('c1')
        await close()
        expect(unsubscribeChannel).toHaveBeenCalled()
        expect(mockStore.setActiveConversation).toHaveBeenCalledWith(null)
    })

    it('loads more messages (pagination)', async () => {
        (fetchMessages as any).mockResolvedValue([{ ...baseMessage, id: 'm2', createdAt: '2022-12-31T00:00:00Z' }])
        const { loadMore, hasMore } = useMessages()
        mockStore.activeMessages = [baseMessage]
        hasMore.value = true
        await loadMore()
        expect(fetchMessages).toHaveBeenCalledWith('c1', { before: baseMessage.createdAt })
        expect(mockStore.prependMessages).toHaveBeenCalled()
    })

    it('send sends a message optimistically and replaces it', async () => {
        (sendMessage as any).mockResolvedValue({ ...baseMessage, id: 'm2' })
        const { send } = useMessages()
        await send({ conversationId: 'c1', content: 'Hi' })
        expect(mockStore.appendMessage).toHaveBeenCalled()
        expect(sendMessage).toHaveBeenCalled()
        expect(mockStore.replaceOptimisticMessage).toHaveBeenCalled()
        expect(mockStore.setSending).toHaveBeenCalledWith(false)
    })

    it('send handles error and removes optimistic message', async () => {
        (sendMessage as any).mockRejectedValue(new Error('fail'))
        const { send } = useMessages()
        await send({ conversationId: 'c1', content: 'Hi' })
        expect(mockStore.updateMessage).toHaveBeenCalled()
        expect(mockStore.setError).toHaveBeenCalledWith('fail')
        expect(mockStore.setSending).toHaveBeenCalledWith(false)
    })

    it('deleteMessage calls softDeleteMessage and updates store', async () => {
        (softDeleteMessage as any).mockResolvedValue(undefined)
        const { deleteMessage } = useMessages()
        await deleteMessage('m1')
        expect(softDeleteMessage).toHaveBeenCalledWith('m1', 'u1')
        expect(mockStore.updateMessage).toHaveBeenCalled()
    })

    it('deleteMessage handles error', async () => {
        (softDeleteMessage as any).mockRejectedValue(new Error('fail'))
        const { deleteMessage } = useMessages()
        await deleteMessage('m1')
        expect(mockStore.setError).toHaveBeenCalledWith('fail')
    })

    it('onTyping and stopTyping broadcast typing events', () => {
        const { onTyping, stopTyping } = useMessages()
            // Simulate open to set activeChannel
        ;(subscribeToConversation as any).mockReturnValue({})
        useMessages().open('c1')
        // Manually set activeChannel for test
        ;(useMessages() as any).activeChannel = {}
        onTyping()
        stopTyping()
        expect(broadcastTyping).toHaveBeenCalled()
    })
})
