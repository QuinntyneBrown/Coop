# 0010. The public app holds the admin login address in one constant

- Status: Accepted
- Date: 2026-10-21

## Context

On 21 October 2026 the public site lost its own login screen: members sign
in on the admin site instead (L2-REQ-101). The public app now needs the
address of the admin login screen in several places: the built-in "Member
sign in" links of the header, phone menu and footer, the "Sign in" links on
the register and forgot-password screens, the `/login` redirect and the auth
guard.

The public app has no environment files or runtime configuration. It holds
its API base URL as a literal in `core/services/api.service.ts`
(`http://localhost:5000/api`), the address of the API in development. In
development the admin app is served at `http://localhost:4200` and the
public app at `http://localhost:4201`.

## Decision

- **One constant.** `ADMIN_LOGIN_URL` in
  `frontend/projects/public/src/app/core/services/admin-login-url.ts`, beside
  `api.service.ts`, holds `http://localhost:4200/login`. Every place listed
  above reads it; no other file spells the address.
- **Same style as the API address.** It is a literal for the development
  address, as the API base URL is. No environment files, injection token or
  runtime configuration are added.
- **Leaving the app.** Links bind the address to `href`, so the browser
  leaves the public app as for any other web address; the site-link
  directive treats it as an external link (L2-REQ-098). The `/login` route
  and the auth guard call `location.assign(ADMIN_LOGIN_URL)` from the
  `adminLoginGuard` and cancel the in-app navigation.

## Consequences

- A deployment where the admin site lives elsewhere needs this one constant
  changed, together with the API base URL. Per-environment configuration is
  deferred until the project needs it.
- Content an administrator has published may still say `/login` for the
  sign-in link (the API seed does). That address still reaches the admin
  login, through the public `/login` redirect.
- The Playwright suite serves the admin app at `http://localhost:4200`, so
  the tests can follow a sign-in link to the real admin login screen without
  a backend.
