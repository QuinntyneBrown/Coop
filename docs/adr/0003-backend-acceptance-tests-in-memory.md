# 0003. Backend acceptance tests through the API with an in-memory database

- Status: Accepted
- Date: 2026-10-13

## Context

`AGENTS.md` requires backend behavior to be tested through the API at the
integration boundary, without a real database. Until this decision the
repository had no backend test project. The first feature to need one is
website page management (L2-REQ-080, L2-REQ-081), whose acceptance criteria
include authorization refusals that only the full HTTP pipeline (JWT bearer
authentication, the MediatR authorization behavior and the exception
middleware) can demonstrate.

## Decision

- Backend acceptance tests live in `backend/tests/Coop.Api.Tests`, an xUnit
  project referenced by `backend/Coop.sln`. One test project per layer is
  added only when that layer needs coverage; `Coop.Api.Tests` is the first.
- Tests host the real API with `WebApplicationFactory<Program>`.
  `CoopApiFactory` replaces the SQLite `DbContextOptions<CoopDbContext>` with
  the EF Core in-memory provider, one database name per factory instance, so
  no file, server or migration is involved. `Program.cs` declares
  `public partial class Program` so the factory can reference the entry point.
- The API's own startup seed runs against the in-memory database, so tests
  sign in with the seeded `admin` and `member` accounts through
  `POST /api/user/token` and exercise endpoints with real bearer tokens.
- Each test class owns a factory and therefore a database. Tests within a
  class share that database and use distinct data where they could collide.
  xUnit runs test classes in parallel; the static Serilog logger is shared but
  only receives console output, so no sequential collection is required.
- Tests assert HTTP status codes and response bodies only; they do not reach
  into the database.

## Consequences

- `dotnet test backend/Coop.sln` runs the suite with no setup.
- The in-memory provider does not enforce relational constraints; rules that
  depend on the database (unique indexes, cascades) are asserted through
  handler behavior, not provider behavior.
- When a later test project needs shared state that forces sequential runs,
  that reason is recorded in a new ADR per `AGENTS.md`.
