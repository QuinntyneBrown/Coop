# Coop Public

Angular public website for Coop. It serves the CMS-driven public site (landing
page, website pages, published documents, board members). It is read-only and
anonymous: members sign in, register and do everything that needs signing in
on the [admin site](../admin/README.md) (L2-REQ-110, ADR 0016).

It is the `public` project of the [frontend workspace](../../README.md) and
talks to the Coop API at `http://localhost:5000/api`.

## Routes

| Route                                                                                        | Screen                                 | Access |
| -------------------------------------------------------------------------------------------- | -------------------------------------- | ------ |
| `/`                                                                                          | Landing page                           | Public |
| `/pages/:slug`                                                                               | A website page the office added        | Public |
| `/documents`                                                                                 | Published notices, bylaws, and reports | Public |
| `/login`, `/register`, `/forgot-password`                                                    | Open the admin login                   | Public |
| `/dashboard`, `/maintenance`, `/messaging`, `/profile`, `/onboarding` (old member addresses) | Open the admin login                   | Public |

Unknown routes redirect to the landing page.

## Layout

```
src/app/
  core/        # the admin login guard and address, site content, and services (API, documents, pages, theme)
  layout/      # the documents page's logo bar, and the site header and footer shared by the public pages
  pages/       # one folder per screen
public/own/    # photographs for the home page (see pages/landing/landing-content.ts)
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
