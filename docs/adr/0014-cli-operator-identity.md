# 0014. The command-line tool runs as an operator identity with full access

- Status: Accepted
- Date: 2026-10-21

## Context

`ResourceOperationAuthorizationBehavior` checks requests marked with
`AuthorizeResourceOperation` (pages, the board list, the site content and
sending a notice) against the privilege claims of the scoped
`ClaimsPrincipal`. In the API that principal comes from the JWT of the
signed-in user. The command-line tool (ADR 0012) has no HTTP request and no
token.

The tool is for a trusted operator who already has the database: anyone who
can run it can read and change the database file directly. Asking that person
to sign in would add a password prompt without protecting anything.

## Decision

- The tool registers one scoped `ClaimsPrincipal`, the operator identity,
  built by `OperatorIdentity.Create()` in `Coop.Cli`: the name `coop-cli`,
  the `SystemAdministrator` role claim and a `Privilege` claim
  `Delete:{aggregate}` for every aggregate in `Constants.Aggregates.All`.
  `Delete` is the highest access right, so the operator passes every
  resource-operation check, the same as the seeded SystemAdministrator.
- The authorization behavior is not bypassed or removed: requests still go
  through it, and a request whose aggregate is missing from
  `Constants.Aggregates.All` would still be refused.
- The tool never issues a token, never signs in through the API and never
  prints password hashes, salts or the passwords it is given.

## Consequences

- The tool can do everything a system administrator can do in the admin app,
  and nothing a handler refuses.
- An aggregate added to `Constants.Aggregates` is covered by the operator
  identity with no further change.
- Changes made by the tool are not attributed to a user; handlers that need a
  current user or profile (for example maintenance steps) are not exposed as
  commands.
