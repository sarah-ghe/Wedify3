import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import * as MessageService from '@/features/messaging/services/MessageService'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
        storage: {
            from: vi.fn().mockReturnThis(),
            upload: vi.fn(),
            getPublicUrl: vi.fn(),
        },
    },
}))

const mockFrom = supabase.from as unknown as Mock
const mockStorage = supabase.storage as any

beforeEach(() => {
    vi.clearAllMocks()
})

describe('MessageService', () => {
    it('fetchMessages returns mapped messages', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({
                data: [
                    {
                        id: 'm1',
                        conversation_id: 'c1',
                        sender_id: 'u1',
                        sender_role: 'couple',
                        content: 'hi',
                        content_type: 'text',
                        status: 'sent',
                        is_deleted: false,
                        created_at: '2023-01-01',
                        attachments: [],
                    },
                ],
                error: null,
            }),
        })
        const result = await MessageService.fetchMessages('c1')
        expect(result[0]).toMatchObject({
            id: 'm1',
            conversationId: 'c1',
            senderId: 'u1',
            content: 'hi',
        })
    })

    it('fetchMessages throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } }),
        })
        expect(MessageService.fetchMessages('c1')).rejects.toThrow('fail')
    })

    it('fetchMessageById returns mapped message', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: { id: 'm2', conversation_id: 'c1', sender_id: 'u1', content: 'yo', content_type: 'text', status: 'sent', is_deleted: false, created_at: 'd', attachments: [] },
                error: null,
            }),
        })
        const result = await MessageService.fetchMessageById('m2')
        expect(result.id).toBe('m2')
    })

    it('fetchMessageById throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail2' } }),
        })
        expect(MessageService.fetchMessageById('m2')).rejects.toThrow('fail2')
    })

    it('sendMessage inserts and returns message', async () => {
        mockFrom
            .mockReturnValueOnce({
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: 'm3', conversation_id: 'c1', sender_id: 'u1', content: 'sent', content_type: 'text', status: 'sent', is_deleted: false, created_at: 'd' },
                    error: null,
                }),
            })
            .mockReturnValueOnce({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: 'm3', conversation_id: 'c1', sender_id: 'u1', content: 'sent', content_type: 'text', status: 'sent', is_deleted: false, created_at: 'd', attachments: [] },
                    error: null,
                }),
            })
        const result = await MessageService.sendMessage({ conversationId: 'c1', content: 'sent' }, 'u1', 'couple')
        expect(result.id).toBe('m3')
    })

    it('sendMessage throws on insert error', async () => {
        mockFrom.mockReturnValueOnce({
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail3' } }),
        })
        expect(MessageService.sendMessage({ conversationId: 'c1', content: 'fail' }, 'u1', 'couple')).rejects.toThrow('fail3')
    })

    it('sendBotMessage inserts and returns message', async () => {
        mockFrom.mockReturnValueOnce({
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: { id: 'm4', conversation_id: 'c1', sender_id: 'bot', content: 'bot', content_type: 'system', status: 'delivered', is_deleted: false, created_at: 'd' },
                error: null,
            }),
        })
        const result = await MessageService.sendBotMessage({ conversationId: 'c1', content: 'bot' })
        expect(result.id).toBe('m4')
    })

    it('sendBotMessage throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail4' } }),
        })
        expect(MessageService.sendBotMessage({ conversationId: 'c1', content: 'fail' })).rejects.toThrow('fail4')
    })

    it('markConversationAsRead updates messages', async () => {
        mockFrom.mockReturnValueOnce({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            is: vi.fn().mockResolvedValue({ error: null }),
        })
        await expect(MessageService.markConversationAsRead('c1', 'u1')).resolves.toBeUndefined()
    })

    it('markConversationAsRead throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            is: vi.fn().mockResolvedValue({ error: { message: 'fail5' } }),
        })
        expect(MessageService.markConversationAsRead('c1', 'u1')).rejects.toThrow('fail5')
    })

    it('fetchUnreadCount returns count', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            is: vi.fn().mockResolvedValue({ count: 2, error: null }),
        })
        const count = await MessageService.fetchUnreadCount('u1', ['c1'])
        expect(count).toBe(2)
    })

    it('fetchUnreadCount throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            is: vi.fn().mockResolvedValue({ count: null, error: { message: 'fail6' } }),
        })
        expect(MessageService.fetchUnreadCount('u1', ['c1'])).rejects.toThrow('fail6')
    })

    it('fetchUnreadCountPerConversation returns counts', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            is: vi.fn().mockResolvedValue({
                data: [
                    { conversation_id: 'c1' },
                    { conversation_id: 'c1' },
                    { conversation_id: 'c2' },
                ],
                error: null,
            }),
        })
        const result = await MessageService.fetchUnreadCountPerConversation('u1', ['c1', 'c2'])
        expect(result).toEqual({ c1: 2, c2: 1 })
    })

    it('fetchUnreadCountPerConversation throws on error', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            is: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail7' } }),
        })
        expect(MessageService.fetchUnreadCountPerConversation('u1', ['c1'])).rejects.toThrow('fail7')
    })

    it('softDeleteMessage works', async () => {
        // fetchMessageById returns message owned by requester
        mockFrom
            .mockReturnValueOnce({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: 'm5', sender_id: 'u1', is_deleted: false, conversation_id: 'c1', content: 'x', content_type: 'text', status: 'sent', created_at: 'd', attachments: [] },
                    error: null,
                }),
            })
            .mockReturnValueOnce({
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null }),
            })
        await expect(MessageService.softDeleteMessage('m5', 'u1')).resolves.toBeUndefined()
    })

    it('softDeleteMessage throws if not owner', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: { id: 'm6', sender_id: 'u2', is_deleted: false, conversation_id: 'c1', content: 'x', content_type: 'text', status: 'sent', created_at: 'd', attachments: [] },
                error: null,
            }),
        })
        expect(MessageService.softDeleteMessage('m6', 'u1')).rejects.toThrow('Unauthorized')
    })

    it('softDeleteMessage throws if already deleted', async () => {
        mockFrom.mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: { id: 'm7', sender_id: 'u1', is_deleted: true, conversation_id: 'c1', content: 'x', content_type: 'text', status: 'sent', created_at: 'd', attachments: [] },
                error: null,
            }),
        })
        expect(MessageService.softDeleteMessage('m7', 'u1')).rejects.toThrow('already deleted')
    })

    it('softDeleteMessage throws on update error', async () => {
        // fetchMessageById returns valid
        mockFrom
            .mockReturnValueOnce({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: { id: 'm8', sender_id: 'u1', is_deleted: false, conversation_id: 'c1', content: 'x', content_type: 'text', status: 'sent', created_at: 'd', attachments: [] },
                    error: null,
                }),
            })
            .mockReturnValueOnce({
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnValue({ error: { message: 'fail8' } }),
            })
        expect(MessageService.softDeleteMessage('m8', 'u1')).rejects.toThrow('fail8')
    })

    it('uploadAttachments uploads and inserts', async () => {
        // Mock upload and insert
        mockStorage.from.mockReturnThis()
        mockStorage.upload.mockResolvedValue({ error: null })
        mockStorage.getPublicUrl.mockReturnValue({ data: { publicUrl: 'url' } })
        mockFrom.mockReturnValue({
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: { id: 'a1', message_id: 'm1', url: 'url', file_name: 'f.txt', file_size: 1, mime_type: 'text/plain', created_at: 'd' },
                error: null,
            }),
        })
        const file = new File(['x'], 'f.txt', { type: 'text/plain' })
        // @ts-expect-error test private
        const result = await MessageService['uploadAttachments']('m1', 'c1', [file])
        expect(result[0]).toMatchObject({ id: 'a1', url: 'url' })
    })
})
