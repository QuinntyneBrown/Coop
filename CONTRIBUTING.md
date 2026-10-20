# Contributing to Coop

Thank you for your interest in improving Coop. This project is a documentation-first
cooperative residential management platform with a .NET backend, two Angular
applications, Playwright test suites, and static HTML design references.

## Before You Start

- Check existing issues and pull requests to avoid duplicate work.
- Open an issue first for user-visible behavior changes, larger refactors, or
  changes that affect API contracts.
- Keep pull requests focused on one fix, feature, or documentation update.
- Include screenshots or Playwright evidence for visible UI changes.
- Read the relevant requirements in `docs/specs/` before changing an area. A
  plan is not a requirement: specify planned behavior in the L1/L2
  requirements and a mock before implementing it.

## Development Setup

From the repository root, restore and build the backend, then install each
application's dependencies:

```powershell
dotnet build .\backend\Coop.sln

cd frontend
npm ci

cd ..\e2e
npm ci
```

Run the stack in separate terminals (see the [README](README.md#getting-started)
for details):

```powershell
dotnet run --project .\backend\src\Coop.Api --urls http://localhost:5000
cd frontend; npm run start:public    # http://localhost:4201
cd frontend; npm run start:admin     # http://localhost:4200
```

## Project Layout

| Path | Purpose |
| --- | --- |
| `backend/` | .NET solution and layers under `backend/src/`: SharedKernel, Domain, Application, Infrastructure, and Api |
| `frontend/` | Angular workspace: `public` and `admin` applications plus `api` and `components` libraries under `projects/` |
| `e2e/` | Playwright projects for the public and admin applications: `tests/`, `pages/`, `fixtures/` |
| `docs/specs/` | L1 and L2 requirements with acceptance criteria |
| `docs/mocks/` | Static HTML references of both applications |
| `docs/design-system/` | Design tokens, component styles and documentation pages for the admin site, adopted from the Shelfie design system |

[AGENTS.md](AGENTS.md) describes the `backend/`, `frontend/`, and `e2e/` layout
the repository follows. Place new files in those locations.

## Coding Guidelines

- Follow existing patterns in the layer you are changing.
- Keep backend business rules in MediatR handlers and domain services, not
  controllers. The server is authoritative; client-side checks support the user
  experience.
- Keep cross-cutting rules (validation, resource authorization) in MediatR
  pipeline behaviors rather than re-implementing them per handler.
- Keep EF migrations explicit. The API must not apply migrations on startup.
- Keep seed data idempotent, safe to rerun, and clearly fictional. Do not use
  real people, businesses, or addresses as sample records.
- Require authentication by default, mark anonymous endpoints explicitly, and
  scope private data to its owner and authorized roles.
- Keep each class, interface, type alias, and enum in its own kebab-case file.
  Use separate template and style files for Angular components.
- Keep business rules and view-model logic in plain TypeScript beside the
  feature, not in templates or shared visual components.
- Design for phone widths without horizontal scrolling and meet WCAG 2.2 AA.
- Keep visual changes consistent with `docs/mocks/` unless the pull request is
  intentionally updating the design; change the mock first.
- Avoid unrelated formatting churn and broad refactors in feature or bug-fix
  pull requests.

## Tests

Run the checks that match your change. For cross-stack changes, run all of
them.

```powershell
# Backend build and acceptance tests
dotnet build .\backend\Coop.sln
dotnet test .\backend\Coop.sln

# Frontend build and unit tests
cd frontend
npm run build
npm test

# Playwright (Chromium only)
cd ..\e2e
npm test
```

Test backend behavior through the API at the integration boundary. In the
Playwright suites, page objects own selectors and interactions and tests
express intent. Test behavior, not codebase shape.

For production behavior changes, work in small slices: write Given-When-Then
acceptance criteria and an acceptance test, confirm it fails for the expected
reason, implement only that slice, then run the relevant regression checks.
Update visual regression baselines only when the design change is intentional.

## Pull Request Checklist

- The change has a clear issue, rationale, or user-facing reason.
- Requirements, designs, and mocks are aligned with the behavior change.
- New or changed behavior has test coverage appropriate to the risk.
- Relevant documentation is updated.
- UI changes include screenshots or Playwright evidence.
- Database changes include explicit EF migrations and seed updates if needed.
- The pull request description lists the commands you ran.

## Reporting Bugs

When filing a bug, include:

- the route or command where the problem appears;
- expected behavior;
- actual behavior;
- reproduction steps;
- logs, screenshots, or terminal output;
- operating system, browser, and relevant tool versions.

## License

By contributing to this repository, you agree that your contributions are
licensed under the repository's MIT License.
