<h1 align="center">Coop</h1>

<p align="center">
  <strong>Cooperative housing, managed.</strong><br>
  A cooperative residential management platform with a public-facing web app
  for members and an admin backend for staff, board members, and system
  administrators.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/.NET-10.0-512BD4.svg" alt=".NET 10">
  <img src="https://img.shields.io/badge/Angular-22-DD0031.svg" alt="Angular 22">
  <img src="https://img.shields.io/badge/Playwright-e2e-2EAD33.svg" alt="Playwright">
</p>

<p align="center">
  <a href="#overview">Overview</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#development">Development</a> ·
  <a href="#testing">Testing</a> ·
  <a href="#documentation">Documentation</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## Overview

Coop is built around the day-to-day work of running a housing cooperative:

- members raise maintenance requests, read published notices, bylaws, and
  reports, and message staff;
- staff and board members triage requests, publish documents, and manage
  invitations and onboarding;
- system administrators manage users, roles, privileges, themes, and CMS
  content.

The project is documentation-first and full-stack. The requirements in
`docs/specs/` define behavior, and the backend owns business rules,
persistence, authentication, seeding, and API contracts. The two Angular
applications own the user experience and consume the backend through a shared
REST API. The Playwright suites check behavior in each application.

The target architecture is a **modular monolith**: one deployable backend
organized into explicit business modules, one shared database, and one REST API
surface that serves both applications.

## Features

- User accounts with secure credential storage and soft delete, JWT
  authentication, and role-based access control with resource-level
  privileges (Read, Write, Create, Delete) for the Member, Staff, BoardMember,
  SystemAdministrator, and Support roles.
- Multiple profile types per user (Member, BoardMember, StaffMember, OnCall)
  with a current and default profile.
- Maintenance request workflow: New, Received, Started, and Completed, with
  comments, photo evidence, and an audit history.
- Document management for notices, bylaws, and reports, with draft and
  published states; published documents are readable anonymously.
- Members choose on their profile whether new notices reach them by email or
  text message, and the office sends a published notice to them once. Emails
  go out through an SMTP server when one is configured; text messages and
  emails without one are written to the API log.
- Messaging between members and staff.
- Digital asset upload, avatars, and anonymous serving of public assets.
- Theme and JSON content management that drives the public site, and website
  pages the office adds, edits and removes from the admin app that appear in
  the public header navigation, the Board of Directors list the home page
  shows, and every text, link and photo of the public header, footer and home
  page, all kept from the admin app.
- Invitation and onboarding flows for new members.
- Event sourcing and audit trail for domain changes.
- Static HTML references of the implemented screens under `docs/mocks/`,
  captured from both applications.

## Getting started

### Prerequisites

- .NET SDK `10.0.401` or a compatible feature-band SDK, as pinned by
  `backend/global.json`
- Node.js and npm
- Chromium for the Playwright suites (`npx playwright install chromium`)

The backend stores data in a local SQLite file, so no database server is
required.

### Quick start

Run the API and both applications in separate terminals.

```powershell
# API on http://localhost:5000
dotnet run --project .\backend\src\Coop.Api --urls http://localhost:5000
```

```powershell
cd frontend
npm ci

# Public app on http://localhost:4201
npm run start:public

# Admin app on http://localhost:4200 (in another terminal)
npm run start:admin
```

The applications compile in `http://localhost:5000/api` as the API address, and
the API only allows CORS requests from `http://localhost:4200` and
`http://localhost:4201`, so keep those ports.

On startup the API creates `coop.db` if it is missing and seeds fictional
development data: roles and privileges, an `admin` user, a `member` user,
sample board members, and the public site content the admin Website screen
edits. The database has no migrations yet, so after an update that adds a
column (such as the website page photo description) delete `coop.db` and
restart the API to recreate it. Swagger is available at `http://localhost:5000/swagger`
in the Development environment. See [backend/README.md](backend/README.md) for the seed
accounts and the backend layout.

### Design reference (static mocks)

Open any page under [docs/mocks/pages](docs/mocks/pages/), for example
`docs/mocks/pages/public-register/default.html`, directly from disk. No server is
required. See the [mock README](docs/mocks/README.md) for capture setup,
provenance, and known differences from the requirements.

## Architecture

| Area | Path | Notes |
| --- | --- | --- |
| Backend API | `backend/src/Coop.Api` | ASP.NET Core controllers, `Program.cs`, DI composition, Swagger, seed data |
| Backend tests | `backend/tests/Coop.Api.Tests` | Acceptance tests through the API over an in-memory database |
| Application layer | `backend/src/Coop.Application` | MediatR handlers, FluentValidation validators, pipeline behaviors, DTO contracts |
| Domain layer | `backend/src/Coop.Domain` | Entities, enums, aggregates, and authorization rules with no infrastructure dependency |
| Infrastructure | `backend/src/Coop.Infrastructure` | EF Core with SQLite, `CoopDbContext`, identity services, notifications |
| Shared kernel | `backend/src/Coop.SharedKernel` | Constants and authentication primitives shared across layers |
| Public app | `frontend/projects/public` | Angular public and member application ([README](frontend/projects/public/README.md)) |
| Admin app | `frontend/projects/admin` | Angular administration application ([README](frontend/projects/admin/README.md)) |
| API library | `frontend/projects/api` | Angular library for service contracts and injection tokens; scaffold only so far |
| Component library | `frontend/projects/components` | Angular library with the design system's presentation components and global foundations, used by the admin app (ADR 0010) |
| E2E suite | `e2e` | Playwright projects for the public and admin apps; `tests/` express intent, `pages/` own selectors, `fixtures/` hold test data |
| Design reference | `docs/mocks` | Static HTML references of both applications, with capture scripts and a manifest |
| Design system | `docs/design-system` | Tokens, component styles, and foundation, component and pattern pages for the admin site, adopted from the Shelfie design system; light and dark themes; the admin app loads its tokens, and `components.css` is the design reference for the components library |
| Requirements | `docs/specs` | L1 high-level and L2 detailed requirements with acceptance criteria |
| Videos | `docs/videos`, `tools/` | Narrated videos built from a script and slides; tools in `tools/video-audio` and `tools/video-build` |
| Board pitch | `docs/pitch` | Picture-first pitch page, one-page handout, and slide deck for the OWN board |

Layer dependencies point inward: Api → Infrastructure → Application →
Domain → SharedKernel. Business rules live in MediatR handlers and domain
services, not controllers. The repository follows the `backend/`, `frontend/`, and `e2e/` layout described
in [AGENTS.md](AGENTS.md).

## Development

Common commands from the repository root:

```powershell
# Backend
dotnet build .\backend\Coop.sln
dotnet run --project .\backend\src\Coop.Api --urls http://localhost:5000

# Frontend workspace
cd frontend
npm run start:public     # http://localhost:4201
npm run start:admin      # http://localhost:4200
npm run build            # builds every project
npm test
```

Development conventions:

- Keep backend business rules in application handlers and domain services, not
  controllers.
- Keep cross-cutting rules (validation, resource authorization) in MediatR
  pipeline behaviors.
- Run EF migrations through an explicit command; the API should not apply
  them on startup.
- Keep seed data idempotent, safe to rerun, and clearly fictional.
- Require authentication by default and mark anonymous endpoints explicitly.
- Update the L1/L2 requirements, detailed design, and mock before changing
  production behavior.
- Keep each class, interface, type alias, and enum in its own kebab-case file,
  with separate Angular template and style files.

## Testing

| Suite | Command | Purpose |
| --- | --- | --- |
| Backend build | `dotnet build .\backend\Coop.sln` | Compile the API, application, domain, infrastructure, and shared kernel projects |
| Backend tests | `dotnet test .\backend\Coop.sln` | Acceptance tests through the API with an in-memory database (`backend/tests/Coop.Api.Tests`) |
| Frontend build | `npm run build` from `frontend` | Build the public and admin applications and the shared libraries |
| Frontend unit tests | `npm test` from `frontend` | Angular Vitest tests |
| Playwright | `npm test` from `e2e` | End-to-end behavior for both apps against an in-process mock of the API |
| Public Playwright | `npm run test:public` from `e2e` | The public app on :4201 |
| Admin Playwright | `npm run test:admin` from `e2e` | The admin app on :4200 |

The Playwright suite starts both Angular apps when they are not already
running and runs in Chromium. It never needs the backend: every request to
`http://localhost:5000/api` is answered by the in-process mock in
`e2e/fixtures/mock-api/`, which seeds fictional data per test. Backend
behavior is tested through the API at the integration boundary in
`backend/tests/Coop.Api.Tests`, over an in-memory database rather than a
real one.

## Documentation

| Topic | Location |
| --- | --- |
| Backend guide | [backend/README.md](backend/README.md) |
| Requirements | [Level 1](docs/specs/L1.md) and [Level 2](docs/specs/L2.md) specifications in [docs/specs](docs/specs/) |
| Design reference | [docs/mocks](docs/mocks/pages/) and its [README](docs/mocks/README.md) |
| Detailed designs | [docs/detailed-designs](docs/detailed-designs/), one folder per feature with its README and diagrams |
| Architecture decisions | [docs/adr](docs/adr/) |
| Frontend workspace | [frontend](frontend/README.md) |
| Public app | [frontend/projects/public](frontend/projects/public/README.md) |
| Admin app | [frontend/projects/admin](frontend/projects/admin/README.md) |
| Videos | [docs/videos](docs/videos/README.md) |
| Board pitch | [docs/pitch](docs/pitch/README.md) |
| Agent guidance | [AGENTS.md](AGENTS.md) |

Detailed designs are written per feature under `docs/detailed-designs/` as the
feature is implemented; architecture decisions go in `docs/adr/`.

## Deployment

A GitHub Actions workflow, `.github/workflows/ci.yml`, runs on pushes and pull
requests to `main`. It builds and tests the backend (`dotnet test`) and lints
and builds the frontend (`npm run lint`, `npm run build`). It does not deploy
anything.

Before deploying anywhere, replace the development `Authentication:JwtKey` in
`backend/src/Coop.Api/appsettings.json` with a secret supplied through environment
variables or a secret store, and update the CORS origins in
`backend/src/Coop.Api/Dependencies.cs`.

## Contributing

Contributions are welcome when they keep the platform useful, testable, and
aligned with the requirements. See [CONTRIBUTING.md](CONTRIBUTING.md) for the
development workflow, coding guidelines, test expectations, and pull request
checklist.

## Security

Do not report suspected security vulnerabilities in public issues. See
[SECURITY.md](SECURITY.md) for supported versions, private reporting guidance,
and security-sensitive areas that require extra review.

## Support

Use GitHub Issues for reproducible bugs, feature requests, and documentation
problems. See [SUPPORT.md](SUPPORT.md) for the information to include in a good
report.

## Code of Conduct

Participation in this project is governed by
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

Coop is licensed under the [MIT License](LICENSE).
