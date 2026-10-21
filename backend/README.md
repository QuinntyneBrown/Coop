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
    Coop.Infrastructure/         # CoopDbContext (EF Core + SQLite), identity, notifications, seed, AddCoopCore
    Coop.Api/                    # controllers, Program.cs, DI composition in Dependencies.cs
    Coop.Cli/                    # command-line tool: database reset and administration (coop)
  tests/
    Coop.Api.Tests/              # acceptance tests through the API over an in-memory database
    Coop.Cli.Tests/              # runs the tool in process, checks the result through the API
```

Layer dependencies point inward and are strict: Api references all other
layers, Infrastructure references Application, Application references Domain,
and Domain references only the shared kernel. Cli references every layer
except Api, and builds the same services through `AddCoopCore`
(`Coop.Infrastructure/Dependencies.cs`).

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
failures into 400 and refused operations into 403. Requests of the office's
areas carry `[OfficeOnly]`, and `OfficeOnlyBehavior`, which runs first, refuses
them for anyone without the Staff, BoardMember, SystemAdministrator or Support
role; handlers scope members' own data with `CallerAccess` (ADR 0016).

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
| `Notices:Email:Host`, `Port` | SMTP server that sends notice emails, port 587 by default; leave `Host` empty to only log them |
| `Notices:Email:UserName`, `Password` | SMTP credentials; set with `dotnet user-secrets` or environment variables, never in `appsettings.json` |
| `Notices:Email:FromAddress`, `FromName` | Sender members see on a notice email |
| `Notices:Email:PickupDirectory` | Development and tests only: write each email as an `.eml` file in this folder instead of using the network |

The checked-in `JwtKey` is a development value. Supply a real secret through
environment variables or a secret store for any shared or deployed environment.

## Seed data

On startup the API ensures the database exists and seeds it when it is empty
(`Coop.Infrastructure/Persistence/Seeding/SeedData.cs`).
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

## Command-line tool

`Coop.Cli` (`coop`) is for a trusted operator on the machine that holds the
database. It sends the same MediatR requests as the API, through the same
validation and authorization behaviors, as an operator identity with full
access (ADR 0012 to ADR 0015); it never prints passwords, hashes or salts.
Run it from the folder you run the API from, so both use the same
`Data Source=coop.db`, or pass `--connection "<connection string>"`.
`ConnectionStrings__DefaultConnection` also works, as for the API.

```powershell
dotnet run --project backend/src/Coop.Cli -- --help
dotnet run --project backend/src/Coop.Cli -- user --help
```

> **Warning:** `db reset` deletes every record in the database before it
> seeds it again. It refuses to run without `--yes`.

Reset to the demo state: every screen has fictional content, the public
site's photos are stored as digital assets, and each role has a sign-in.
`--api-url` sets the API address the photos are served from
(`http://localhost:5000/api` by default).

```powershell
dotnet run --project backend/src/Coop.Cli -- db reset --demo --yes
```

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `Admin123!` | SystemAdministrator |
| `member` | `Member123!` | Member |
| `staff` | `Staff123!` | Staff |
| `board` | `Board123!` | BoardMember |
| `support` | `Support123!` | Support |

Reset for a new instance: the roles and privileges, one system administrator
you name, and the baseline public site content; nothing else. The username
and password follow the API's rules (at least 3 and 6 characters) and are
checked before anything is deleted.

```powershell
dotnet run --project backend/src/Coop.Cli -- db reset --new-instance --admin-username ruth --admin-password "<a strong password>" --yes
```

| Group | Commands |
| --- | --- |
| `user` | `list`, `create --username --password [--role]...`, `rename --username --new-username`, `set-password --username --password`, `add-role` / `remove-role --username --role`, `remove --username` |
| `role` | `list`, `create --name`, `remove --name`, `grant` / `revoke --role --aggregate --access <Read\|Write\|Create\|Delete>` |
| `invitation` | `list`, `create --value --type <Member\|BoardMember\|StaffMember> [--expires yyyy-mm-dd]`, `remove --value` |
| `site-content` | `export [--file]`, `import --file` (JSON in the shape `GET /api/site-content` returns) |
| `page` | `list`, `create --title --body-file [--hero-image-url --hero-image-alt]`, `update --slug [...]`, `remove --slug` |
| `board` | `export [--file]`, `import --file` (a JSON array of `name`, `title`, `photoUrl`) |
| `asset` | `list`, `upload --file`, `remove --id` |
| `theme` | `list`, `create --css-file [--default]`, `update --id --css-file [--default]`, `remove --id` |
| `notice`, `bylaw`, `report` | `list`, `create --name [--body] [--asset-id] [--publish]`, `update --id --name [...]`, `publish --id`, `remove --id`; `notice send --id` |

The last active system administrator cannot be removed or lose that role, and
the SystemAdministrator role cannot be removed. Creating a role, a privilege
or an invitation that already exists returns the existing one (ADR 0015).
The design is `docs/detailed-designs/cli/command-line-administration/`.

## Current state

The code does not yet match every rule in [AGENTS.md](../AGENTS.md):

- The API still creates the database and seeds it on startup, and the database
  has no EF migrations, so there is no `migrate` command; `coop db reset`
  creates the schema the same way the API does.
- `backend/tests/` holds `Coop.Api.Tests`, which covers website pages, the
  Board of Directors list, site content, digital assets, maintenance, notices
  and profiles, and
  `Coop.Cli.Tests`, which covers the command-line tool. Add coverage for other
  areas through the API, following their pattern.

Close the remaining gaps in a slice of their own, with an ADR for each decision.

## Test the stack

```powershell
dotnet build backend/Coop.sln
dotnet test backend/Coop.sln
```

`backend/tests/Coop.Api.Tests` hosts the real API with
`WebApplicationFactory<Program>` over the EF Core in-memory provider, one
database per test class, seeded by the API's own startup seed; tests sign in
with the seeded accounts and assert HTTP responses only (ADR 0003).
`backend/tests/Coop.Cli.Tests` runs the tool in process with
`CliApp.RunAsync` against the same in-memory database as an API host, then
checks the result through HTTP, for example by signing in with a password the
tool just set (ADR 0012). Backend acceptance tests must not use a real
database.

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
| `/api/notice/{documentId}/send` | Sends a published notice once to the members who chose email or text message on their profile; requires the Write privilege on the `Notice` aggregate. Messages go through `INoticeSender`; emails go out through the configured SMTP server (ADR 0008), and text messages and emails without one are written to the log by `LoggingNoticeSender` (ADR 0007) |
| `/api/conversations`, `/api/messages` | Messaging |
| `/api/invitationtoken` | Invitation tokens; `GET validate/{value}` is anonymous |
| `/api/digitalasset` | Upload, avatars, and listing; `serve/{id}` and `by-name/{name}` are anonymous |
| `/api/theme` | Themes, including the default theme and a theme per profile |
| `/api/jsoncontent` | CMS content; `GET name/{name}` is anonymous |
| `/api/board-of-directors` | The board list the home page shows, stored as the `BoardOfDirectors` JSON content; `GET` is anonymous, `PUT` replaces the whole list and requires the Write privilege on the `JsonContent` aggregate |
| `/api/pages` | Website pages for the public site; `GET` and `GET {slug}` are anonymous, `POST`, `PUT` and `DELETE {pageId}` require the Create, Write or Delete privilege on the `Page` aggregate |
| `/api/events`, `/api/storedevent` | Event sourcing and audit history |
| `PublicBffController` routes | Endpoints shaped for the apps: anonymous `user/register`, `documents`, `board-members` and `json-content`, and, for the admin, `user/profile` (the `noticeByEmail` and `noticeByText` choice), `POST conversations` and `POST conversations/{id}/messages` (ADR 0016) |

Most collections also expose `GET page/{pageSize}/{index}` for paging. The
generated Swagger document is the complete reference.
