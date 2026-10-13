# Coop Admin

Angular administration application for Coop. It is the admin backend for staff,
board members, and system administrators: maintenance triage, document
publishing, website pages, the Board of Directors list, messaging, user and role management, invitations,
digital assets, and theme and content settings.

It is the `admin` project of the [frontend workspace](../../README.md) and talks
to the Coop API at `http://localhost:5000/api`.

## Routes

| Route                                         | Screen                                               | Access    |
| --------------------------------------------- | ---------------------------------------------------- | --------- |
| `/`                                           | Landing page                                         | Public    |
| `/login`, `/register`, `/forgot-password`     | Authentication                                       | Public    |
| `/onboarding`, `/change-password`, `/profile` | Account setup and profile                            | Signed in |
| `/dashboard`                                  | Dashboard                                            | Signed in |
| `/maintenance`                                | Maintenance requests                                 | Signed in |
| `/documents`                                  | Documents                                            | Signed in |
| `/pages`                                      | Website pages (add, edit, remove)                    | Signed in |
| `/board`                                      | Board of Directors list (add, edit, reorder, remove) | Signed in |
| `/messages`                                   | Messaging (`/messaging` redirects here)              | Signed in |
| `/users`, `/roles`, `/profiles`               | Users, roles and privileges, and profiles            | Signed in |
| `/assets`                                     | Digital assets                                       | Signed in |
| `/invitations`                                | Invitations                                          | Signed in |
| `/settings`                                   | Theme and content settings                           | Signed in |

Unknown routes redirect to the landing page.

## Layout

```
src/app/
  core/        # guards, interceptors, and services (API, auth)
  layout/      # layout, sidebar, and top bar
  features/    # one folder per screen
  shared/      # shared components
```

## Development

From `frontend/`:

```powershell
npm ci
npm run start:admin      # http://localhost:4200
npm run build:admin
```

Keep port 4200: the API allows CORS requests from `http://localhost:4200` and the
Playwright `admin` project in [`e2e`](../../../e2e) expects it. The
API must be running on `http://localhost:5000`. Sign in with the development seed
accounts listed in the [backend guide](../../../backend/README.md#seed-data).

## Design reference

Static HTML captures of every admin screen and state are in
[`docs/mocks/pages`](../../../docs/mocks/pages/) (`admin-*`) and the
[`dialogs`](../../../docs/mocks/dialogs/) and
[`notifications`](../../../docs/mocks/notifications/) folders. Keep the
implementation's visual classes and accessible state semantics aligned with the
mocks, and change the mock first when the design changes intentionally.
