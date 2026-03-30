# Solution Folder Hierarchy

## Document Information

- **Project:** Coop Management System
- **Version:** 1.0
- **Date:** 2025-12-20
- **Status:** Planned

---

## Overview

This document describes the target .NET solution folder hierarchy for the Coop modular monolith. The solution follows **Clean Architecture** principles with a single deployable backend organized into explicit business modules, serving two application surfaces: a CMS-driven public-facing web app and an admin backend.

---

## Solution File

```
Coop.sln
```

---

## Top-Level Structure

```text
Coop/
├── Coop.sln
├── src/
│   ├── Coop.Api/
│   ├── Coop.Application/
│   ├── Coop.Domain/
│   ├── Coop.Infrastructure/
│   └── Coop.SharedKernel/
├── tests/
│   ├── Coop.Api.Tests/
│   ├── Coop.Application.Tests/
│   ├── Coop.Domain.Tests/
│   ├── Coop.Infrastructure.Tests/
│   └── Coop.IntegrationTests/
└── docs/
    ├── detailed-designs/
    ├── specs/
    └── ...
```

---

## Project Details

### src/Coop.Api

ASP.NET Core Web API host. Single deployable entry point for both the public web app and admin backend.

```text
Coop.Api/
├── Coop.Api.csproj
├── Program.cs
├── Dependencies.cs
├── appsettings.json
├── appsettings.Development.json
├── Controllers/
│   ├── Identity/
│   │   ├── UserController.cs
│   │   ├── RoleController.cs
│   │   └── PrivilegeController.cs
│   ├── Profile/
│   │   ├── ProfilesController.cs
│   │   ├── MembersController.cs
│   │   ├── BoardMembersController.cs
│   │   └── StaffMembersController.cs
│   ├── Maintenance/
│   │   ├── MaintenanceRequestController.cs
│   │   ├── MaintenanceRequestCommentController.cs
│   │   └── MaintenanceRequestDigitalAssetController.cs
│   ├── Document/
│   │   ├── DocumentController.cs
│   │   ├── NoticeController.cs
│   │   ├── ByLawController.cs
│   │   └── ReportController.cs
│   ├── Messaging/
│   │   ├── ConversationsController.cs
│   │   └── MessagesController.cs
│   ├── Asset/
│   │   ├── DigitalAssetController.cs
│   │   └── ThemeController.cs
│   ├── CMS/
│   │   └── JsonContentController.cs
│   ├── EventSourcing/
│   │   ├── StoredEventController.cs
│   │   └── EventsController.cs
│   └── Onboarding/
│       └── InvitationTokenController.cs
└── Middleware/
    └── ...
```

**References:** Coop.Application, Coop.Infrastructure

---

### src/Coop.Application

Application layer containing CQRS command/query handlers, validators, DTOs, and application service interfaces. Uses MediatR for dispatching.

```text
Coop.Application/
├── Coop.Application.csproj
├── Identity/
│   ├── Commands/
│   │   ├── CreateUser/
│   │   ├── UpdateUser/
│   │   ├── RemoveUser/
│   │   ├── Authenticate/
│   │   └── ChangePassword/
│   ├── Queries/
│   │   ├── GetUserById/
│   │   ├── GetUsers/
│   │   └── GetUserByUsername/
│   └── ...
├── Roles/
│   ├── Commands/
│   │   ├── CreateRole/
│   │   ├── UpdateRole/
│   │   └── RemoveRole/
│   └── Queries/
│       ├── GetRoleById/
│       └── GetRoles/
├── Privileges/
│   ├── Commands/
│   │   ├── CreatePrivilege/
│   │   ├── UpdatePrivilege/
│   │   └── RemovePrivilege/
│   └── Queries/
│       └── GetPrivileges/
├── Profiles/
│   ├── Commands/
│   │   ├── CreateProfile/
│   │   ├── UpdateProfile/
│   │   └── DeleteProfile/
│   └── Queries/
│       ├── GetProfileById/
│       ├── GetProfiles/
│       ├── GetMembers/
│       ├── GetBoardMembers/
│       └── GetStaffMembers/
├── Maintenance/
│   ├── Commands/
│   │   ├── CreateMaintenanceRequest/
│   │   ├── ReceiveMaintenanceRequest/
│   │   ├── StartMaintenanceRequest/
│   │   ├── CompleteMaintenanceRequest/
│   │   └── UpdateMaintenanceRequest/
│   └── Queries/
│       ├── GetMaintenanceRequestById/
│       └── GetMaintenanceRequests/
├── Documents/
│   ├── Commands/
│   │   ├── CreateDocument/
│   │   ├── PublishDocument/
│   │   └── DeleteDocument/
│   └── Queries/
│       ├── GetDocumentById/
│       ├── GetNotices/
│       ├── GetByLaws/
│       └── GetReports/
├── Messaging/
│   ├── Commands/
│   │   ├── CreateConversation/
│   │   └── SendMessage/
│   └── Queries/
│       ├── GetConversations/
│       └── GetMessages/
├── Assets/
│   ├── Commands/
│   │   ├── CreateDigitalAsset/
│   │   └── RemoveDigitalAsset/
│   └── Queries/
│       ├── GetDigitalAssetById/
│       └── GetDigitalAssets/
├── CMS/
│   ├── Themes/
│   │   ├── Commands/
│   │   └── Queries/
│   └── Content/
│       ├── Commands/
│       └── Queries/
├── Onboarding/
│   ├── Commands/
│   │   ├── CreateInvitationToken/
│   │   └── RedeemInvitationToken/
│   └── Queries/
│       └── GetInvitationTokens/
├── EventSourcing/
│   └── Queries/
│       └── GetStoredEvents/
├── Behaviors/
│   ├── ResourceOperationAuthorizationBehavior.cs
│   └── ValidationBehavior.cs
├── Common/
│   ├── Interfaces/
│   │   ├── ICoopDbContext.cs
│   │   ├── ITokenBuilder.cs
│   │   ├── ITokenProvider.cs
│   │   ├── IPasswordHasher.cs
│   │   └── INotificationService.cs
│   └── Models/
│       └── PagedResult.cs
└── Authorization/
    ├── AuthorizeResourceOperationAttribute.cs
    ├── ResourceOperationAuthorizationHandler.cs
    └── Operations.cs
```

**References:** Coop.Domain, Coop.SharedKernel

---

### src/Coop.Domain

Domain layer containing aggregate roots, entities, value objects, enumerations, and domain events. No external dependencies.

```text
Coop.Domain/
├── Coop.Domain.csproj
├── Identity/
│   ├── User.cs
│   ├── Role.cs
│   ├── Privilege.cs
│   └── AccessRight.cs
├── Profiles/
│   ├── ProfileBase.cs
│   ├── Member.cs
│   ├── BoardMember.cs
│   ├── StaffMember.cs
│   ├── OnCall.cs
│   ├── ProfileType.cs
│   └── ValueObjects/
│       └── Address.cs
├── Maintenance/
│   ├── MaintenanceRequest.cs
│   ├── MaintenanceRequestComment.cs
│   ├── MaintenanceRequestDigitalAsset.cs
│   ├── MaintenanceRequestStatus.cs
│   └── UnitEntered.cs
├── Documents/
│   ├── Document.cs
│   ├── Notice.cs
│   ├── ByLaw.cs
│   └── Report.cs
├── Messaging/
│   ├── Conversation.cs
│   └── Message.cs
├── Assets/
│   ├── DigitalAsset.cs
│   └── Theme.cs
├── CMS/
│   └── JsonContent.cs
├── Onboarding/
│   ├── InvitationToken.cs
│   └── InvitationTokenType.cs
├── EventSourcing/
│   ├── StoredEvent.cs
│   └── BaseDomainEvent.cs
└── Common/
    ├── AggregateRoot.cs
    ├── IAggregateRoot.cs
    └── IEvent.cs
```

**References:** Coop.SharedKernel

---

### src/Coop.Infrastructure

Infrastructure layer containing EF Core persistence, external service implementations, and cross-cutting concerns.

```text
Coop.Infrastructure/
├── Coop.Infrastructure.csproj
├── Persistence/
│   ├── CoopDbContext.cs
│   └── Configurations/
│       ├── Identity/
│       │   ├── UserConfiguration.cs
│       │   ├── RoleConfiguration.cs
│       │   └── PrivilegeConfiguration.cs
│       ├── Profiles/
│       │   └── ProfileBaseConfiguration.cs
│       ├── Maintenance/
│       │   └── MaintenanceRequestConfiguration.cs
│       ├── Documents/
│       │   └── DocumentConfiguration.cs
│       ├── Messaging/
│       │   ├── ConversationConfiguration.cs
│       │   └── MessageConfiguration.cs
│       ├── Assets/
│       │   ├── DigitalAssetConfiguration.cs
│       │   └── ThemeConfiguration.cs
│       ├── CMS/
│       │   └── JsonContentConfiguration.cs
│       ├── Onboarding/
│       │   └── InvitationTokenConfiguration.cs
│       └── EventSourcing/
│           └── StoredEventConfiguration.cs
├── Identity/
│   ├── PasswordHasher.cs
│   ├── TokenBuilder.cs
│   └── TokenProvider.cs
├── Notifications/
│   └── NotificationService.cs
└── Migrations/
    └── ...
```

**References:** Coop.Application, Coop.Domain

---

### src/Coop.SharedKernel

Shared kernel containing cross-cutting base types, constants, and common abstractions used across all layers.

```text
Coop.SharedKernel/
├── Coop.SharedKernel.csproj
├── Constants.cs
├── Authentication.cs
└── ClaimTypes.cs
```

Constants include:

| Constant Group | Values |
|---|---|
| `Constants.Roles` | Member, Staff, BoardMember, SystemAdministrator, Support |
| `Constants.ClaimTypes` | UserId, Username, Privilege, Role |
| `Constants.Aggregates` | All target aggregates for privilege assignment |
| `Constants.AccessRights` | Read, Write, Create, Delete |

---

## Test Projects

### tests/Coop.Domain.Tests

Unit tests for domain entities, aggregate roots, value objects, and domain logic.

```text
Coop.Domain.Tests/
├── Coop.Domain.Tests.csproj
├── Identity/
├── Profiles/
├── Maintenance/
├── Documents/
├── Messaging/
├── Assets/
└── EventSourcing/
```

### tests/Coop.Application.Tests

Unit tests for command/query handlers, validators, and application behaviors.

```text
Coop.Application.Tests/
├── Coop.Application.Tests.csproj
├── Identity/
├── Profiles/
├── Maintenance/
├── Documents/
├── Messaging/
├── Assets/
└── CMS/
```

### tests/Coop.Api.Tests

Unit tests for controllers and API-level concerns.

```text
Coop.Api.Tests/
├── Coop.Api.Tests.csproj
└── Controllers/
    ├── Identity/
    ├── Profile/
    ├── Maintenance/
    ├── Document/
    ├── Messaging/
    ├── Asset/
    └── CMS/
```

### tests/Coop.Infrastructure.Tests

Tests for persistence configurations and infrastructure implementations.

```text
Coop.Infrastructure.Tests/
├── Coop.Infrastructure.Tests.csproj
├── Persistence/
└── Identity/
```

### tests/Coop.IntegrationTests

End-to-end integration tests against a real database.

```text
Coop.IntegrationTests/
├── Coop.IntegrationTests.csproj
├── Fixtures/
└── Scenarios/
    ├── Identity/
    ├── Profiles/
    ├── Maintenance/
    ├── Documents/
    ├── Messaging/
    └── Assets/
```

---

## Dependency Graph

```text
Coop.Api
  └── Coop.Application
  │     └── Coop.Domain
  │     │     └── Coop.SharedKernel
  │     └── Coop.SharedKernel
  └── Coop.Infrastructure
        └── Coop.Application
        └── Coop.Domain
        └── Coop.SharedKernel
```

The dependency rule enforces that inner layers (Domain, SharedKernel) have no knowledge of outer layers (Application, Infrastructure, Api).

---

## Key Conventions

| Convention | Detail |
|---|---|
| **Architecture** | Clean Architecture (API -> Application -> Domain) |
| **CQRS** | MediatR for command/query dispatching |
| **Persistence** | EF Core with single shared `CoopDbContext` |
| **Validation** | FluentValidation via MediatR pipeline behaviors |
| **Authorization** | Resource-level privilege checks via MediatR behaviors |
| **Event Sourcing** | Domain events persisted as `StoredEvent` records |
| **Inheritance** | TPH (Table-per-Hierarchy) for profile subtypes |
| **Owned Entities** | Comments and attachments as EF Core owned entities |
