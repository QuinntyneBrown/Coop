# 0012. Members use the admin site, and its areas are restricted by role

- Status: Accepted
- Date: 2026-10-21

## Context

ADR 0011 removed the public site's login screen: every sign-in link opens the
admin site's login. The admin sign-in did not reach the public member pages,
so members could sign in but could not use them. Keeping two signed-in apps
would mean sharing the token across sites and keeping two copies of the same
screens (maintenance, messages, profile) in step.

The admin site already has every member capability except a working photo
picker, the profile picture and the notice choice. It was built for the
office: every signed-in person saw thirteen sections, and the API checked
privileges on only six requests, so a member could read the user list, the
invitations and every household's requests through the API.

The token carries `Role` and `Privilege` claims. The seeded Member role holds
Read on every aggregate, so privileges alone cannot tell a member from the
office for reads. The admin client cannot decode the Playwright mock API's
tokens, which are not JWTs.

## Decision

- **One signed-in app.** The public site is read-only and anonymous (home,
  website pages, documents). Members sign in, register, recover a password
  and do everything else on the admin site. Old public member addresses,
  `/register` and `/forgot-password` open the admin login through the
  existing `adminLoginGuard`, so links already published, such as the
  footer's "Report a repair", still lead somewhere useful.
- **Areas by role.** The office is anyone holding Staff, BoardMember,
  SystemAdministrator or Support (`Constants.Roles.Office`); everyone else
  signed in is a member. Holding Member and an office role counts as office.
  No role or privilege is added or reassigned.
- **The server decides.** Request types of office areas carry `[OfficeOnly]`,
  and `OfficeOnlyBehavior` in `Coop.Application/Behaviors` refuses them with
  403 for a member, once, in the MediatR pipeline; controllers are unchanged.
  Handlers scope members' own data (requests, comments, conversations,
  messages, profiles, draft documents) using the existing rule "owner, or
  Write on the aggregate".
- **The admin asks the server for the roles** (`GET /api/user/current`)
  rather than decoding the token, and caches the answer per sign-in. If the
  answer fails, it shows the member areas.
- **A typed office address opens the dashboard.** `officeGuard` redirects a
  member to `/dashboard`. No "not available" screen is added.
- **Registration leaves the controller.** Anonymous registration goes through
  a `RegisterMemberRequest` handler instead of the office-only
  `CreateUserRequest`.
- **The public BFF keeps what has a client.** `PublicBffController` keeps its
  anonymous endpoints and the authenticated ones the admin app calls (`GET`
  and `PUT api/user/profile`, `POST api/conversations` and
  `api/conversations/{id}/messages`); the authenticated endpoints only the
  public member pages called are removed.

## Consequences

- A member who bypasses the app gets 403 from every office request and sees
  only their own data; the office's access is unchanged.
- A member who has a bookmark to a public member page lands on the admin
  login, then on the admin dashboard.
- Members and the office share screens; each screen hides what a member may
  not use. A future office-only control must be hidden from members and its
  request marked `[OfficeOnly]`.
- Two notions of "office" exist: roles for areas, Write privileges for
  records. With the seeded roles they agree; a custom role that grants Write
  without an office role would see records in a shared list but not the
  office screens.
- The admin's controls stay at 44 px; 48 px targets for members would resize
  the office's screens and are deferred.
- ADR 0011's constant still holds the admin login address for the public app.
