import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { Conversation } from '@/features/messaging/types'
import { useConversations } from '../../../../src/features/messaging/composables/useConversations'

vi.mock('@/features/messaging/store/messaging.store', () => ({
    useMessagingStore: () => mockStore,
}))
vi.mock('@/features/auth/stores/auth.store', () => ({
    useAuthStore: () => mockAuthStore,
}))
vi.mock('@/features/messaging/services/ConversationService', () => ({
    fetchConversations: vi.fn(),
    getOrCreateConversation: vi.fn(),
    archiveConversation: vi.fn(),
    blockConversation: vi.fn(),
    softDeleteConversation: vi.fn(),
}))

import {
    fetchConversations,
    getOrCreateConversation,
    archiveConversation,
    blockConversation,
    softDeleteConversation,
} from '@/features/messaging/services/ConversationService'

// Minimal valid Conversation mock
const baseConversation: Conversation = {
    id: 'cX',
    coupleId: 'couple1',
    vendorId: 'vendor1',
    status: 'active',
    deletedByCouple: false,
    deletedByVendor: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
}

const mockStore = {
    conversations: [] as Conversation[],
    sortedConversations: [] as Conversation[],
    loadingConversations: false,
    error: null,
    setConversations: vi.fn(),
    setLoadingConversations: vi.fn(),
    clearError: vi.fn(),
    setError: vi.fn(),
    upsertConversation: vi.fn(),
    setActiveConversation: vi.fn(),
    removeConversation: vi.fn(),
    activeConversationId: null,
    activeConversation: null,
}
const mockAuthStore = {
    user: ref<{ id: string } | null>({ id: 'u1' }),
    role: ref<'couple' | 'vendor' | 'bot' | null>('couple'),
}

describe('useConversations', () => {
    beforeEach(() => {
        Object.assign(mockStore, {
            conversations: [],
            sortedConversations: [],
            loadingConversations: false,
            error: null,
            setConversations: vi.fn(),
            setLoadingConversations: vi.fn(),
            clearError: vi.fn(),
            setError: vi.fn(),
            upsertConversation: vi.fn(),
            setActiveConversation: vi.fn(),
            removeConversation: vi.fn(),
            activeConversationId: null,
            activeConversation: null,
        })
        mockAuthStore.user.value = { id: 'u1' }
        mockAuthStore.role.value = 'couple'
        vi.clearAllMocks()
    })

    it('loads conversations', async () => {
        mockAuthStore.user.value = { id: 'u1' }
        mockAuthStore.role.value = 'couple'
        (fetchConversations as any).mockResolvedValue([{ ...baseConversation, id: 'c1' }])
        const { load } = useConversations()
        await load()
        expect(fetchConversations).toHaveBeenCalledWith('u1', 'couple')
        expect(mockStore.setConversations).toHaveBeenCalled()
    })

    it('does not load if user or role is missing', async () => {
        mockAuthStore.user.value = null as any
        const { load } = useConversations()
        await load()
        expect(fetchConversations).not.toHaveBeenCalled()
    })

    it('handles load error', async () => {
        (fetchConversations as any).mockRejectedValue(new Error('fail'))
        const { load } = useConversations()
        await load()
        expect(mockStore.setError).toHaveBeenCalledWith('fail')
    })

    it('starts a conversation', async () => {
        (getOrCreateConversation as any).mockResolvedValue({ ...baseConversation, id: 'c2' })
        const { startConversation } = useConversations()
        const result = await startConversation({ coupleId: 'a', vendorId: 'b' })
        expect(getOrCreateConversation).toHaveBeenCalled()
        expect(mockStore.upsertConversation).toHaveBeenCalledWith({ ...baseConversation, id: 'c2' })
        expect(result).toEqual({ ...baseConversation, id: 'c2' })
    })

    it('handles startConversation error', async () => {
        (getOrCreateConversation as any).mockRejectedValue(new Error('fail2'))
        const { startConversation } = useConversations()
        const result = await startConversation({ coupleId: 'a', vendorId: 'b' })
        expect(mockStore.setError).toHaveBeenCalledWith('fail2')
        expect(result).toBeNull()
    })

    it('sets active conversation', () => {
        const { setActive } = useConversations()
        setActive('c3')
        expect(mockStore.setActiveConversation).toHaveBeenCalledWith('c3')
    })

    it('archives a conversation', async () => {
        (archiveConversation as any).mockResolvedValue(undefined)
        mockStore.conversations = [{ ...baseConversation, id: 'c4', status: 'active' }]
        const { archive } = useConversations()
        await archive('c4')
        expect(archiveConversation).toHaveBeenCalledWith('c4', 'u1', 'couple')
        expect(mockStore.conversations[0].status).toBe('archived')
    })

    it('blocks a conversation', async () => {
        (blockConversation as any).mockResolvedValue(undefined)
        mockStore.conversations = [{ ...baseConversation, id: 'c5', status: 'active' }]
        const { block } = useConversations()
        await block('c5')
        expect(blockConversation).toHaveBeenCalledWith('c5', 'u1', 'couple')
        expect(mockStore.conversations[0].status).toBe('blocked')
    })

    it('removes a conversation', async () => {
        (softDeleteConversation as any).mockResolvedValue(undefined)
        const { remove } = useConversations()
        await remove('c6')
        expect(softDeleteConversation).toHaveBeenCalledWith('c6', 'couple')
        expect(mockStore.removeConversation).toHaveBeenCalledWith('c6')
    })

    it('handles archive error', async () => {
        (archiveConversation as any).mockRejectedValue(new Error('fail3'))
        const { archive } = useConversations()
        await archive('c7')
        expect(mockStore.setError).toHaveBeenCalledWith('fail3')
    })

    it('handles block error', async () => {
        (blockConversation as any).mockRejectedValue(new Error('fail4'))
        const { block } = useConversations()
        await block('c8')
        expect(mockStore.setError).toHaveBeenCalledWith('fail4')
    })

    it('handles remove error', async () => {
        (softDeleteConversation as any).mockRejectedValue(new Error('fail5'))
        const { remove } = useConversations()
        await remove('c9')
        expect(mockStore.setError).toHaveBeenCalledWith('fail5')
    })
})
