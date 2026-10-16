# 0009. Co-ops share one database, found by sub-domain

- Status: Proposed
- Date: 2026-10-16

## Context

The platform serves one co-operative today. It needs to serve more than one
from one deployment (L1-REQ-021) without one co-op ever seeing another's
data (L2-REQ-102). Every handler reads `ICoopDbContext` directly, and the
public site is read anonymously, so the API has to know which co-op a request
is for before anyone signs in. No co-op needs its own database, its own
region, or an account in more than one co-op.

## Decision

- **One database, a `TenantId` on every co-op-owned row.** A new `Tenant`
  entity (`TenantId`, `Slug`, `Name`) is the only table without one. Roles
  and privileges belong to a co-op too, so one co-op's role changes never
  reach another.
- **The sub-domain names the co-op.** `TenantResolutionMiddleware` reads the
  first label of the request host under `Tenancy:BaseDomain` and looks up
  the `Tenant` by slug. An unknown co-op answers 404. A host outside the
  base domain uses `Tenancy:DefaultTenant` when it is set, so `localhost`,
  the acceptance tests and the Playwright suite keep working unchanged. The
  apps send no co-op name of their own; they call the API on their own host.
- **EF Core global query filters enforce the limit.** `CoopDbContext` adds
  `e => e.TenantId == _tenant.TenantId` to every co-op-owned entity, and
  `SaveChangesAsync` sets `TenantId` on every added entity from
  `ITenantContext`, overwriting anything the request sent. Handlers and
  controllers do not filter by co-op themselves. A record from another co-op
  looks missing, so the API answers as it does for a missing record, never
  403.
- **The token names its co-op.** Sign-in adds a `tenant_id` claim. After
  authentication, the middleware refuses with 401 any token whose
  `tenant_id` differs from the request's co-op, or has none.
- **Uniqueness is per co-op.** Username and page slug indexes become
  `(TenantId, Username)` and `(TenantId, Slug)`. Every `TenantId` index
  starts with `TenantId`.

## Consequences

- One schema, one deployment and one seed path serve every co-op. Adding a
  co-op is a row, not a database.
- Isolation rests on the query filter. Code that calls
  `IgnoreQueryFilters()` or raw SQL bypasses it, so neither is used in
  handlers; acceptance tests for each module check a second co-op's records
  stay out of reach.
- A bug in a filter can expose data across co-ops; a database per co-op
  would contain it. That stronger isolation was weighed and not chosen for
  the extra migrations, connection handling and seeding it needs.
- Tokens issued before the change carry no co-op and stop working; people
  sign in once more.
- The schema is still created with `EnsureCreated`, with no EF migrations.
  An existing development database is recreated, not upgraded. Moving to
  migrations is a separate decision.
- Creating, renaming or closing a co-op has no screen or endpoint; the seed
  creates the first one. A way to add more is out of this decision.
- DNS and TLS need a wildcard for `*.{BaseDomain}`; that is deployment
  configuration, not code.
