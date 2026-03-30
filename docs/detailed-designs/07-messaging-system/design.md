# 07 - Messaging System: Detailed Design

## 1. Overview

The Messaging System provides direct communication between member profiles within the Coop platform. It supports creating conversations between participants, sending and receiving messages, and tracking read or unread status. In the modular monolith, the Messaging module keeps a lightweight reference to participants through profile IDs so it can remain decoupled from the Profile module while still running in the same deployable backend.

Key capabilities:

- Create a conversation between two profiles with duplicate-conversation prevention
- Send messages within an existing conversation with participant validation
- Retrieve conversations by profile, between two profiles, or by ID
- Retrieve messages by conversation with pagination
- Query unread messages and unread counts per profile
- Mark individual messages or entire conversations as read
- Raise internal notifications for audit, activity feeds, or future real-time delivery

## 2. Domain Model

| Entity | Property | Type | Notes |
|---|---|---|---|
| Conversation | ConversationId | Guid | Primary key |
| Conversation | ParticipantProfileIds | List\<Guid\> | Keeps module boundaries explicit |
| Conversation | Messages | List\<Message\> | Owned collection |
| Conversation | CreatedAt | DateTime | UTC timestamp |
| Conversation | LastMessageAt | DateTime? | Updated on send |
| Message | MessageId | Guid | Primary key |
| Message | ConversationId | Guid | Required FK |
| Message | FromProfileId | Guid | Sender profile |
| Message | ToProfileId | Guid | Recipient profile |
| Message | Body | string | Message content |
| Message | IsRead | bool | Read status flag |
| Message | ReadAt | DateTime? | Timestamp when marked read |
| Message | CreatedAt | DateTime | UTC timestamp |

Key domain methods:

- `Conversation.AddMessage(fromProfileId, toProfileId, body)` validates both IDs are participants, creates a message, and updates `LastMessageAt`
- `Conversation.HasParticipant(profileId)` checks membership
- `Message.MarkAsRead()` is idempotent and stamps `ReadAt` on first use

## 3. Class Diagram

![Class Diagram](class-diagram.png)

## 4. API Layer

### 4.1 ConversationsController

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/conversations/by-profile/{profileId}` | List conversations for a profile |
| GET | `/api/conversations/{conversationId}` | Get conversation with messages |
| GET | `/api/conversations/between/{id1}/{id2}` | Find conversation between two profiles |
| POST | `/api/conversations` | Create a new conversation |
| POST | `/api/conversations/{id}/messages` | Send a message in a conversation |

### 4.2 MessagesController

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/messages/{messageId}` | Get a single message |
| GET | `/api/messages/by-conversation/{conversationId}` | Paginated messages for a conversation |
| GET | `/api/messages/unread/{profileId}` | All unread messages for a profile |
| GET | `/api/messages/unread-count/{profileId}` | Unread message count |
| POST | `/api/messages/{messageId}/read` | Mark a single message as read |
| POST | `/api/messages/mark-conversation-read/{conversationId}/{id}` | Mark all messages in a conversation as read |

All endpoints require `[Authorize]`.

## 5. Sequence Diagrams

### 5.1 Create Conversation

![Create Conversation Sequence](sequence-create-conversation.png)

### 5.2 Send Message

![Send Message Sequence](sequence-send-message.png)

## 6. Message Lifecycle State Diagram

![Message Lifecycle](state-message-lifecycle.png)

## 7. C4 Architecture Diagrams

### 7.1 System Context

![C4 Context](c4-context.png)

### 7.2 Container

![C4 Container](c4-container.png)

### 7.3 Component

![C4 Component](c4-component.png)

## 8. Infrastructure

- **Database**: `MessagingDbContext` with `DbSet<Message>` and `DbSet<Conversation>`
- **Configuration**: Entity configurations applied via `ApplyConfigurationsFromAssembly`
- **Internal Notifications**: Conversation and message events can be dispatched in-process for audit or real-time adapters
- **Authorization**: All endpoints are protected with JWT authentication

## 9. Key Design Decisions

1. **Participant list as `List<Guid>`** keeps the Messaging module decoupled from Profile aggregates.
2. **`LastMessageAt`** enables efficient sort-by-recent behavior without scanning the full message set.
3. **Idempotent `MarkAsRead()`** prevents duplicate updates and inconsistent read timestamps.
4. **Duplicate conversation prevention** ensures only one direct conversation exists between the same participants.
5. **Pagination** on message retrieval supports long-running conversations efficiently.
