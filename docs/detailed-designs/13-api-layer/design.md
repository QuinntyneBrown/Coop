# 13 - API Layer: Detailed Design

## 1. Overview

The Coop API Layer is an ASP.NET Core REST API that serves as the single entry point for all client interactions with the cooperative management platform. Built on the **CQRS + Mediator** pattern, every controller delegates to `IMediator`, which routes commands and queries through a pipeline of validation behaviors and handlers before reaching the persistence layer.

The API is secured with **JWT Bearer authentication**, uses **FluentValidation** for request validation via MediatR pipeline behaviors, and exposes a **Swagger/OpenAPI** specification at the root URL for interactive documentation.

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| Thin controllers (no business logic) | All logic lives in Application-layer handlers; controllers only marshal HTTP |
| MediatR pipeline | Cross-cutting concerns (validation, authorization) are handled as behaviors |
| Convention-based routing (`api/[controller]`) | Consistent, discoverable REST endpoints |
| Paginated queries via route params | `GET /api/{resource}/page/{pageSize}/{index}` avoids query-string clutter |
| JWT with symmetric key | Stateless auth suitable for single-deployment co-op scenario |

## 2. Diagrams

### 2.1 Class Diagram -- Controllers

![Class Diagram](class-diagram.png)

### 2.2 Request Pipeline Sequence

![Request Pipeline](sequence-request-pipeline.png)

### 2.3 Paginated Query Flow

![Pagination Sequence](sequence-pagination.png)

### 2.4 Request Lifecycle State Machine

![Request Lifecycle](state-request-lifecycle.png)

### 2.5 C4 Context

![C4 Context](c4-context.png)

### 2.6 C4 Container

![C4 Container](c4-container.png)

### 2.7 C4 Component

![C4 Component](c4-component.png)

## 3. Component Descriptions

### 3.1 Controllers

All controllers follow the same structural pattern:

- Declared as POCO classes (no `ControllerBase` inheritance) annotated with `[ApiController]` and `[Route("api/[controller]")]`.
- Receive `IMediator` (and optionally `ILogger<T>`) via constructor injection.
- Each action method creates or binds a request object, sends it through `_mediator.Send()`, and returns the response.

#### 3.1.1 UserController `[Authorize]`

Manages user accounts and authentication. The `[Authorize]` attribute is applied at the class level; `Authenticate` and `UsernameExists` override with `[AllowAnonymous]` to permit unauthenticated access.

#### 3.1.2 ProfileController

Manages user profiles including avatar updates. Provides a `GetCurrent` endpoint that resolves the profile from the authenticated user's claims.

#### 3.1.3 MaintenanceRequestController `[Authorize]`

The most action-rich controller. Beyond standard CRUD, it exposes workflow-specific endpoints: `Start`, `Receive`, `Complete`, `UpdateDescription`, and `UpdateWorkDetails`. Also supports `GetByCurrentProfile` to scope requests to the logged-in member.

#### 3.1.4 People Controllers (BoardMember, StaffMember, Member, OnCall)

Standard CRUD + pagination for the four people-type entities. No special authorization attributes beyond global defaults.

#### 3.1.5 Content Controllers (Document, Notice, ByLaw, Report)

Manage co-op content artifacts. Notice, ByLaw, and Report controllers include a `GetPublished` endpoint that filters to published-only content. Document follows standard CRUD.

#### 3.1.6 Messaging Controllers (Conversation, Message)

Conversation supports standard CRUD. Message adds `GetMy` (current profile messages) and `CreateSupport` for support-channel messages.

#### 3.1.7 DigitalAssetController

File/binary management. Unique endpoints include `Upload` (POST with `[DisableRequestSizeLimit]`), `Serve` (returns `FileContentResult` with `[AllowAnonymous]`), and `GetByIds` (batch retrieval by query).

#### 3.1.8 Customization Controllers (Theme, JsonContent)

Theme supports `GetDefault` and `GetByProfileId` lookups. JsonContent supports `GetByName` for named-content retrieval.

#### 3.1.9 Security Controllers (Role, Privilege)

Standard CRUD + pagination for RBAC configuration.

#### 3.1.10 InvitationTokenController

Manages invitation tokens for onboarding new co-op members. Includes `Validate` (`[AllowAnonymous]`) to verify token validity without authentication.

#### 3.1.11 Event Controllers (Events, StoredEvent)

Events controller exposes server-sent events or event streams. StoredEvent provides read access to the event-sourcing audit log.

### 3.2 Middleware Pipeline

The `Startup.Configure` method establishes the following middleware order:

1. **Serilog Request Logging** -- structured logging with user ID and timing
2. **Swagger** -- OpenAPI JSON generation
3. **CORS** -- configured via `CorsPolicy` with origins from `appsettings`
4. **Routing**
5. **Authentication** -- JWT Bearer validation
6. **Authorization** -- policy + resource-based authorization
7. **Endpoints** -- controller mapping
8. **Swagger UI** -- interactive docs at root path

### 3.3 Dependency Injection (Dependencies.cs)

| Registration | Lifetime | Purpose |
|---|---|---|
| `IMediator` | Transient | MediatR command/query dispatcher |
| `ICoopDbContext` / `CoopDbContext` | Scoped | EF Core database context (SQL Server) |
| `ITokenProvider` / `TokenProvider` | Singleton | JWT token generation |
| `IPasswordHasher` / `PasswordHasher` | Singleton | BCrypt password hashing |
| `INotificationService` | Singleton | Real-time notification dispatch |
| `IOrchestrationHandler` | Scoped | Cross-aggregate orchestration |
| `ResourceOperationAuthorizationBehavior` | Transient | MediatR pipeline behavior for privilege checks |
| `ValidationBehavior` (via `AddValidation`) | Transient | MediatR pipeline behavior for FluentValidation |

## 4. Endpoint Reference

### 4.1 User Management

| Method | Route | Action | Auth | Description |
|---|---|---|---|---|
| GET | `/api/user/{userId}` | GetById | Authorize | Get user by ID |
| GET | `/api/user` | Get | Authorize | Get all users |
| GET | `/api/user/exists/{username}` | UsernameExists | AllowAnonymous | Check if username is taken |
| GET | `/api/user/current` | GetCurrent | AllowAnonymous | Get current authenticated user |
| POST | `/api/user` | Create | Authorize | Create a new user |
| GET | `/api/user/page/{pageSize}/{index}` | Page | Authorize | Paginated user list |
| PUT | `/api/user` | Update | Authorize | Update a user |
| DELETE | `/api/user/{userId}` | Remove | Authorize | Delete a user |
| POST | `/api/user/token` | Authenticate | AllowAnonymous | Authenticate and receive JWT |

### 4.2 Profile Management

| Method | Route | Action | Auth | Description |
|---|---|---|---|---|
| GET | `/api/profile/{profileId}` | GetById | Default | Get profile by ID |
| GET | `/api/profile` | Get | Default | Get all profiles |
| GET | `/api/profile/current` | GetCurrent | Default | Get current user profile |
| POST | `/api/profile` | Create | Default | Create profile |
| GET | `/api/profile/page/{pageSize}/{index}` | Page | Default | Paginated profile list |
| PUT | `/api/profile` | Update | Default | Update profile |
| PUT | `/api/profile/avatar` | UpdateAvatar | Default | Update profile avatar |
| DELETE | `/api/profile/{profileId}` | Remove | Default | Delete profile |

### 4.3 Maintenance Requests

| Method | Route | Action | Auth | Description |
|---|---|---|---|---|
| GET | `/api/maintenancerequest/{id}` | GetById | Authorize | Get request by ID |
| GET | `/api/maintenancerequest/my` | GetByCurrentProfile | Authorize | Get current user's requests |
| GET | `/api/maintenancerequest` | Get | Authorize | Get all requests |
| GET | `/api/maintenancerequest/page/{pageSize}/{index}` | Page | Authorize | Paginated request list |
| POST | `/api/maintenancerequest` | Create | Authorize | Create maintenance request |
| PUT | `/api/maintenancerequest` | Update | Authorize | Full update |
| PUT | `/api/maintenancerequest/description` | UpdateDescription | Authorize | Update description only |
| PUT | `/api/maintenancerequest/work-details` | UpdateWorkDetails | Authorize | Update work details |
| PUT | `/api/maintenancerequest/start` | Start | Authorize | Transition to In Progress |
| PUT | `/api/maintenancerequest/receive` | Receive | Authorize | Mark as received |
| PUT | `/api/maintenancerequest/complete` | Complete | Authorize | Mark as completed |
| DELETE | `/api/maintenancerequest/{id}` | Remove | Authorize | Delete request |

### 4.4 People

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/boardmember/{id}` | Default | Get board member by ID |
| GET | `/api/boardmember` | Default | Get all board members |
| GET | `/api/boardmember/page/{pageSize}/{index}` | Default | Paginated board members |
| PUT | `/api/boardmember` | Default | Update board member |
| DELETE | `/api/boardmember/{id}` | Default | Remove board member |
| GET | `/api/staffmember/{id}` | Default | Get staff member by ID |
| GET | `/api/staffmember` | Default | Get all staff members |
| GET | `/api/staffmember/page/{pageSize}/{index}` | Default | Paginated staff members |
| PUT | `/api/staffmember` | Default | Update staff member |
| DELETE | `/api/staffmember/{id}` | Default | Remove staff member |
| GET | `/api/member/{id}` | Default | Get member by ID |
| GET | `/api/member` | Default | Get all members |
| GET | `/api/member/page/{pageSize}/{index}` | Default | Paginated members |
| PUT | `/api/member` | Default | Update member |
| DELETE | `/api/member/{id}` | Default | Remove member |
| GET | `/api/oncall/{id}` | Default | Get on-call by ID |
| GET | `/api/oncall` | Default | Get all on-call entries |
| GET | `/api/oncall/page/{pageSize}/{index}` | Default | Paginated on-call |
| PUT | `/api/oncall` | Default | Update on-call |
| DELETE | `/api/oncall/{id}` | Default | Remove on-call |

### 4.5 Content (Document, Notice, ByLaw, Report)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/document/{id}` | Default | Get document by ID |
| GET | `/api/document` | Default | Get all documents |
| POST | `/api/document` | Default | Create document |
| GET | `/api/document/page/{pageSize}/{index}` | Default | Paginated documents |
| PUT | `/api/document` | Default | Update document |
| DELETE | `/api/document/{id}` | Default | Remove document |
| GET | `/api/notice/{id}` | Default | Get notice by ID |
| GET | `/api/notice` | Default | Get all notices |
| GET | `/api/notice/published` | Default | Get published notices only |
| POST | `/api/notice` | Default | Create notice |
| GET | `/api/notice/page/{pageSize}/{index}` | Default | Paginated notices |
| PUT | `/api/notice` | Default | Update notice |
| DELETE | `/api/notice/{id}` | Default | Remove notice |
| GET | `/api/bylaw/{id}` | Default | Get by-law by ID |
| GET | `/api/bylaw` | Default | Get all by-laws |
| GET | `/api/bylaw/published` | Default | Get published by-laws only |
| POST | `/api/bylaw` | Default | Create by-law |
| GET | `/api/bylaw/page/{pageSize}/{index}` | Default | Paginated by-laws |
| PUT | `/api/bylaw` | Default | Update by-law |
| DELETE | `/api/bylaw/{id}` | Default | Remove by-law |
| GET | `/api/report/{id}` | Default | Get report by ID |
| GET | `/api/report` | Default | Get all reports |
| GET | `/api/report/published` | Default | Get published reports only |
| POST | `/api/report` | Default | Create report |
| GET | `/api/report/page/{pageSize}/{index}` | Default | Paginated reports |
| PUT | `/api/report` | Default | Update report |
| DELETE | `/api/report/{id}` | Default | Remove report |

### 4.6 Messaging

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/conversation/{id}` | Default | Get conversation by ID |
| GET | `/api/conversation` | Default | Get all conversations |
| POST | `/api/conversation` | Default | Create conversation |
| GET | `/api/conversation/page/{pageSize}/{index}` | Default | Paginated conversations |
| PUT | `/api/conversation` | Default | Update conversation |
| DELETE | `/api/conversation/{id}` | Default | Remove conversation |
| GET | `/api/message/{id}` | Default | Get message by ID |
| GET | `/api/message` | Default | Get all messages |
| GET | `/api/message/my` | Default | Get current profile messages |
| POST | `/api/message` | Default | Create message |
| POST | `/api/message/support` | Default | Create support message |
| GET | `/api/message/page/{pageSize}/{index}` | Default | Paginated messages |
| PUT | `/api/message` | Default | Update message |
| DELETE | `/api/message/{id}` | Default | Remove message |

### 4.7 Digital Assets

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/digitalasset/{id}` | Default | Get asset by ID |
| GET | `/api/digitalasset/range` | Default | Get assets by IDs (query) |
| GET | `/api/digitalasset/page/{pageSize}/{index}` | Default | Paginated assets |
| POST | `/api/digitalasset/upload` | Default | Upload file (no size limit) |
| GET | `/api/digitalasset/serve/{id}` | AllowAnonymous | Serve file content |
| DELETE | `/api/digitalasset/{id}` | Default | Remove asset |

### 4.8 Customization

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/theme/{id}` | Default | Get theme by ID |
| GET | `/api/theme/default` | Default | Get default theme |
| GET | `/api/theme/profile/{profileId}` | Default | Get theme by profile |
| GET | `/api/theme` | Default | Get all themes |
| POST | `/api/theme` | Default | Create theme |
| GET | `/api/theme/page/{pageSize}/{index}` | Default | Paginated themes |
| PUT | `/api/theme` | Default | Update theme |
| DELETE | `/api/theme/{id}` | Default | Remove theme |
| GET | `/api/jsoncontent/{id}` | Default | Get JSON content by ID |
| GET | `/api/jsoncontent/name/{name}` | Default | Get JSON content by name |
| GET | `/api/jsoncontent` | Default | Get all JSON content |
| POST | `/api/jsoncontent` | Default | Create JSON content |
| GET | `/api/jsoncontent/page/{pageSize}/{index}` | Default | Paginated JSON content |
| PUT | `/api/jsoncontent` | Default | Update JSON content |
| DELETE | `/api/jsoncontent/{id}` | Default | Remove JSON content |

### 4.9 Security (Role, Privilege)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/role/{id}` | Default | Get role by ID |
| GET | `/api/role` | Default | Get all roles |
| POST | `/api/role` | Default | Create role |
| GET | `/api/role/page/{pageSize}/{index}` | Default | Paginated roles |
| PUT | `/api/role` | Default | Update role |
| DELETE | `/api/role/{id}` | Default | Remove role |
| GET | `/api/privilege/{id}` | Default | Get privilege by ID |
| GET | `/api/privilege` | Default | Get all privileges |
| POST | `/api/privilege` | Default | Create privilege |
| GET | `/api/privilege/page/{pageSize}/{index}` | Default | Paginated privileges |
| PUT | `/api/privilege` | Default | Update privilege |
| DELETE | `/api/privilege/{id}` | Default | Remove privilege |

### 4.10 Invitation, Events

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/invitationtoken/{id}` | Default | Get invitation by ID |
| GET | `/api/invitationtoken` | Default | Get all invitations |
| POST | `/api/invitationtoken` | Default | Create invitation |
| GET | `/api/invitationtoken/page/{pageSize}/{index}` | Default | Paginated invitations |
| PUT | `/api/invitationtoken` | Default | Update invitation |
| DELETE | `/api/invitationtoken/{id}` | Default | Remove invitation |
| GET | `/api/invitationtoken/validate/{value}` | AllowAnonymous | Validate token |
| GET | `/api/events/{id}` | Default | Get event by ID |
| GET | `/api/events` | Default | Get all events |
| GET | `/api/storedevent/{id}` | Default | Get stored event by ID |
| GET | `/api/storedevent` | Default | Get all stored events |
| GET | `/api/storedevent/page/{pageSize}/{index}` | Default | Paginated stored events |

## 5. Cross-Cutting Concerns

### 5.1 Error Handling

All endpoints declare `ProducesResponseType` for:
- **200 OK** -- successful response with typed body
- **400 Bad Request** -- `ProblemDetails` from validation failures
- **404 Not Found** -- resource not found (GetById patterns)
- **500 Internal Server Error** -- unhandled exceptions

### 5.2 Pagination Convention

All paginated endpoints follow the pattern:
```
GET /api/{resource}/page/{pageSize}/{index}
```
where `pageSize` is the number of items per page and `index` is the zero-based page index. The handler applies `Skip(index * pageSize).Take(pageSize)` on the `DbContext` query.

### 5.3 Authentication Flow

1. Client sends credentials to `POST /api/user/token`
2. Handler validates credentials, generates JWT with claims (userId, username, privileges)
3. Subsequent requests include `Authorization: Bearer {token}`
4. JWT middleware validates signature, issuer, audience, and expiry
5. `ResourceOperationAuthorizationBehavior` checks per-resource privileges in the MediatR pipeline
