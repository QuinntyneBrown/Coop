# 0006. Idempotent profile picture changes

- Status: Accepted
- Date: 2026-10-13

## Context

Members set, replace and remove the picture on their own profile
(L2-REQ-091), often from a phone on a slow connection. Either change can be
sent twice: the browser resends after a dropped connection, or the member
presses "Save photo" or "Remove photo" again because the first attempt looked
stuck. `AGENTS.md` asks that mutations which may be retried are idempotent
and that the decision is recorded in an ADR. A profile holds one picture at a
time.

## Decision

- `POST /api/profiles/{profileId}/avatar` treats a picture with the same file
  name, content type and bytes as the profile's current picture as a retry.
  It returns the profile unchanged with status 200 and stores nothing new.
- Any other picture is stored as a new `DigitalAsset` and set as the
  profile's avatar; the previous picture's asset, if any, is deleted in the
  same `SaveChanges`, so a profile never leaves an orphaned picture behind.
- `DELETE /api/profiles/{profileId}/avatar` clears the avatar and deletes its
  asset. For a profile without a picture it returns the profile unchanged
  with status 200.

## Consequences

- A retried save leaves one picture on the profile, and a retried removal
  succeeds.
- Choosing the same picture again after replacing it with another stores it
  again; that is a real change, not a retry.
- The comparison loads the bytes of one picture, the current one.
- The Playwright mock API in `e2e/fixtures/mock-api/` treats a picture with
  the same name and size as the same picture, which is enough for the suites.
