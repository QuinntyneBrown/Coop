# Coop Backend

.NET 10 Clean Architecture backend for the Coop cooperative residential
management platform. It serves one REST API to both the public and admin
Angular applications. See `docs/specs/` for the requirements it implements.

## Layout

```
backend/
  Coop.sln
  Directory.Build.props          # shared compile settings (net10.0, nullable, implicit usings)
  global.json                    # pins the SDK to 10.0.x
  src/
    Coop.SharedKernel/           # constants and authentication primitives (no dependencies)
    Coop.Domain/                 # entities, enums, aggregates, authorization rules
    Coop.Application/            # MediatR handlers, validators, pipeline behaviors, DTOs, ICoopDbContext
    Coop.Infrastructure/         # CoopDbContext (EF Core + SQLite), identity services, notifications
    Coop.Api/                    # controllers, Program.cs, DI composition in Dependencies.cs
  tests/
    Coop.Api.Tests/              # acceptance tests through the API over an in-memory database
```

Layer dependencies point inward and are strict: Api references all other
layers, Infrastructure references Application, Application references Domain,
and Domain references only the shared kernel.

Business modules are organized by folder in the Domain and Application layers:
Identity, Roles and Privileges, Profiles, Maintenance, Documents, Messaging,
Assets, CMS (JSON content, themes and website pages), Onboarding, and
EventSourcing. Controllers translate HTTP to MediatR requests and responses;
business rules live in handlers and domain services. Validation and resource
authorization run as pipeline behaviors (`ValidationBehavior` in
`Coop.Application/Behaviors/` and `ResourceOperationAuthorizationBehavior` in
`Coop.Domain/Authorization/`); a request class opts into authorization with
`[AuthorizeResourceOperation(accessRight, aggregate)]`, and
`ExceptionHandlingMiddleware` in `Coop.Api/Middleware/` turns validation
failures into 400 and refused operations into 403.

## Local quickstart

```powershell
# 1. Restore and build
dotnet build backend/Coop.sln

# 2. Run the API (creates and seeds coop.db on first start)
dotnet run --project backend/src/Coop.Api --urls http://localhost:5000
```

Swagger UI is served at `http://localhost:5000/swagger` when
`ASPNETCORE_ENVIRONMENT` is `Development`. Both Angular applications call
`http://localhost:5000/api`, and CORS allows `http://localhost:4200` (admin) and
`http://localhost:4201` (public).

## Configuration

Settings live in `backend/src/Coop.Api/appsettings.json` and
`appsettings.Development.json`.

| Setting | Purpose |
| --- | --- |
| `ConnectionStrings:DefaultConnection` | SQLite database file; defaults to `Data Source=coop.db` |
| `Authentication:JwtKey` | JWT signing key, at least 32 characters |
| `Authentication:JwtIssuer`, `JwtAudience` | Token issuer and audience |
| `Authentication:ExpirationMinutes` | Token lifetime |
| `Authentication:TokenPath` | Token endpoint, `/api/user/token` |

The checked-in `JwtKey` is a development value. Supply a real secret through
environment variables or a secret store for any shared or deployed environment.

## Seed data

On startup the API ensures the database exists and seeds it when it is empty.
Seed data is clearly fictional: the five roles (Member, Staff, BoardMember,
SystemAdministrator, Support) with their privileges, three sample board members,
and two development accounts that the Playwright suites sign in with. Seeding
is safe to re-run: when a new aggregate such as `Page` is added, the next start
grants it to the existing roles at each role's level.

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `Admin123!` | SystemAdministrator |
| `member` | `Member123!` | Member |

These credentials are for local development only.

## Current state

The code does not yet match every rule in [AGENTS.md](../AGENTS.md):

- The API creates the database and seeds it on startup instead of applying
  migrations through an explicit command, and there is no `Coop.Cli` project for
  `migrate`, `seed`, and `reset`.
- Only `Coop.Api.Tests` exists under `backend/tests/`; it covers website pages
  so far. Add coverage for other areas through the API, following its pattern.

Close the remaining gaps in a slice of their own, with an ADR for each decision.

## Test the stack

```powershell
dotnet build backend/Coop.sln
dotnet test backend/Coop.sln
```

`backend/tests/Coop.Api.Tests` hosts the real API with
`WebApplicationFactory<Program>` over the EF Core in-memory provider, one
database per test class, seeded by the API's own startup seed; tests sign in
with the seeded accounts and assert HTTP responses only (ADR 0003). Backend
acceptance tests must not use a real database.

End-to-end behavior is covered by the Playwright suite in `e2e/`, which mocks
the API in-process and does not start or require this backend.

## API surface

Routes are under `/api`. Endpoints require authentication unless noted.

| Route | Purpose |
| --- | --- |
| `/api/user` | Create users, authenticate (`POST token`, anonymous), current user, change and reset password, availability check (`GET exists/{username}`, anonymous) |
| `/api/role`, `/api/privilege` | Role and privilege management |
| `/api/profiles`, `/api/members`, `/api/boardmembers`, `/api/staffmembers` | Profiles by type |
| `/api/maintenancerequest` | Create, list (`my` for the caller's own), and move requests through receive, start, and complete |
| `/api/maintenancerequestcomment`, `/api/maintenancerequestdigitalasset` | Comments and photo evidence on a request |
| `/api/document` | Documents, including publish |
| `/api/notice`, `/api/bylaw`, `/api/report` | Typed documents; `GET published` is anonymous |
| `/api/conversations`, `/api/messages` | Messaging |
| `/api/invitationtoken` | Invitation tokens; `GET validate/{value}` is anonymous |
| `/api/digitalasset` | Upload, avatars, and listing; `serve/{id}` and `by-name/{name}` are anonymous |
| `/api/theme` | Themes, including the default theme and a theme per profile |
| `/api/jsoncontent` | CMS content; `GET name/{name}` is anonymous |
| `/api/pages` | Website pages for the public site; `GET` and `GET {slug}` are anonymous, `POST`, `PUT` and `DELETE {pageId}` require the Create, Write or Delete privilege on the `Page` aggregate |
| `/api/events`, `/api/storedevent` | Event sourcing and audit history |
| `PublicBffController` routes | Endpoints shaped for the public app: `user/register`, `user/profile`, `maintenance-requests`, `documents`, `conversations/{id}/messages`, `board-members`, `json-content` |

Most collections also expose `GET page/{pageSize}/{index}` for paging. The
generated Swagger document is the complete reference.
