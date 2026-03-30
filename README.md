# Coop

Coop is a documentation-first repository for a cooperative residential management platform.

The current target architecture is a **modular monolith** that serves **two application surfaces**:

- a **CMS-driven public-facing web app** for the Coop
- an **admin backend** for staff, board members, and system administrators

## Scope

The platform requirements and designs cover:

- user accounts, authentication, and authorization
- profile and invitation management
- maintenance workflows
- document publishing
- messaging
- digital assets
- theme and CMS content management
- audit history and event sourcing

## Repository Layout

- `docs/specs` - high-level and detailed requirements
- `docs/detailed-designs` - feature-level and architecture design documents
- `docs` - supporting architecture and planning documents

The previous implementation directories (`src/` and `tests/`) have been removed from this repository so it can act as the canonical product and technical design pack.

## Architecture Summary

The documented solution uses:

- one deployable backend organized into explicit business modules
- one shared database with module-owned tables or schemas
- one shared REST API surface
- two front-end applications: the public web app and the admin backend

## Documentation

- [L1 high-level requirements](docs/specs/L1.md)
- [L2 detailed requirements and acceptance criteria](docs/specs/L2.md)

## Contributing

Keep contributions scoped to the design and requirements artifacts in `docs/`, and update the relevant requirements or detailed designs whenever architecture or product behavior changes.
