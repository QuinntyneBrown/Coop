# 0012. The command-line tool calls the application handlers in process

- Status: Accepted
- Date: 2026-10-21

## Context

A power user on the machine that holds the database needs to reset it to a
demo state or a new instance and to administer users, roles, invitations and
the public site content from a terminal (L1-REQ-021). The business rules for
these changes already live in MediatR handlers, FluentValidation validators
and pipeline behaviors in `Coop.Application` and `Coop.Domain`. The tool could
reach them in two ways: as an HTTP client of the running API, or by building
the same services in its own process and sending the requests directly.

Resetting the database cannot go through the API: there is no endpoint for
it, and adding one would let a web caller delete every record. The operator
also needs the tool when the API is not running, for example to create the
first administrator of a new instance.

## Decision

- `backend/src/Coop.Cli` is a .NET console project that references
  `Coop.Infrastructure`, `Coop.Application`, `Coop.Domain` and
  `Coop.SharedKernel`, and not `Coop.Api`.
- The services the API and the tool share (the `CoopDbContext` on SQLite,
  MediatR with `ValidationBehavior` and `ResourceOperationAuthorizationBehavior`,
  the validators, password hashing, the notice sender and the authorization
  handler) are registered by one method, `AddCoopCore`, in
  `Coop.Infrastructure/Dependencies.cs`. The API's `AddCoopServices` calls it
  and adds the web pieces (JWT bearer, CORS, Swagger, controllers); the tool
  calls it and adds the operator identity (ADR 0014). No web host starts.
- Commands translate arguments into existing MediatR requests and print the
  responses, the way controllers translate HTTP. They do not write to
  `CoopDbContext`, except the reset and seed steps of `db reset`.
- The seed moves from `Coop.Api` to `Coop.Infrastructure/Persistence/Seeding/`
  (`SeedData`, `SiteContentSeed`) so both can use it. The API's startup seed
  keeps the same behaviour. The demo seed lives in `Coop.Cli/Seeding/`,
  because only the tool uses it and it carries the embedded photos.
- The reset deletes the database and creates the schema with
  `EnsureDeleted` and `EnsureCreated`, the way the API creates it today. No EF
  migrations are added.

## Consequences

- Every rule the API enforces on a request applies to the same request from
  the tool, with no second copy of the rules.
- The tool needs direct access to the database file or server. It is for an
  operator on the machine that holds the database, not for remote use;
  running it against a remote API is deferred.
- `Coop.Cli` references the ASP.NET Core shared framework, because the
  application layer's contracts use `IFormFile`, `IHttpContextAccessor` and
  the ASP.NET Core authorization service.
- `Coop.Cli.Tests` runs commands in process against the same in-memory
  database as an API host built with `WebApplicationFactory<Program>`, then
  checks the result through HTTP (ADR 0003). Each test class owns its
  database, and the tool writes to the text writers it is given rather than
  the console, so the test projects share no state and can run in parallel.
