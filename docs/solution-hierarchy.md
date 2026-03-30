# Coop Solution Hierarchy

This document describes the complete folder structure of the Coop solution, a cooperative housing management platform built with .NET and Angular. The solution combines a monolithic API (the original architecture) with a microservices layer (the refactored architecture), connected through a shared kernel.

---

## Complete Directory Tree

```
Coop/
├── Coop.sln                                    # Root solution file
├── README.md
│
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-white-bay-0cf53f60f.yml   # CI/CD pipeline
│
├── docs/
│   ├── ui-design.pen                            # UI design file
│   ├── specs/
│   │   ├── L1.md                                # Level 1 specification
│   │   └── L2.md                                # Level 2 specification
│   └── detailed-designs/
│       ├── 01-user-account-management/          # PlantUML diagrams (C4, sequence, class, state)
│       ├── 02-authentication-and-authorization/
│       ├── 03-role-and-privilege-management/
│       ├── 04-profile-management/
│       ├── 05-maintenance-request-workflow/
│       ├── 06-document-management/
│       ├── 07-messaging-system/
│       ├── 08-digital-asset-management/
│       ├── 09-invitation-and-onboarding/
│       ├── 10-theme-and-content-customization/
│       ├── 11-event-sourcing-and-audit-trail/
│       ├── 12-microservices-architecture/
│       └── 13-api-layer/
│
├── src/
│   ├── Coop.Api/                                # ASP.NET Core Web API (gateway/monolith) — 28 .cs files
│   │   ├── Coop.Api.csproj                      # Target: net9.0
│   │   ├── Program.cs
│   │   ├── Startup.cs
│   │   ├── Dependencies.cs                      # DI registration
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── appsettings.staging.json
│   │   ├── appsettings.production.json
│   │   ├── Properties/
│   │   │   └── launchSettings.json
│   │   └── Controllers/                         # 25 REST controllers
│   │       ├── BoardMemberController.cs
│   │       ├── ByLawController.cs
│   │       ├── ConnectorController.cs
│   │       ├── ConversationController.cs
│   │       ├── DigitalAssetController.cs
│   │       ├── DocumentController.cs
│   │       ├── EventsController.cs
│   │       ├── InvitationTokenController.cs
│   │       ├── JsonContentController.cs
│   │       ├── MaintenanceRequestController.cs
│   │       ├── MaintenanceRequestCommentController.cs
│   │       ├── MaintenanceRequestDigitalAssetController.cs
│   │       ├── MemberController.cs
│   │       ├── MessageController.cs
│   │       ├── MetaController.cs
│   │       ├── NoticeController.cs
│   │       ├── OnCallController.cs
│   │       ├── PrivilegeController.cs
│   │       ├── ProfileController.cs
│   │       ├── ReportController.cs
│   │       ├── RoleController.cs
│   │       ├── StaffMemberController.cs
│   │       ├── StoredEventController.cs
│   │       ├── ThemeController.cs
│   │       └── UserController.cs
│   │
│   ├── Coop.Application/                       # Application layer (CQRS with MediatR) — 238 .cs files
│   │   ├── Coop.Application.csproj              # Target: net9.0
│   │   ├── Common/
│   │   │   ├── Behaviors/                       # MediatR pipeline behaviors (validation, logging)
│   │   │   └── Extensions/                      # Extension methods
│   │   ├── Helpers/                             # Utility/helper classes
│   │   ├── BoardMembers/
│   │   │   ├── Commands/                        # Create/update/delete board members
│   │   │   ├── EventHandlers/                   # Domain event handlers
│   │   │   └── Queries/                         # Query board member data
│   │   ├── ByLaws/
│   │   │   ├── Commands/
│   │   │   └── Queries/
│   │   ├── Conversations/
│   │   │   ├── Commands/
│   │   │   └── Queries/
│   │   ├── DigitalAssets/                       # (Commands/Queries folders defined but empty)
│   │   ├── Documents/                           # (Commands/Queries folders defined but empty)
│   │   ├── InvitationTokens/
│   │   ├── JsonContents/
│   │   │   ├── Commands/
│   │   │   ├── Exceptions/
│   │   │   └── Queries/
│   │   ├── MaintenanceRequests/
│   │   ├── MaintenanceRequestComments/
│   │   ├── MaintenanceRequestDigitalAssets/
│   │   ├── Members/
│   │   ├── Messages/
│   │   ├── Notices/
│   │   ├── OnCalls/
│   │   ├── Privileges/
│   │   ├── Profiles/
│   │   ├── Reports/
│   │   ├── Roles/
│   │   ├── StaffMembers/
│   │   ├── StoredEvents/
│   │   ├── Themes/
│   │   └── Users/
│   │       ├── Commands/
│   │       ├── EventHandlers/
│   │       └── Queries/
│   │
│   ├── Coop.Domain/                            # Domain layer (entities, events, value objects) — 78 .cs files
│   │   ├── Coop.Domain.csproj                   # Target: net9.0
│   │   ├── AggregateRoot.cs                     # Base class for aggregate roots
│   │   ├── BaseEntity.cs                        # Base entity class
│   │   ├── BaseDomainEvent.cs                   # Base domain event class
│   │   ├── IAggregateRoot.cs
│   │   ├── IEvent.cs
│   │   ├── Authentication.cs                    # Authentication logic
│   │   ├── Constants.cs
│   │   ├── Operations.cs
│   │   ├── PasswordHasher.cs
│   │   ├── TokenBuilder.cs
│   │   ├── TokenProvider.cs / ITokenProvider.cs
│   │   ├── NotificationService.cs
│   │   ├── OrchestrationHandler.cs
│   │   ├── ResponseBase.cs
│   │   ├── ResourceOperationAuthorizationHandler.cs
│   │   ├── AuthorizeResourceOperationAttribute.cs
│   │   ├── StaticFileLocator.cs
│   │   ├── Entities/
│   │   │   ├── Address.cs
│   │   │   ├── ByLaw.cs
│   │   │   ├── Conversation.cs
│   │   │   ├── DigitalAsset.cs
│   │   │   ├── Document.cs
│   │   │   ├── Message.cs
│   │   │   ├── Notice.cs
│   │   │   ├── Privilege.cs
│   │   │   ├── Report.cs
│   │   │   ├── Role.cs
│   │   │   ├── StoredEvent.cs
│   │   │   ├── Theme.cs
│   │   │   ├── User.cs
│   │   │   ├── InvitationToken/
│   │   │   │   └── InvitationToken.cs
│   │   │   ├── JsonContent/
│   │   │   │   └── JsonContent.cs
│   │   │   ├── MaintenanceRequest/
│   │   │   │   ├── MaintenanceRequest.cs
│   │   │   │   ├── MaintenanceRequestComment.cs
│   │   │   │   ├── MaintenanceRequestDigitalAsset.cs
│   │   │   │   ├── MaintenanceRequestStatus.cs
│   │   │   │   └── UnitEntered.cs
│   │   │   └── Profile/
│   │   │       ├── Profile.cs
│   │   │       ├── BoardMember.cs
│   │   │       ├── Member.cs
│   │   │       ├── OnCall.cs
│   │   │       └── StaffMember.cs
│   │   ├── DomainEvents/
│   │   │   ├── Document/                        # CreateDocument, DeleteDocument, PublishDocument, etc.
│   │   │   ├── InvitationToken/                 # ValidateInvitationToken, ValidatedInvitationToken
│   │   │   ├── JsonContent/                     # CreatedJsonContent
│   │   │   ├── MaintenanceRequest/              # Create, Receive, Start, Complete, Update, Remove events
│   │   │   ├── Profile/                         # CreateProfile, CreatedProfile
│   │   │   └── User/                            # CreateUser, CreatedUser, BuildToken, AuthenticatedUser, etc.
│   │   ├── Dtos/
│   │   │   └── AddressDto.cs
│   │   ├── Enums/
│   │   │   ├── AccessRight.cs
│   │   │   ├── InvitationTokenType.cs
│   │   │   └── ProfileType.cs
│   │   └── Interfaces/
│   │       ├── IAggregate.cs
│   │       ├── ICoopDbContext.cs
│   │       ├── INotificationService.cs
│   │       └── IOrchestrationHandler.cs
│   │
│   ├── Coop.Infrastructure/                    # Infrastructure layer (EF Core, data access) — 43 .cs files
│   │   ├── Coop.Infrastructure.csproj           # Target: net9.0
│   │   ├── Data/
│   │   │   ├── CoopDbContext.cs                 # Main EF Core DbContext
│   │   │   ├── EntityConfigurations/
│   │   │   │   ├── JsonContentConfiguration.cs
│   │   │   │   ├── MaintenanceRequestConfiguration.cs
│   │   │   │   ├── ThemeConfiguration.cs
│   │   │   │   └── UserConfiguration.cs
│   │   │   └── Seeding/
│   │   │       ├── SeedData.cs
│   │   │       ├── Avatars/                     # earl.webp, marie.webp, natasha.webp
│   │   │       ├── Documents/                   # ByLaw.pdf, Notice.pdf, Report.pdf
│   │   │       └── Images/                      # Building.jpg, Doors.jpg, Logo.jpg
│   │   └── Migrations/                          # 15 EF Core migrations (2021-08 through 2021-10)
│   │
│   ├── Coop.SharedKernel/                      # Shared library for microservices — 18 .cs files
│   │   ├── Coop.SharedKernel.csproj             # Target: net7.0
│   │   ├── Events/
│   │   │   ├── IntegrationEvent.cs              # Base integration event class
│   │   │   ├── IIntegrationEventHandler.cs
│   │   │   ├── Asset/
│   │   │   │   └── DigitalAssetEvents.cs
│   │   │   ├── Document/
│   │   │   │   └── DocumentCreatedEvent.cs
│   │   │   ├── Identity/
│   │   │   │   └── UserCreatedEvent.cs
│   │   │   ├── Maintenance/
│   │   │   │   └── MaintenanceRequestEvents.cs
│   │   │   ├── Messaging/
│   │   │   │   └── MessageEvents.cs
│   │   │   └── Profile/
│   │   │       └── ProfileCreatedEvent.cs
│   │   ├── Extensions/
│   │   │   └── ServiceCollectionExtensions.cs
│   │   ├── Interfaces/
│   │   │   ├── IAggregateRoot.cs
│   │   │   └── IEntity.cs
│   │   ├── Messaging/
│   │   │   ├── IMessageBus.cs                   # Message bus abstraction
│   │   │   ├── RedisMessageBus.cs               # Redis-backed implementation
│   │   │   ├── RedisOptions.cs
│   │   │   ├── MessageEnvelope.cs
│   │   │   └── IntegrationEventPublisherService.cs
│   │   └── Serialization/
│   │       ├── IMessageSerializer.cs
│   │       └── MessagePackSerializer.cs         # MessagePack-based serialization
│   │
│   ├── Coop.App/                               # Angular frontend (SPA)
│   │   ├── angular.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── staticwebapp.config.json             # Azure Static Web Apps config
│   │   └── src/
│   │       ├── assets/
│   │       ├── environments/
│   │       ├── scss/
│   │       └── app/
│   │           ├── @api/                        # API client layer
│   │           │   ├── models/                  # TypeScript model interfaces
│   │           │   └── services/                # HTTP service classes
│   │           ├── @core/                        # Core module
│   │           │   ├── abstractions/
│   │           │   └── stores/                  # State management
│   │           ├── @shared/                      # Shared UI components
│   │           │   ├── address-editor/
│   │           │   ├── aggregate-privilege/
│   │           │   ├── bento-box/
│   │           │   ├── create-a-maintenace-request-dialog/
│   │           │   ├── digital-asset-list/
│   │           │   ├── digital-asset-upload/
│   │           │   ├── document-card/
│   │           │   ├── footer/
│   │           │   ├── header/
│   │           │   ├── hero/
│   │           │   ├── html-editor/
│   │           │   ├── layouts/
│   │           │   ├── logo/
│   │           │   ├── maintenance-request/
│   │           │   ├── maintenance-request-card/
│   │           │   ├── maintenance-request-editor/
│   │           │   ├── messenger/
│   │           │   ├── popups/
│   │           │   │   ├── create-document-popup/
│   │           │   │   ├── maintenance-request-complete-popup/
│   │           │   │   ├── maintenance-request-receive-popup/
│   │           │   │   ├── maintenance-request-start-popup/
│   │           │   │   └── maintenance-request-update-popup/
│   │           │   ├── sidenav/
│   │           │   ├── text-and-images/
│   │           │   ├── type-a-message/
│   │           │   └── unattended-unit-entry-allowed/
│   │           ├── board-of-directors/
│   │           ├── contact/
│   │           ├── create-account/
│   │           │   └── create-account-form/
│   │           ├── landing/
│   │           ├── login/
│   │           │   ├── login/
│   │           │   └── login-form/
│   │           ├── management/
│   │           ├── on-call-staff/
│   │           ├── rental-interest-and-information/
│   │           └── workspace/                   # Authenticated workspace area
│   │               ├── board-members/
│   │               ├── by-laws/
│   │               ├── content/                 # CMS-style content management
│   │               │   ├── board/
│   │               │   ├── contact-us/
│   │               │   ├── hero/
│   │               │   ├── management/
│   │               │   ├── on-call/
│   │               │   ├── rental-interest-and-information/
│   │               │   └── splash/
│   │               ├── digital-assets/
│   │               ├── maintenance-requests/
│   │               │   ├── create-maintenance-request/
│   │               │   ├── maintenance-request/
│   │               │   ├── maintenance-request-list/
│   │               │   └── update-maintenance-request-description/
│   │               ├── members/
│   │               ├── messages/
│   │               ├── notices/
│   │               ├── personalize/
│   │               ├── profile/
│   │               ├── reports/
│   │               ├── roles/
│   │               ├── settings/
│   │               ├── staff-members/
│   │               └── users/
│   │
│   └── Services/                               # Microservices (each with clean architecture)
│       ├── Asset/                               # Digital Asset Management Service
│       │   ├── Asset.Api/                       # 4 .cs files — Target: net7.0
│       │   │   └── Features/
│       │   │       ├── DigitalAssets/            # Digital asset endpoints
│       │   │       ├── OnCall/                   # On-call staff endpoints
│       │   │       └── Themes/                   # Theme endpoints
│       │   ├── Asset.Domain/                    # 4 .cs files
│       │   │   ├── Entities/
│       │   │   └── Interfaces/
│       │   └── Asset.Infrastructure/            # 4 .cs files
│       │       └── Data/
│       │           ├── EntityConfigurations/
│       │           └── Seeding/
│       │
│       ├── Document/                            # Document Management Service
│       │   ├── Document.Api/                    # 5 .cs files — Target: net7.0
│       │   │   └── Features/
│       │   │       ├── ByLaws/                   # By-law document endpoints
│       │   │       ├── JsonContents/             # JSON content endpoints
│       │   │       ├── Notices/                  # Notice endpoints
│       │   │       └── Reports/                  # Report endpoints
│       │   ├── Document.Domain/                 # 6 .cs files
│       │   │   ├── Entities/
│       │   │   └── Interfaces/
│       │   └── Document.Infrastructure/         # 3 .cs files
│       │       └── Data/
│       │           ├── EntityConfigurations/
│       │           └── Seeding/
│       │
│       ├── Identity/                            # Identity and Authentication Service
│       │   ├── Identity.Api/                    # 5 .cs files — Target: net7.0
│       │   │   ├── Features/
│       │   │   │   ├── Auth/                     # Authentication endpoints
│       │   │   │   ├── Roles/                    # Role management endpoints
│       │   │   │   └── Users/                    # User management endpoints
│       │   │   └── Models/
│       │   ├── Identity.Domain/                 # 6 .cs files
│       │   │   ├── Entities/
│       │   │   └── Interfaces/
│       │   └── Identity.Infrastructure/         # 5 .cs files
│       │       └── Data/
│       │           ├── EntityConfigurations/
│       │           └── Seeding/
│       │
│       ├── Maintenance/                         # Maintenance Request Service
│       │   ├── Maintenance.Api/                 # 2 .cs files — Target: net7.0
│       │   │   └── Features/
│       │   │       └── MaintenanceRequests/      # Maintenance request endpoints
│       │   ├── Maintenance.Domain/              # 5 .cs files
│       │   │   ├── Entities/
│       │   │   ├── Enums/
│       │   │   └── Interfaces/
│       │   └── Maintenance.Infrastructure/      # 3 .cs files
│       │       └── Data/
│       │           ├── EntityConfigurations/
│       │           └── Seeding/
│       │
│       ├── Messaging/                           # Messaging and Conversations Service
│       │   ├── Messaging.Api/                   # 3 .cs files — Target: net7.0
│       │   │   └── Features/
│       │   │       ├── Conversations/            # Conversation endpoints
│       │   │       └── Messages/                 # Message endpoints
│       │   ├── Messaging.Domain/                # 3 .cs files
│       │   │   ├── Entities/
│       │   │   └── Interfaces/
│       │   └── Messaging.Infrastructure/        # 3 .cs files
│       │       └── Data/
│       │           ├── EntityConfigurations/
│       │           └── Seeding/
│       │
│       └── Profile/                             # Profile Management Service
│           ├── Profile.Api/                     # 6 .cs files — Target: net7.0
│           │   └── Features/
│           │       ├── BoardMembers/             # Board member endpoints
│           │       ├── InvitationTokens/         # Invitation token endpoints
│           │       ├── Members/                  # Member endpoints
│           │       ├── Profiles/                 # Profile CRUD endpoints
│           │       └── StaffMembers/             # Staff member endpoints
│           ├── Profile.Domain/                  # 7 .cs files
│           │   ├── Entities/
│           │   ├── Enums/
│           │   └── Interfaces/
│           └── Profile.Infrastructure/          # 4 .cs files
│               └── Data/
│                   ├── EntityConfigurations/
│                   └── Seeding/
│
└── tests/
    ├── Coop.Testing/                            # Test infrastructure/utilities — 13 .cs files
    │   ├── Coop.Testing.csproj                  # Target: net9.0
    │   ├── Builders/
    │   │   └── Models/                          # Test data builder classes
    │   ├── Extensions/                          # Test helper extensions
    │   ├── Factories/                           # Test factory classes (WebApplicationFactory, etc.)
    │   └── Utilities/                           # General test utilities
    │
    ├── Coop.IntegrationTests/                   # Integration tests — 2 .cs files
    │   └── Coop.IntegrationTests.csproj         # Target: net9.0
    │
    └── Coop.UnitTests/                          # Unit tests — 9 .cs files
        ├── Coop.UnitTests.csproj                # Target: net9.0
        ├── Models/                              # Test model classes
        └── Features/                            # Feature-based test organization
            ├── BoardMembers/
            ├── JsonContents/
            ├── Profiles/
            └── Users/
```

---

## Project Descriptions

### Monolith (Original Architecture)

| Project | Purpose |
|---------|---------|
| **Coop.Api** | ASP.NET Core Web API serving as the HTTP entry point. Contains 25 REST controllers covering all domain features. Configures DI, authentication (JWT Bearer), Swagger, and middleware. |
| **Coop.Application** | Implements CQRS pattern using MediatR. Contains commands, queries, event handlers, and pipeline behaviors for all business features. The largest project with 238 .cs files organized by feature (BoardMembers, Users, MaintenanceRequests, etc.). |
| **Coop.Domain** | Core domain model with entities, aggregate roots, domain events, enums, and interfaces. Contains no infrastructure dependencies. Defines business rules, authentication logic, and the `ICoopDbContext` abstraction. |
| **Coop.Infrastructure** | Data access layer implementing `ICoopDbContext` via EF Core (`CoopDbContext`). Contains entity configurations, database migrations, and seed data (avatar images, sample PDFs, building images). |

### Microservices (Refactored Architecture)

Each microservice under `src/Services/` follows the same three-layer clean architecture pattern and targets net7.0:

| Service | Responsibility |
|---------|----------------|
| **Asset** | Manages digital assets (images, files), on-call staff information, and UI themes. |
| **Document** | Manages by-laws, notices, reports, and JSON-based content storage. |
| **Identity** | Handles user authentication, user CRUD, and role management. |
| **Maintenance** | Manages maintenance requests and their lifecycle (create, receive, start, complete). |
| **Messaging** | Handles conversations and message exchange between users. |
| **Profile** | Manages user profiles, board members, staff members, members, and invitation tokens. |

### Shared and Cross-Cutting

| Project | Purpose |
|---------|---------|
| **Coop.SharedKernel** | Shared library referenced by all microservice Domain projects. Provides integration event contracts, a Redis-based message bus (pub/sub), MessagePack serialization, and base interfaces (`IAggregateRoot`, `IEntity`). This is the glue that enables microservices to communicate asynchronously. |
| **Coop.App** | Angular single-page application (SPA) frontend. Deployed as an Azure Static Web App. Organized with `@api` (HTTP clients), `@core` (state management), `@shared` (reusable components), and feature modules (workspace, login, landing, etc.). |

### Test Projects

| Project | Purpose |
|---------|---------|
| **Coop.Testing** | Shared test infrastructure. Contains test data builders, WebApplicationFactory-based factories, extension methods, and utilities. Referenced by both integration and unit test projects. |
| **Coop.IntegrationTests** | End-to-end integration tests that exercise the API through HTTP using `Microsoft.AspNetCore.Mvc.Testing`. Uses xUnit. |
| **Coop.UnitTests** | Unit tests organized by feature area (BoardMembers, JsonContents, Profiles, Users). Uses xUnit. |

---

## Project Reference Graph

The dependency flow follows clean architecture principles, with dependencies pointing inward.

### Monolith Dependencies

```
Coop.Api
  └── Coop.Application
        └── Coop.Infrastructure
              └── Coop.Domain
```

- **Coop.Api** references **Coop.Application** only.
- **Coop.Application** references **Coop.Infrastructure** (note: this is a pragmatic deviation from strict clean architecture where Application would reference Domain only).
- **Coop.Infrastructure** references **Coop.Domain**.
- **Coop.Domain** has no project references (only NuGet packages).

### Microservice Dependencies

Each microservice follows the same pattern:

```
[Service].Api
  └── [Service].Infrastructure
        └── [Service].Domain
              └── Coop.SharedKernel
```

For example:

```
Identity.Api --> Identity.Infrastructure --> Identity.Domain --> Coop.SharedKernel
Asset.Api    --> Asset.Infrastructure    --> Asset.Domain    --> Coop.SharedKernel
Document.Api --> Document.Infrastructure --> Document.Domain --> Coop.SharedKernel
...
```

### Test Dependencies

```
Coop.UnitTests
  ├── Coop.Api
  └── Coop.Testing
        └── Coop.Api

Coop.IntegrationTests
  ├── Coop.Api
  └── Coop.Testing
        └── Coop.Api
```

Both test projects reference Coop.Api (to access the full application stack) and Coop.Testing (for shared test infrastructure).

---

## Clean Architecture Layers

The solution implements Clean Architecture (also known as Onion Architecture) with four concentric layers:

### 1. Domain Layer (`Coop.Domain` / `[Service].Domain`)

The innermost layer with zero outward dependencies. Contains:

- **Entities** -- Business objects with identity (User, Profile, MaintenanceRequest, Document, etc.)
- **Aggregate Roots** -- Consistency boundaries (`AggregateRoot.cs` base class)
- **Domain Events** -- Events raised when state changes occur (e.g., `CreatedUser`, `CompleteMaintenanceRequest`)
- **Value Objects / DTOs** -- Immutable data carriers (`AddressDto`)
- **Enums** -- Domain-specific enumerations (`AccessRight`, `ProfileType`, `InvitationTokenType`)
- **Interfaces** -- Contracts for infrastructure services (`ICoopDbContext`, `IOrchestrationHandler`)
- **Domain Services** -- Business logic that does not belong to a single entity (`PasswordHasher`, `TokenBuilder`, `NotificationService`)

### 2. Application Layer (`Coop.Application`)

Orchestrates use cases through the CQRS pattern:

- **Commands** -- Write operations (e.g., `CreateBoardMember`, `UpdateMaintenanceRequest`)
- **Queries** -- Read operations (e.g., `GetBoardMembers`, `GetUserById`)
- **Event Handlers** -- React to domain events and coordinate side effects
- **Behaviors** -- Cross-cutting concerns via MediatR pipeline (validation, logging)
- Organized by **feature/aggregate** (BoardMembers, Users, MaintenanceRequests, etc.)

### 3. Infrastructure Layer (`Coop.Infrastructure` / `[Service].Infrastructure`)

Implements interfaces defined in the Domain layer:

- **DbContext** -- EF Core data access implementation
- **Entity Configurations** -- Fluent API mappings for EF Core
- **Migrations** -- Database schema versioning
- **Seed Data** -- Initial/demo data including embedded binary resources (images, PDFs)

### 4. API Layer (`Coop.Api` / `[Service].Api`)

The outermost layer, serving as the application entry point:

- **Controllers / Features** -- HTTP endpoints (REST)
- **Dependency Injection** -- Service registration and configuration
- **Middleware** -- Authentication, Swagger, error handling
- **Configuration** -- Environment-specific settings (appsettings.*.json)

The microservices use a "vertical slice" approach in their API layer, with a `Features/` folder instead of a separate `Controllers/` folder, co-locating request/response models with endpoint logic.

---

## Microservice Folder Structure

Each microservice follows an identical three-project structure:

```
Services/
└── {ServiceName}/
    ├── {ServiceName}.Api/                # Web API host (net7.0)
    │   ├── {ServiceName}.Api.csproj
    │   ├── Program.cs
    │   └── Features/                     # Vertical slice feature folders
    │       └── {Feature}/                # Endpoint + request/response models
    │
    ├── {ServiceName}.Domain/             # Domain model (net7.0)
    │   ├── {ServiceName}.Domain.csproj
    │   ├── Entities/                     # Domain entities
    │   ├── Interfaces/                   # Repository/service contracts
    │   └── Enums/                        # (where applicable)
    │
    └── {ServiceName}.Infrastructure/     # Data access (net7.0)
        ├── {ServiceName}.Infrastructure.csproj
        └── Data/
            ├── EntityConfigurations/     # EF Core fluent mappings
            └── Seeding/                  # Seed data
```

Key differences from the monolith:
- Microservices use **vertical slices** (`Features/` folder) rather than the monolith's separate `Controllers/` + `Application/` CQRS split.
- Each microservice has its own isolated database context.
- All microservice Domain projects depend on **Coop.SharedKernel** for integration event contracts and the Redis message bus.
- Microservices target **net7.0** while the monolith targets **net9.0**.

---

## Test Project Organization

```
tests/
├── Coop.Testing/                    # Shared test infrastructure
│   ├── Builders/Models/             # Builder pattern for constructing test entities
│   ├── Extensions/                  # Helper extension methods for tests
│   ├── Factories/                   # WebApplicationFactory setup for in-memory API hosting
│   └── Utilities/                   # General-purpose test utilities
│
├── Coop.IntegrationTests/          # Integration tests
│   └── (tests that spin up the full API pipeline with in-memory database)
│
└── Coop.UnitTests/                 # Unit tests
    ├── Models/                      # Test-specific model classes
    └── Features/                    # Tests organized by feature area
        ├── BoardMembers/
        ├── JsonContents/
        ├── Profiles/
        └── Users/
```

- **Test framework**: xUnit with coverlet for code coverage
- **Mocking**: Moq
- **Database**: Microsoft.EntityFrameworkCore.InMemory for test isolation
- **API testing**: Microsoft.AspNetCore.Mvc.Testing and TestHost for integration tests
- **Database cleanup**: Respawn for resetting database state between tests

The unit tests mirror the Application layer's feature-based folder structure, making it straightforward to locate tests for any given feature.

---

## SharedKernel and Gateway Projects

### Coop.SharedKernel

The SharedKernel is the foundational library that enables the microservices architecture. It is referenced by every microservice Domain project and provides:

1. **Integration Events** (`Events/`) -- Strongly-typed event contracts organized by bounded context:
   - `Asset/DigitalAssetEvents.cs` -- Events for asset creation, updates
   - `Document/DocumentCreatedEvent.cs` -- Events for document lifecycle
   - `Identity/UserCreatedEvent.cs` -- Events for user registration
   - `Maintenance/MaintenanceRequestEvents.cs` -- Events for maintenance workflows
   - `Messaging/MessageEvents.cs` -- Events for messaging activity
   - `Profile/ProfileCreatedEvent.cs` -- Events for profile changes
   - `IntegrationEvent.cs` -- Base class for all integration events
   - `IIntegrationEventHandler.cs` -- Handler interface for consuming events

2. **Message Bus** (`Messaging/`) -- Asynchronous inter-service communication:
   - `IMessageBus.cs` -- Abstraction for publish/subscribe messaging
   - `RedisMessageBus.cs` -- Redis Pub/Sub implementation using StackExchange.Redis
   - `IntegrationEventPublisherService.cs` -- Background service that publishes integration events
   - `MessageEnvelope.cs` -- Wrapper for message metadata and routing
   - `RedisOptions.cs` -- Configuration for Redis connection

3. **Serialization** (`Serialization/`) -- High-performance message serialization:
   - `IMessageSerializer.cs` -- Serialization abstraction
   - `MessagePackSerializer.cs` -- MessagePack binary serialization for efficient Redis communication

4. **Base Interfaces** (`Interfaces/`) -- Common domain modeling contracts:
   - `IAggregateRoot.cs` -- Marker interface for aggregate roots
   - `IEntity.cs` -- Base entity interface

5. **DI Extensions** (`Extensions/`) -- `ServiceCollectionExtensions.cs` for registering SharedKernel services

### Gateway (Coop.Api)

There is no separate Gateway project in the solution. Instead, **Coop.Api** serves dual roles:

1. **Monolith API** -- The original unified API with 25 controllers covering all features
2. **De facto API Gateway** -- As the system transitions to microservices, Coop.Api acts as the client-facing entry point

The Coop.Api project includes a `ConnectorController.cs` which likely facilitates routing or proxying requests to the individual microservices during the migration period. The microservice APIs (`Asset.Api`, `Document.Api`, etc.) are independently deployable ASP.NET Core web applications that can be accessed directly or through the main API.
