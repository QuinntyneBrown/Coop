# Coop

Coop is an open-source platform for managing residential cooperatives. It brings together identity and access control, profile management, maintenance workflows, document publishing, messaging, digital assets, and audit history in a single codebase.

The repository currently contains both the existing monolithic application and an in-progress service-oriented decomposition of the core domains.

## Highlights

- JWT-based authentication and resource-level authorization
- Multiple profile types for members, board members, staff, and on-call roles
- Maintenance request lifecycle with comments, attachments, and event history
- Document publishing for notices, bylaws, and reports
- Conversation-based messaging and invitation-driven onboarding
- Theme customization and JSON-driven content sections

## Repository Layout

- `src/Coop.Api` - primary ASP.NET Core API used by the web client today
- `src/Coop.App` - Angular web client
- `src/Coop.Application`, `src/Coop.Domain`, `src/Coop.Infrastructure` - monolith application layers
- `src/Services/*` - extracted service APIs and supporting domain/infrastructure projects
- `src/Coop.SharedKernel` - shared integration events, Redis messaging, and serialization abstractions
- `tests/Coop.UnitTests` - unit test suite
- `tests/Coop.IntegrationTests` - integration test suite
- `docs/specs` - product requirements and acceptance criteria

## Architecture

For day-to-day local development, the most complete path is the monolith:

- `Coop.Api` exposes the main REST API and Swagger UI
- `Coop.App` targets `https://localhost:5001/` in development

The repository also includes service-oriented slices for these domains:

- Identity
- Profile
- Maintenance
- Document
- Asset
- Messaging

Those services share integration contracts through `Coop.SharedKernel` and use Redis for inter-service messaging.

> `Coop.sln` is currently being reorganized and still references projects under extraction. For reliable local work, prefer running individual project files directly instead of relying on solution-wide commands.

## Tech Stack

- ASP.NET Core and C#
- Entity Framework Core with SQL Server / LocalDB
- MediatR and FluentValidation
- Redis and MessagePack for inter-service messaging
- Serilog for structured logging
- Angular 12 and Angular Material for the web client

## Getting Started

### Prerequisites

- .NET SDK 9.0 for the main API and tests
- .NET SDK 7.0 if you want to run the extracted services in `src/Services`
- SQL Server LocalDB or SQL Server Express
- Redis on `localhost:6379` for the service-oriented APIs
- Node.js and npm for `src/Coop.App`

### Run the Main API

```bash
dotnet run --project src/Coop.Api/Coop.Api.csproj --launch-profile Development -- migratedb seeddb
```

This migrates and seeds the local database, then starts the API at `https://localhost:5001/`.

Swagger UI is served from the application root:

- `https://localhost:5001/`

### Run the Angular App

```bash
cd src/Coop.App
npm install
npm start
```

The Angular environment is configured to call `https://localhost:5001/` in development.

### Run Tests

```bash
dotnet test tests/Coop.UnitTests/Coop.UnitTests.csproj
dotnet test tests/Coop.IntegrationTests/Coop.IntegrationTests.csproj
```

Integration tests expect a SQL Server / LocalDB environment.

### Run an Extracted Service

Each service API supports the same database lifecycle arguments used by the monolith:

- `dropdb`
- `migratedb`
- `seeddb`
- `stop`

Example:

```bash
dotnet run --project src/Services/Identity/Identity.Api/Identity.Api.csproj -- migratedb seeddb
```

If you are running multiple services locally, make sure the LocalDB connection strings and Redis settings in each service `appsettings.json` match your environment.

## Documentation

- [L1 high-level requirements](docs/specs/L1.md)
- [L2 detailed requirements and acceptance criteria](docs/specs/L2.md)

## Contributing

Contributions are welcome. If you plan to make a substantial change, open an issue first so the scope and design can be discussed before implementation.

When contributing:

- keep changes scoped and reviewable
- add or update tests when behavior changes
- document API or architecture changes in `docs/` when relevant
