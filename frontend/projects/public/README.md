# Coop Public

Angular public and member application for Coop. It serves the CMS-driven public
site (landing page, published documents, board members) and the signed-in member
experience (maintenance requests, messaging, profile, onboarding).

It is the `public` project of the [frontend workspace](../../README.md) and
talks to the Coop API at `http://localhost:5000/api`.

## Routes

| Route                                     | Screen                                 | Access    |
| ----------------------------------------- | -------------------------------------- | --------- |
| `/`                                       | Landing page                           | Public    |
| `/login`, `/register`, `/forgot-password` | Authentication                         | Public    |
| `/documents`                              | Published notices, bylaws, and reports | Public    |
| `/dashboard`                              | Member dashboard                       | Signed in |
| `/onboarding`                             | Onboarding                             | Signed in |
| `/maintenance`                            | Maintenance requests and comments      | Signed in |
| `/messaging`                              | Conversations and messages             | Signed in |
| `/profile`                                | Profile and password                   | Signed in |

Unknown routes redirect to the landing page.

## Layout

```
src/app/
  core/        # guards, interceptors, and services (API, auth, theme)
  layout/      # shell for signed-in pages
  pages/       # one folder per screen
```

## Development

From `frontend/`:

```powershell
npm ci
npm run start:public     # http://localhost:4201
npm run build:public
```

Keep port 4201: the API allows CORS requests from `http://localhost:4201` and the
Playwright `public` project in [`e2e`](../../../e2e) expects it. The
API must be running on `http://localhost:5000`.

## Design reference

Static HTML captures of every public screen and state are in
[`docs/mocks/pages`](../../../docs/mocks/pages/) (`public-*`). Keep the
implementation's visual classes and accessible state semantics aligned with the
mocks, and change the mock first when the design changes intentionally.
