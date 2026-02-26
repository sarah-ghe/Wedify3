export type ConversationStatus = 'active' | 'archived' | 'blocked'
export type MessageStatus = 'sent' | 'delivered' | 'read'
export type SenderRole = 'couple' | 'vendor' | 'bot'
export type ContentType = 'text' | 'image' | 'file' | 'booking_request' | 'system'

export interface Participant {
    id: string
    role: SenderRole
    name: string
    avatarUrl?: string
}

export interface Conversation {
    id: string
    coupleId: string
    vendorId: string
    status: ConversationStatus
    deletedByCouple: boolean
    deletedByVendor: boolean
    deletedByCoupleAt?: string
    deletedByVendorAt?: string
    createdAt: string
    updatedAt: string
    // populated via join — the other party from current user's perspective
    participant?: Participant
    // derived from latest message
    lastMessage?: string
    lastMessageAt?: string
    unreadCount?: number
}

export interface Message {
    id: string
    conversationId: string
    senderId: string
    senderRole: SenderRole
    content: string | null
    contentType: ContentType
    status: MessageStatus
    readAt?: string
    isDeleted: boolean
    deletedAt?: string
    metadata?: MessageMetadata
    createdAt: string
    attachments?: Attachment[]
}

export interface Attachment {
    id: string
    messageId: string
    url: string
    fileName?: string
    fileSize?: number
    mimeType?: string
    createdAt: string
}

// ─── METADATA SHAPES (stored in message.metadata jsonb) ──────────────────────

export interface BookingRequestMetadata {
    bookingId: string
    packageId: string
    packageName: string
    date: string
    status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
}

export interface SystemMessageMetadata {
    event: 'booking_confirmed' | 'booking_rejected' | 'booking_cancelled' | 'conversation_started'
    referenceId?: string
}

export type MessageMetadata = BookingRequestMetadata | SystemMessageMetadata | Record<string, unknown>

// ─── PAYLOADS ────────────────────────────────────────────────────────────────

export interface CreateConversationPayload {
    coupleId: string
    vendorId: string
    initialMessage?: string
}

export interface SendMessagePayload {
    conversationId: string
    content: string
    contentType?: ContentType
    metadata?: MessageMetadata
    attachments?: File[]
}

export interface SendBotMessagePayload {
    conversationId: string
    content: string
    contentType?: ContentType
    metadata?: MessageMetadata
}

// ─── QUERY OPTIONS ───────────────────────────────────────────────────────────

export interface FetchMessagesOptions {
    limit?: number
    offset?: number
    before?: string // ISO timestamp — for cursor-based pagination
}

// ─── STORE STATE ─────────────────────────────────────────────────────────────

export interface MessagingState {
    conversations: Conversation[]
    activeConversationId: string | null
    messages: Record<string, Message[]> // keyed by conversationId
    unreadCount: number
    loadingConversations: boolean
    loadingMessages: boolean
    sending: boolean
    error: string | null
}

// ─── REALTIME ────────────────────────────────────────────────────────────────

export interface TypingPayload {
    userId: string
    conversationId: string
    isTyping: boolean
}

export interface PresenceState {
    userId: string
    onlineAt: string
}
