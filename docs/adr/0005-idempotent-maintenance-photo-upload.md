# 0005. Idempotent maintenance photo upload

- Status: Accepted
- Date: 2026-10-13

## Context

Members attach photos to their maintenance requests (L2-REQ-089), often from
a phone on a slow connection. An upload can be sent twice: the browser
resends after a dropped connection, or the member chooses the same picture
again because the first attempt looked stuck. `AGENTS.md` asks that mutations
which may be retried are idempotent and that the decision is recorded in an
ADR. A photo has no natural key the client could send, and a request may
rightly hold several different photos.

## Decision

- `POST /api/maintenance-requests/{id}/photos` treats a photo with the same
  file name, content type and bytes as one already attached to the same
  request (and not removed) as a retry. It returns that photo with status 200
  and stores nothing new.
- Any other photo is stored as a new `DigitalAsset` and linked to the request
  with a `MaintenanceRequestDigitalAsset`, in one `SaveChanges`.
- The comparison is made only against the photos of that one request, so a
  household can attach the same picture to two different requests.

## Consequences

- A retried upload leaves one photo on the request.
- A member who really wants the same picture twice on one request cannot add
  it; that is acceptable because the copy would show nothing new.
- The comparison loads the bytes of the request's photos with the same name
  and type, which is a handful of small files per request.
- The Playwright mock API in `e2e/fixtures/mock-api/` treats a photo with the
  same name and size as the same photo, which is enough for the suites.
