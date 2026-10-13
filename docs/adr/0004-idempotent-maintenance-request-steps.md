# 0004. Idempotent maintenance request steps

- Status: Accepted
- Date: 2026-10-13

## Context

The office moves a maintenance request through New, Received, Started and
Completed (L1-REQ-005) with the "Start work" and "Finish work" buttons of the
admin app (L2-REQ-085). Either step can be sent twice: the browser resends
after a dropped connection, or two people in the office press the same button
on the same request. `AGENTS.md` asks that mutations which may be retried are
idempotent and that the decision is recorded in an ADR.

Each step is also recorded in the audit history as a stored event
(L2-REQ-023 AC5, L2-REQ-024 AC4), so a duplicate would leave a second
"started" or "completed" entry and move the recorded start or finish time.

## Decision

- `PUT /api/maintenancerequest/start` starts a "Received" request. For a
  request that is already "Started" or "Completed" it returns the request
  unchanged with status 200, records no event and keeps the first start time.
- `PUT /api/maintenancerequest/complete` completes a "Started" request. For a
  request that is already "Completed" it returns the request unchanged with
  status 200, records no event and keeps the first completion time.
- A step that skips the one before it (Start on a "New" request, Complete on a
  "New" or "Received" request) is a client error: the validator rejects it
  with status 400 and a plain message, and nothing changes.
- `MaintenanceRequest.Start` and `MaintenanceRequest.Complete` hold the
  transition rule and return the stored event; the handlers add the event and
  save in one `SaveChanges`, so the state and its audit entry are written
  together.

## Consequences

- A retried step returns the same request and the audit history shows one
  entry per step.
- A retried Start after the request was finished returns the finished request
  rather than an error, because the start the caller asked for has happened.
- Receive is unchanged by this decision.
- The Playwright mock API in `e2e/fixtures/mock-api/` mirrors the rule so the
  suites behave like the API.
