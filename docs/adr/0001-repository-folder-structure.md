# 0001. Repository folder structure

- Status: Accepted
- Date: 2026-10-13

## Context

The repository grew with backend projects in `src/`, two standalone Angular 19
workspaces in `apps/coop-public` and `apps/coop-admin`, and two Playwright
suites in `tests/e2e-public` and `tests/e2e-admin`. Each Angular app carried its
own `angular.json`, `package.json`, and `node_modules`, and each suite its own
configuration. `AGENTS.md` adopts the Saturdaze folder structure, and the
project skills already assume it.

## Decision

- `backend/` holds `Coop.sln`, `global.json`, `Directory.Build.props`, and the
  projects in `backend/src/`. The shared target framework, nullable, and
  implicit-usings settings live in `Directory.Build.props`.
- `frontend/` is one Angular workspace with projects `public`, `admin`, `api`,
  and `components` under `frontend/projects/`. `api` and `components` are
  scaffolds until shared code moves into them.
- Dev server ports are fixed: `admin` on 4200 and `public` on 4201. The API
  allows these origins through CORS and the e2e configuration relies on them.
- `e2e/` is one Playwright package with two projects, `public` and `admin`.
  Tests, page objects, and fixtures are separated by app subfolder because the
  two suites define different fixtures and page objects under the same names.

## Consequences

- One `npm install` per workspace, and `npm run build:public` and
  `npm run build:admin` build each app.
- `backend/tests/`, `Coop.Cli`, and `Directory.Packages.props` do not exist
  yet and are added when those areas are touched.
- Mock provenance paths in `docs/mocks` point at `frontend/projects/*`.
- The Azure Static Web Apps workflow builds only the public app.
