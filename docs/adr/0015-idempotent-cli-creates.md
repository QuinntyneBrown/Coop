# 0015. Creating a role, privilege or invitation returns the existing one

- Status: Accepted
- Date: 2026-10-21

## Context

`AGENTS.md` asks that mutations which may be retried are idempotent and that
the decision is recorded in an ADR. Operators re-run commands from their shell
history and from scripts, so `role create`, `role grant` and
`invitation create` are often sent twice (L2-REQ-106, L2-REQ-107). Before this
decision each created a second record: two roles with the same name, two
identical privileges on a role, or two invitation tokens with the same value,
which makes the token ambiguous when it is redeemed.

Creating a user cannot work this way: a second `user create` with a taken
username but a different password is an error, not a retry, and
L2-REQ-001 AC4 already requires the username to be rejected.

## Decision

- `CreateRoleHandler` returns the role that already has the requested name.
- `CreatePrivilegeHandler` returns the privilege the role already holds with
  the same aggregate and access right.
- `CreateInvitationTokenHandler` returns the token that already has the
  requested value, unchanged, even when the type or expiry date differ.
- These are handler rules, so `POST /api/role`, `POST /api/privilege` and
  `POST /api/invitationtoken` behave the same way as the tool.
- `CreateUserValidator` and a new `UpdateUserValidator` reject a username
  another user holds (L2-REQ-001 AC4).

## Consequences

- Re-running a create command, from the tool or the API, leaves one record.
- Changing an existing invitation's type or expiry date needs it removed and
  created again; a role's privileges on one aggregate at several access
  rights stay separate records, and the highest one decides access.
