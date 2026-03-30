# Coop Repository Hierarchy

This document describes the current repository structure for Coop.

The repository now focuses on **requirements, architecture, and detailed design artifacts** for a **modular monolith** that serves **two applications**:

- a CMS-driven public-facing web app
- an admin backend

The documented implementation baseline assumes:

- a shared ASP.NET Core backend on **.NET 10 LTS**
- **Angular 21** for both client applications

Implementation directories such as `src/` and `tests/` have been intentionally removed from this repository.

---

## Current Directory Tree

```text
Coop/
├── Coop.sln
├── README.md
├── .github/
│   └── workflows/
├── docs/
│   ├── detailed-designs/
│   │   ├── 01-user-account-management/
│   │   ├── 02-authentication-and-authorization/
│   │   ├── 03-role-and-privilege-management/
│   │   ├── 04-profile-management/
│   │   ├── 05-maintenance-request-workflow/
│   │   ├── 06-document-management/
│   │   ├── 07-messaging-system/
│   │   ├── 08-digital-asset-management/
│   │   ├── 09-invitation-and-onboarding/
│   │   ├── 10-theme-and-content-customization/
│   │   ├── 11-event-sourcing-and-audit-trail/
│   │   ├── 12-modular-monolith-architecture/
│   │   └── 13-api-layer/
│   ├── specs/
│   │   ├── L1.md
│   │   └── L2.md
│   ├── hosting-costs.md
│   ├── solution-hierarchy.md
│   └── ui-design.pen
└── .gitignore
```

---

## Document Roles

- `docs/specs/L1.md`: high-level product and architectural requirements
- `docs/specs/L2.md`: detailed requirements with acceptance criteria
- `docs/detailed-designs/`: feature-level and architecture-level detailed designs with PlantUML sources
- `docs/ui-design.pen`: design workspace artifact

---

## Notes

- `Coop.sln` is retained as a repository artifact, but this repository should be treated primarily as a design and requirements pack.
- The architecture documented here assumes a single modular-monolith backend shared by the public web app and admin backend.
- Unless a design note says otherwise, framework references in this repository should be read as **.NET 10 LTS** on the backend and **Angular 21** on the client side.
