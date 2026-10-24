# 0018. A draft and a published copy of the site content, with idempotent publish

- Status: Accepted
- Date: 2026-10-24

## Context

Every save on the admin Website screen replaced the `SiteContent` JSON
content entry at once (L2-REQ-099), so the office could not try a change,
look at it and then put it in front of visitors. Documents already have a
Draft and a Published state (L2-REQ-032); the site content had none. The
proposal `docs/proposals/content-management-reimagined.md` asks for one
working copy and one published copy, a Publish that is safe to repeat, and a
Discard (L2-REQ-121). `AGENTS.md` asks that mutations which may be retried
are idempotent and that the decision is recorded in an ADR, as ADR 0002 and
ADR 0007 do.

The content is one JSON blob, so a draft needs no per-field tracking.
Version history and scheduled publishing are out of scope (proposal,
section 5).

## Decision

- A second JSON content entry, `SiteContentDraft`, sits beside
  `SiteContent` in the `JsonContents` table. `SiteContentRules.Name` and
  `SiteContentRules.DraftName` name them.
- `PUT api/site-content` (`SaveSiteContentRequest`) writes the draft entry
  only, creating it when it is missing. `GET api/site-content` keeps
  serving the published entry to anyone. `GET api/site-content?draft=true`
  (`GetSiteContentDraftRequest`, office only) returns the draft when one
  exists, else the published copy, and says which with `hasDraft`.
- `POST api/site-content/publish` (`PublishSiteContentRequest`) copies the
  draft's JSON into the published entry and removes the draft row, in one
  `SaveChanges`. When no draft exists it answers 200 with the published
  content unchanged. Publishing twice, or after a dropped connection,
  therefore changes nothing the second time.
- `DELETE api/site-content/draft` (`DiscardSiteContentDraftRequest`)
  removes the draft row; with no draft it answers 200 unchanged.
- The draft row is removed, not soft-deleted, so "a draft exists" is one
  query and an old draft never comes back.
- Pages and the board list keep saving at once (L2-REQ-123, L2-REQ-085):
  they are separate records, a new page is hidden by its own `Published`
  flag, and a director change is meant to be live the same afternoon.
- The seed publishes the baseline content and never writes a draft
  (L2-REQ-121 AC11). `Coop.Cli` gains `site-content publish` and
  `site-content discard`, and `export` and `import` gain `--draft`
  (L2-REQ-127).

## Consequences

- Visitors see the published copy until the office publishes; the admin
  always edits the draft when one exists and the publish bar says so.
- A retried publish or discard is harmless. A publish that fails part way
  cannot happen: the copy and the removal are one transaction.
- There is one draft for the whole site, shared by everyone in the office.
  Two people editing at once overwrite each other's draft saves, as they
  overwrote each other's published saves before; a per-person draft is not
  in scope.
- Only the site content has a draft. A page or a director change is live at
  once, and the publish bar's sentence is about the site content alone.
- The Playwright mock API in `e2e/fixtures/mock-api/` keeps the same two
  entries and the same rules.
