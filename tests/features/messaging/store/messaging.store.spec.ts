import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from "vitest";
import {useMessagingStore} from "../../../../src/features/messaging/store/messaging.store";
import {Conversation, Message} from "../../../../src/features/messaging/types";

describe('messaging.store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    function mockConversation(id = '1'): Conversation {
        return {
            id,
            coupleId: 'c1',
            vendorId: 'v1',
            status: 'active',
            deletedByCouple: false,
            deletedByVendor: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            lastMessage: 'Hello',
            lastMessageAt: '2023-01-01T00:00:00Z',
            unreadCount: 2,
        }
    }

    function mockMessage(id = 'm1', conversationId = '1'): Message {
        return {
            id,
            conversationId,
            senderId: 'c1',
            senderRole: 'couple',
            content: 'Hi',
            contentType: 'text',
            status: 'sent',
            isDeleted: false,
            createdAt: '2023-01-01T00:00:00Z',
        }
    }

    it('sets and gets conversations', () => {
        const store = useMessagingStore()
        const conv = mockConversation()
        store.setConversations([conv])
        expect(store.conversations).toHaveLength(1)
        expect(store.sortedConversations[0].id).toBe(conv.id)
        expect(store.conversationIds).toContain(conv.id)
    })

    it('upserts and removes conversations', () => {
        const store = useMessagingStore()
        const conv = mockConversation('2')
        store.upsertConversation(conv)
        expect(store.conversations[0].id).toBe('2')
        store.removeConversation('2')
        expect(store.conversations).toHaveLength(0)
    })

    it('sets active conversation and gets activeConversation', () => {
        const store = useMessagingStore()
        const conv = mockConversation('3')
        store.setConversations([conv])
        store.setActiveConversation('3')
        expect(store.activeConversation?.id).toBe('3')
        expect(store.activeConversationId).toBe('3')
    })

    it('sets, prepends, and appends messages', () => {
        const store = useMessagingStore()
        const msg1 = mockMessage('m1', 'c1')
        const msg2 = mockMessage('m2', 'c1')
        store.setMessages('c1', [msg1])
        expect(store.messages['c1']).toHaveLength(1)
        store.prependMessages('c1', [msg2])
        expect(store.messages['c1'][0].id).toBe('m2')
        store.appendMessage('c1', { ...msg1, id: 'm3' })
        expect(store.messages['c1'].some(m => m.id === 'm3')).toBe(true)
    })

    it('replaces optimistic message', () => {
        const store = useMessagingStore()
        const tempMsg = mockMessage('temp1', 'c2')
        store.setMessages('c2', [tempMsg])
        const realMsg = mockMessage('real1', 'c2')
        store.replaceOptimisticMessage('c2', 'temp1', realMsg)
        expect(store.messages['c2'][0].id).toBe('real1')
    })

    it('updates a message', () => {
        const store = useMessagingStore()
        const msg = mockMessage('m4', 'c3')
        store.setMessages('c3', [msg])
        store.updateMessage('c3', { ...msg, content: 'Updated' })
        expect(store.messages['c3'][0].content).toBe('Updated')
    })

    it('marks messages as read locally', () => {
        const store = useMessagingStore()
        const msg = { ...mockMessage('m5', 'c4'), senderId: 'other', readAt: undefined }
        store.setMessages('c4', [msg])
        store.markMessagesReadLocally('c4', 'user')
        expect(store.messages['c4'][0].status).toBe('read')
        expect(store.messages['c4'][0].readAt).toBeTruthy()
    })

    it('handles unread count', () => {
        const store = useMessagingStore()
        store.setUnreadCount(5)
        expect(store.unreadCount).toBe(5)
        store.incrementUnread()
        expect(store.unreadCount).toBe(6)
        store.decrementUnread(2)
        expect(store.unreadCount).toBe(4)
        store.decrementUnread(10)
        expect(store.unreadCount).toBe(0)
    })

    it('handles loading and error state', () => {
        const store = useMessagingStore()
        store.setLoadingConversations(true)
        expect(store.loadingConversations).toBe(true)
        store.setLoadingMessages(true)
        expect(store.loadingMessages).toBe(true)
        store.setSending(true)
        expect(store.sending).toBe(true)
        store.setError('err')
        expect(store.error).toBe('err')
        store.clearError()
        expect(store.error).toBeNull()
    })
})
