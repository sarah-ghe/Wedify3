// tests/features/messaging/services/ConversationService.spec.ts
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import * as ConversationService from '@/features/messaging/services/ConversationService'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
    },
}))

const mockFrom = supabase.from as unknown as Mock

beforeEach(() => {
    vi.clearAllMocks()
})

describe('ConversationService', () => {
    it('fetchConversations returns mapped conversations', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({
                data: [
                    {
                        id: 'c1',
                        couple_id: 'u1',
                        vendor_id: 'v1',
                        status: 'active',
                        deleted_by_couple: false,
                        deleted_by_vendor: false,
                        created_at: '2023-01-01',
                        updated_at: '2023-01-02',
                        participant: { id: 'v1', name: 'Vendor', avatar_url: 'url' },
                        lastMsg: [{ content: 'hi', created_at: '2023-01-02', is_deleted: false }],
                    },
                ],
                error: null,
            }),
        })
        const result = await ConversationService.fetchConversations('u1', 'couple')
        expect(result[0]).toMatchObject({
            id: 'c1',
            coupleId: 'u1',
            vendorId: 'v1',
            status: 'active',
            participant: { id: 'v1', name: 'Vendor', avatarUrl: 'url', role: 'vendor' },
            lastMessage: 'hi',
            lastMessageAt: '2023-01-02',
        })
    })

    it('fetchConversations throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } }),
        })
        await expect(ConversationService.fetchConversations('u1', 'couple')).rejects.toThrow('fail')
    })

    it('fetchConversationById returns mapped conversation', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: { id: 'c2', couple_id: 'u1', vendor_id: 'v2', status: 'active', created_at: 'd', updated_at: 'd' },
                error: null,
            }),
        })
        const result = await ConversationService.fetchConversationById('c2')
        expect(result.id).toBe('c2')
    })

    it('fetchConversationById throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail2' } }),
        })
        await expect(ConversationService.fetchConversationById('c2')).rejects.toThrow('fail2')
    })

    it('getOrCreateConversation returns existing', async () => {
        mockFrom
            .mockReturnValueOnce({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: 'c3', couple_id: 'a', vendor_id: 'b', status: 'active', created_at: 'd', updated_at: 'd' },
                }),
            })
        const result = await ConversationService.getOrCreateConversation({ coupleId: 'a', vendorId: 'b' })
        expect(result.id).toBe('c3')
    })

    it('getOrCreateConversation creates new if not existing', async () => {
        mockFrom
            .mockReturnValueOnce({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({ data: null }),
            })
            .mockReturnValueOnce({
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: 'c4', couple_id: 'a', vendor_id: 'b', status: 'active', created_at: 'd', updated_at: 'd' },
                    error: null,
                }),
            })
        const result = await ConversationService.getOrCreateConversation({ coupleId: 'a', vendorId: 'b' })
        expect(result.id).toBe('c4')
    })

    it('getOrCreateConversation throws on insert error', async () => {
        mockFrom
            .mockReturnValueOnce({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({ data: null }),
            })
            .mockReturnValueOnce({
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail3' } }),
            })
        await expect(ConversationService.getOrCreateConversation({ coupleId: 'a', vendorId: 'b' })).rejects.toThrow('fail3')
    })

    it('archiveConversation works', async () => {
        mockFrom.mockReturnValueOnce({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
        })
        await expect(ConversationService.archiveConversation('id', 'u', 'couple')).resolves.toBeUndefined()
    })

    it('archiveConversation throws on error', async () => {
        // eq needs to be chainable twice, then return error
        const eqMock = vi.fn()
        // First call returns the chain, second returns error result
        eqMock.mockImplementationOnce(function () { return updateChain })
        eqMock.mockImplementationOnce(function () { return { error: { message: 'fail4' } } })
        const updateChain = {
            update: vi.fn().mockReturnThis(),
            eq: eqMock,
        }
        mockFrom.mockReturnValueOnce(updateChain)
        await expect(ConversationService.archiveConversation('id', 'u', 'couple')).rejects.toThrow('fail4')
    })


    it('blockConversation works', async () => {
        mockFrom.mockReturnValueOnce({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
        })
        await expect(ConversationService.blockConversation('id', 'u', 'vendor')).resolves.toBeUndefined()
    })

    it('blockConversation throws on error', async () => {
        const eqMock = vi.fn()
        // First call returns the chain, second returns error result
        eqMock.mockImplementationOnce(function () { return updateChain })
        eqMock.mockImplementationOnce(function () { return { error: { message: 'fail5' } } })
        const updateChain = {
            update: vi.fn().mockReturnThis(),
            eq: eqMock,
        }
        mockFrom.mockReturnValueOnce(updateChain)
        await expect(ConversationService.blockConversation('id', 'u', 'vendor')).rejects.toThrow('fail5')
    })


    it('softDeleteConversation works', async () => {
        mockFrom.mockReturnValueOnce({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnValue({ error: null }),
        })
        await expect(ConversationService.softDeleteConversation('id', 'couple')).resolves.toBeUndefined()
    })

    it('softDeleteConversation throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnValue({ error: { message: 'fail6' } }),
        })
        await expect(ConversationService.softDeleteConversation('id', 'vendor')).rejects.toThrow('fail6')
    })

    it('restoreConversation works', async () => {
        mockFrom.mockReturnValueOnce({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnValue({ error: null }),
        })
        await expect(ConversationService.restoreConversation('id')).resolves.toBeUndefined()
    })

    it('restoreConversation throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnValue({ error: { message: 'fail7' } }),
        })
        await expect(ConversationService.restoreConversation('id')).rejects.toThrow('fail7')
    })
})
