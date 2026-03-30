# 04 - Profile Management: Detailed Design

## Overview

The Profile Management feature supports multiple profile types per user within the Coop modular monolith. A single user may hold profiles such as Member, BoardMember, StaffMember, or OnCall, and can switch between them through the current/default profile mechanism used by both the public web app and the admin backend.

The domain model uses a Table-Per-Hierarchy (TPH) inheritance strategy with `ProfileBase` as the abstract base class. Each concrete subtype extends the base with role-specific attributes such as `BoardTitle`, `JobTitle`, or `Address`. Profile creation and updates are coordinated in-process with the user-account module so current/default profile state can be maintained inside the same backend transaction boundary.

## Requirements Traceability

This design satisfies **L1-REQ-004**: "The system shall support multiple profile types (Member, BoardMember, StaffMember, OnCall) per user, allowing users to operate under different contexts with a current and default profile selection."

## Domain Model

![Class Diagram](class-diagram.png)

### Key Entities

| Entity | Responsibility |
|---|---|
| **ProfileBase** | Shared profile attributes including name, phone, avatar reference, timestamps, and `ProfileType`. |
| **Member** | Resident profile with optional `Address`. |
| **BoardMember** | Profile for board participants with `BoardTitle`. |
| **StaffMember** | Profile for cooperative staff with `JobTitle`. |
| **OnCall** | Emergency or after-hours support profile. |
| **Address** | Owned value object representing Street, Unit, City, Province, and PostalCode. |
| **ProfileType** | Enumeration discriminator for the supported profile variants. |

### Value Objects

`Address` is modeled as an owned entity in EF Core and stays local to the Profile module. It is used only by the `Member` subtype and is persisted together with the owning profile record.

## Behavioral Flows

### Create Profile

When a new profile is created through a type-specific endpoint, the system instantiates the concrete subtype, persists it, and updates the owning user's current/default profile references in-process when the new profile is the user's first one.

![Create Profile Sequence](sequence-create-profile.png)

### Update Avatar

Avatar updates are handled through the generic `ProfilesController.SetAvatar` endpoint. The profile's `AvatarDigitalAssetId` is updated to reference a digital asset already stored by the Asset module.

![Update Avatar Sequence](sequence-update-avatar.png)

### Profile Lifecycle

A profile transitions through Created, Active, and Deleted states. Most mutations happen while the profile is Active.

![Profile Lifecycle State Diagram](state-profile-lifecycle.png)

## Architecture Views

### C4 Context

The context diagram shows the Profile Management module and the adjacent capabilities it collaborates with inside the modular monolith.

![C4 Context Diagram](c4-context.png)

### C4 Container

The container diagram shows the profile-related API, application logic, persistence, and shared database.

![C4 Container Diagram](c4-container.png)

### C4 Component

The component diagram highlights the profile controllers, application services, and persistence components used for profile operations.

![C4 Component Diagram](c4-component.png)

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/profiles` | List all profiles |
| GET | `/api/profiles/{id}` | Get profile by ID |
| GET | `/api/profiles/by-user/{userId}` | Get profiles for a user |
| PUT | `/api/profiles/{id}/avatar` | Set profile avatar |
| DELETE | `/api/profiles/{id}` | Delete a profile |
| GET | `/api/boardmembers` | List board members |
| GET | `/api/boardmembers/{id}` | Get board member by ID |
| POST | `/api/boardmembers` | Create board member |
| PUT | `/api/boardmembers/{id}` | Update board member |
| GET | `/api/members` | List members |
| GET | `/api/members/{id}` | Get member by ID |
| POST | `/api/members` | Create member |
| PUT | `/api/members/{id}` | Update member |
| GET | `/api/staffmembers` | List staff members |
| GET | `/api/staffmembers/{id}` | Get staff member by ID |
| POST | `/api/staffmembers` | Create staff member |
| PUT | `/api/staffmembers/{id}` | Update staff member |

## Internal Notifications

| Notification | Raised When | Purpose |
|---|---|---|
| `ProfileCreated` | A new profile is persisted | Update current/default profile state and refresh dependent read models. |
| `ProfileUpdated` | Profile attributes change | Refresh dependent UI projections and audit history. |
| `ProfileDeleted` | A profile is removed | Clear or recalculate dependent user-profile selections. |

## Data Storage

The Profile module persists data in the shared Coop database using module-owned tables or schema. TPH inheritance maps all profile subtypes to a single `Profiles` table with a discriminator column, while related onboarding records remain owned by the same module.

## Security

All profile write endpoints require JWT authentication and role-based privileges. Public-web-app member journeys only access profile data for the authenticated user context; broader profile administration is reserved for the admin backend.
