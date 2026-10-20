## Project Overview

Coop is a documentation-first repository for a cooperative residential
management platform, covering a public-facing web app and an admin backend.
The working tree includes an Angular workspace in `frontend/`, backend source
in `backend/`, Playwright suite in `e2e/`, and
implementation-derived HTML references in `docs/mocks/`.

The co-operative being managed is a home for retired, older women. Design
every screen, public and admin, for that audience.

## Audience and accessibility

- Take inspiration for the public site's content and layout from
  [PAL Toronto's About page](https://www.paltoronto.org/about-pal-toronto):
  a warm, community-focused tone, plain language, and a simple, readable
  layout. Treat it as inspiration only; do not copy its text, images,
  branding, or name.
- The whole site must meet WCAG 2.2 AA with retirees in mind: large readable
  text, strong contrast, generous click and touch targets, clear labels, and
  predictable navigation.
- Every screen must remain fully usable at 400% browser zoom. Content must
  reflow to a single column without horizontal scrolling or loss of content
  or function (WCAG 1.4.10 Reflow, a 320 CSS px wide viewport).

## Scope and complexity (critical)

This is the most important rule in this file. Do not expand scope or
significantly add complexity beyond what is implemented now.

- Do only what the task asks for. Do not add features, screens, states,
  endpoints, entities, requirements, or configuration that nobody requested.
- Match the size of the change to the size of the request. A small fix should
  stay a small diff.
- Prefer the simplest change that fits the existing code. Do not add new
  layers, abstractions, frameworks, libraries, patterns, or infrastructure
  where the current approach already works.
- Do not generalize for imagined future needs, and do not refactor or
  "improve" code next to the change unless the task requires it.
- Documentation, specs, designs, and mocks describe what is implemented. Do
  not use them to plan or introduce new behavior the user has not asked for.
- If a task seems to need broader scope or a significant jump in complexity,
  stop and ask the user before going ahead.

## Repository guidance

- Keep this file's description of the repository accurate as directories and
  applications change. Keep setup commands and layout in `README.md` aligned
  with the relevant application documentation.
- Read the relevant requirements in `docs/specs/` and designs in
  `docs/detailed-designs/` before changing an area. Record architectural
  decisions in an ADR when the project introduces that practice, and consult
  existing decisions before changing the areas they cover.
- A plan is not a requirement. Specify planned behavior in L1/L2 requirements,
  a detailed design, and a mock before implementing it.

## Repository layout

The repository adopts the Saturdaze folder structure. Place new files in
these locations and move existing files here as areas are touched:

- `backend/` — .NET solution (`Coop.sln`, `Directory.Build.props`,
  `Directory.Packages.props`, `global.json`)
  - `backend/src/` — `Coop.SharedKernel`, `Coop.Domain`, `Coop.Application`,
    `Coop.Infrastructure`, `Coop.Api`, and `Coop.Cli` (migrate, seed, reset)
  - `backend/tests/` — one test project per layer, e.g. `Coop.Api.Tests`
- `frontend/` — Angular workspace with projects under `frontend/projects/`:
  `public` (member app), `admin`, `api` (service contracts and injection
  tokens), and `components` (design-system library)
- `e2e/` — Playwright suite: `tests/` express intent, `pages/` own selectors
  and interactions, `fixtures/` hold test data
- `docs/specs/` — L1/L2 requirements
- `docs/detailed-designs/` — detailed designs
- `docs/mocks/` — static design reference
- `docs/design-system/` — tokens, component styles, and pages for the admin
  site, adopted from the Shelfie design system
- `docs/adr/` — architecture decisions; read relevant ADRs before changing
  the areas they cover
- `docs/videos/` — narrated videos (script, slides, captions, MP3/MP4)
- `docs/pitch/` — board pitch page, handout, and slide deck
- `tools/` — video tooling (`video-audio/`, `video-build/`)

All areas have moved to this layout. The `api` and `components` libraries in
`frontend/projects/` are still scaffolds, `backend/tests/` holds only
`Coop.Api.Tests`, and `Coop.Cli` does not exist yet. Update this note and
`README.md` when that changes.

See `README.md` for setup and development commands.

## Backend architecture (.NET)

Layer dependency direction (strict):

- `Coop.SharedKernel` — constants and authentication primitives shared across
  layers, zero project deps
- `Coop.Domain` — entities, enums, aggregates, and authorization rules, zero
  deps beyond the shared kernel
- `Coop.Application` — MediatR handlers, FluentValidation validators, pipeline
  behaviors, DTO contracts, `ICoopDbContext`
- `Coop.Infrastructure` — `CoopDbContext`, EF configurations and migrations,
  identity (password hashing, token building), notifications
- `Coop.Api` — controllers, `Program.cs`, DI composition in `Dependencies.cs`,
  Swagger, middleware ordering

Non-obvious rules:

- Business rules live in MediatR handlers and domain services, not controllers.
  Controllers translate HTTP to requests and responses only.
- Cross-cutting rules (validation, resource authorization) run as MediatR
  pipeline behaviors in `Coop.Application/Behaviors/`; do not re-implement
  them per handler or per controller.
- The API must not apply EF migrations on startup. Run migrations through an
  explicit command. Seeding is idempotent, safe to re-run, and clearly
  fictional.
- Authentication uses local JWTs configured from the `Authentication` section
  of app settings. Endpoints require authentication by default; mark
  anonymous access explicitly and preserve the Swagger, CORS, authentication,
  and authorization middleware order when changing API auth.
- Keep Serilog request logging outside any exception-handling middleware so
  handled response statuses are logged correctly.
- Scope private data to its owner and authorized roles; never expose another
  member's or household's resources through shared queries.
- Mutations that may be retried should be idempotent: re-posting returns the
  existing resource rather than throwing or duplicating it. Record such
  decisions in an ADR.

### Backend tests

Test backend behavior through the API at the integration boundary. Backend
acceptance tests must not use a real database: run the API against an
in-memory database or a test double, never against SQLite, SQL Server, or any
other persisted store. If test projects share logger or database state, run
them sequentially and record the reason in an ADR. Follow existing
test-project patterns when adding coverage.

## Architecture and data

- Keep business rules in the domain or application layer, not in controllers,
  route handlers, or UI components. The server is authoritative for business
  rules; client-side checks support the user experience.
- Run database migrations through an explicit command, never automatically on
  application startup.
- Make seed data safe to rerun and clearly fictional. Do not use real people,
  businesses, or addresses as sample records.
- Require authentication by default. Make anonymous endpoints an explicit
  choice, and scope private data to its owner and authorized roles.

## Frontend conventions

- Preserve the mock's visual classes and accessible state semantics in the
  application.
- Keep business rules and view-model logic in plain TypeScript beside the
  feature, not in templates or shared visual components.
- Keep component styles encapsulated and global styles limited to shared
  foundations and utilities. Use design tokens by role rather than hard-coded
  colours when a design system is available.
- Use a consistent path and title registry rather than repeating route strings
  and title suffixes throughout an app.
- Keep each class, interface, type alias, and enum in its own kebab-case file.
  Use separate template and style files for Angular components rather than
  inline templates or styles.
- Use the UI framework's accessible dialog or overlay primitives for editing
  dialogs. Button-triggered editing should open a dialog or navigate to a
  screen rather than expand an inline form.
- Design for phone widths without horizontal scrolling, respect device safe
  areas, and meet WCAG 2.2 AA.

## Verification and incremental implementation

- Update visual regression baselines only for intentional design changes.
  Record a snapshot policy in an ADR if visual regression coverage is added.
- Mocks and design-system artifacts are design references; do not apply ATDD
  to their creation or write tests for the artifacts themselves.
- Before changing production behavior, align the L1/L2 requirement, detailed
  design, and relevant mock. This applies to behavior changes in existing
  features as well as new features. Documentation-only, design-only, and
  test-only work is outside this prerequisite unless it is part of a
  production behavior change.
- For production behavior changes, follow the project
  `implementing-incrementally` skill. Work in small, reviewable slices. For
  each slice, write Given-When-Then acceptance criteria and an acceptance
  test, run the test to confirm it fails for the expected reason, implement
  only that slice, refactor with tests passing, and run relevant regression
  checks before starting the next slice. Do not weaken tests to manufacture a
  pass. Keep requirements, designs, mocks, criteria, tests, and code aligned.
- Test backend behavior through the API at the integration boundary. For
  frontend end-to-end tests, use Playwright page objects: page objects own
  selectors and interactions, while tests express intent. Run frontend tests
  in Chromium only.
- The Playwright suite must pass without a backend. Every request to the API
  origin is answered by the in-process mock in `e2e/fixtures/mock-api/`; do
  not add tests, fixtures, or setup that start the API, call a real
  endpoint, or depend on a database. Seed test data through the mock store
  and extend the mock when a frontend change calls a new endpoint.
- Backend acceptance tests must not use a real database. Test against an
  in-memory database or test double so the suite needs no database server,
  file, or migration to run.
- Test behavior, not codebase shape. Do not add tests for file structure,
  naming, banned API scans, or specification traceability; use the compiler,
  formatter, and review for those constraints.

## Project skills

Project skills live in `.claude/skills/` and are copied to `.agenets/skills/`.
Keep the two copies identical when updating a skill.

- `engineering-requirements` — L1/L2 requirements and acceptance criteria
- `writing-software-design-documents` — detailed designs from requirements
- `writing-html-mocks` — static page, dialog, and notification mocks
- `extracting-design-systems` — design system derived from the mocks
- `implementing-incrementally` — small, verifiable implementation slices
- `creating-videos` — narrated walkthrough videos
