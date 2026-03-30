# 09 - Invitation and Onboarding

## Overview

The Invitation and Onboarding feature governs how new members, board members, on-call personnel, and staff join the Coop platform. An administrator creates an **InvitationToken** in the admin backend and shares it with the invitee. The invitee redeems that token through the public-facing onboarding flow, where the system validates it, determines the role type, and provisions the appropriate account and profile.

This design assumes a single implementation inside the modular monolith. Invitation tokens are single-use, can be time-limited, and are persisted by the Profile and Identity-related modules in the shared backend.

## Key Components

### Domain Layer

- **InvitationToken**: aggregate root representing a shareable invitation credential. Carries a unique `Value`, an `InvitationTokenType`, optional expiry metadata, `IsUsed`, and creation timestamps.
- **InvitationTokenType**: enumeration (`Member`, `BoardMember`, `OnCall`, `Staff`) controlling which profile type is created when the token is consumed.
- **ValidateInvitationToken**: domain event raised when token validation is requested.
- **ValidatedInvitationToken**: domain event carrying the validation result.

### Application Layer

- **InvitationTokenHandlers**: create, query, update expiry, validate, consume, and remove invitation tokens.
- **InvitationTokenDto / Extensions**: projection and mapping utilities.
- **InvitationTokenValidator**: FluentValidation rules for token commands and DTOs.

### API Layer

- **Admin invitation endpoints**: secured CRUD and pagination used by the admin backend.
- **Public invitation endpoints**: anonymous validation and token-consumption endpoints used by the public onboarding journey.

### Infrastructure Layer

- **InvitationTokenConfiguration**: EF Core configuration enforcing uniqueness on `Value`, indexing on `Type`, and length constraints on token values.

## Diagrams

### Class Diagram

![Class Diagram](class-diagram.png)

### Sequence: Create Invitation Token

![Create Invitation Token](sequence-create-invitation.png)

### Sequence: Validate Token and Create Account

![Validate Token](sequence-validate-token.png)

### Token Lifecycle State Diagram

![Token Lifecycle](state-token-lifecycle.png)

### C4 Context Diagram

![C4 Context](c4-context.png)

### C4 Container Diagram

![C4 Container](c4-container.png)

### C4 Component Diagram

![C4 Component](c4-component.png)

## Design Decisions

1. **Single-use enforcement** prevents token replay and closes a major onboarding security gap.
2. **Anonymous validation endpoint** lets the public onboarding flow verify a token before prompting the invitee for full registration details.
3. **In-process provisioning workflow** allows user creation, role assignment, and profile creation to happen inside the modular monolith without distributed orchestration.
4. **Type-driven provisioning** maps `InvitationTokenType` directly to the resulting profile subtype.
