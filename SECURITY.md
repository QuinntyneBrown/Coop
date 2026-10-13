# Security Policy

## Supported Versions

Security fixes are applied to the default branch. If release branches or tagged
versions are introduced later, this file should be updated with the supported
version matrix.

| Version | Supported |
| --- | --- |
| `master` | Yes |

## Reporting a Vulnerability

Do not report suspected security vulnerabilities in public issues.

Report vulnerabilities privately to the project maintainers. Include as much
detail as possible:

- affected component, route, command, package, or commit;
- reproduction steps or proof of concept;
- expected and actual impact;
- affected configuration or environment;
- suggested mitigation, if known.

## Response Expectations

Maintainers should acknowledge valid reports as soon as practical, investigate
the issue, and coordinate a fix before public disclosure when appropriate.

If the report is not accepted as a vulnerability, maintainers should explain
why and, when possible, suggest a more appropriate issue type.

## Security-Sensitive Areas

Changes in these areas should receive extra review:

- authentication, JWT issuing, and token handling;
- password hashing and credential validation;
- role and privilege checks, and resource authorization behaviors;
- endpoints marked anonymous;
- queries that could expose one member's or household's data to another;
- digital asset upload and anonymous asset serving;
- database migrations and seed data;
- `Authentication` settings, environment variables, and connection strings;
- CORS origins;
- frontend session and token storage;
- CI/CD deployment secrets;
- third-party package upgrades with known advisories.
