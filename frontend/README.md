# Coop Frontend

Angular 22 workspace for the Coop applications. It holds the public and member
application, the administration application, and the shared libraries they will
build on. The applications call the Coop API at `http://localhost:5000/api`; see
the [root README](../README.md) for the full stack and the
[backend guide](../backend/README.md) for the API.

## Projects

| Project      | Path                  | Notes                                                                                    |
| ------------ | --------------------- | ---------------------------------------------------------------------------------------- |
| `public`     | `projects/public`     | Public and member application, served on port 4201 ([README](projects/public/README.md)) |
| `admin`      | `projects/admin`      | Administration application, served on port 4200 ([README](projects/admin/README.md))     |
| `api`        | `projects/api`        | Library for service contracts and injection tokens ([README](projects/api/README.md))    |
| `components` | `projects/components` | Design-system components used by the admin ([README](projects/components/README.md))     |

The API only allows CORS requests from `http://localhost:4200` and
`http://localhost:4201`, so keep those ports.

## Development

```powershell
npm ci
npm run start:public   # http://localhost:4201
npm run start:admin    # http://localhost:4200
npm run build:public
npm run build:admin
npm run build          # builds every project
npm test               # Vitest
npm run lint
npm run format
```

The API must be running on `http://localhost:5000`.

## Conventions

- Keep business rules and view-model logic in plain TypeScript beside the
  feature, not in templates or shared visual components.
- Keep each class, interface, type alias, and enum in its own kebab-case file.
  Use separate template and style files for Angular components.
- Keep component styles encapsulated and global styles limited to shared
  foundations and utilities.
- Use the design system's presentation components from the `components`
  library (`import { ButtonComponent } from 'components'`) rather than
  writing their markup by hand. The workspace `tsconfig.json` maps
  `components` to the library's source, so serving, building and testing an
  app needs no library build first.
- Follow the mocks in [`docs/mocks`](../docs/mocks/README.md): preserve their
  visual classes and accessible state semantics, and change the mock first when
  a design change is intentional.
- Design for phone widths without horizontal scrolling and meet WCAG 2.2 AA.

## End-to-end tests

The Playwright suite that exercises these applications lives in
[`e2e`](../e2e) (`npm run test:public` and `npm run test:admin`) and runs in
Chromium. It answers every API request from an in-process mock, so no backend
or database is needed.
