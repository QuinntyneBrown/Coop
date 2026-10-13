# 0002. Idempotent website page creation

- Status: Accepted
- Date: 2026-10-13

## Context

Office administrators add website pages from the admin app (L2-REQ-080). A
save can be retried: the browser resends after a dropped connection, or the
administrator presses "Save page" twice before the first answer arrives.
`AGENTS.md` asks that mutations which may be retried are idempotent and that
the decision is recorded in an ADR.

A page is addressed on the public site by a slug derived from its title
(`/pages/{slug}`). Two pages with the same slug cannot both be reachable, so
the slug is the natural identity of a page from the office's point of view.

## Decision

- `POST /api/pages` is idempotent on the slug. When a page that has not been
  removed already has the slug derived from the submitted title, the handler
  returns that existing page with status 200 and changes nothing. No second
  page is created and no error is raised.
- The slug is derived server-side from the title by `Page.SlugFrom`: lower
  case, letters and digits kept, accents removed, every other run of
  characters collapsed to one hyphen, leading and trailing hyphens trimmed,
  at most 80 characters. The client never supplies a slug.
- `PUT /api/pages` is a plain update keyed by `PageId`; it rejects a title
  whose slug belongs to another page that has not been removed (status 400),
  because silently returning another page would lose the administrator's
  edit.
- Removing a page sets `IsDeleted`; its slug becomes available again, so a
  removed page can be added again under the same title.
- The admin app checks the loaded list before posting and tells the
  administrator when a page with the same title already exists
  (L2-REQ-080 AC6). The server rule above remains authoritative; the client
  check only improves the experience.

## Consequences

- A retried create returns the same page and the list shows one entry.
- An administrator who intends a second page with an identical title cannot
  create one; they choose a different title. This is acceptable because two
  pages with one address would not both be reachable.
- The Playwright mock API in `e2e/fixtures/mock-api/` mirrors the rule so the
  admin suite behaves like the API.
