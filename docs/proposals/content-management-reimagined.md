# Content management, re-imagined

**Status:** proposal. This document is not a requirement. Nothing here is
implemented, and nothing here may be built until the L1/L2 requirements,
detailed designs and mocks it names have been written (see "Phase 0").

**Question it answers:** if the admin screens that manage the public website,
and the way that content surfaces on the public site, could be redesigned
cleanly, what would that look like, and how many days would the refactor
take?

---

## 1. How it works today

### Admin

The office edits the public website from six screens that do not know about
each other. The sidebar (`frontend/projects/admin/src/app/layout/office-links.ts`)
is a flat list of thirteen links. The `access` / `cms` / `community` /
`operations` grouping exists only as folder names under `features/`; users
never see it. Routes carry no titles.

| Screen | What it edits | How it edits | When it goes live |
|---|---|---|---|
| Website (`features/cms/website`) | Header, footer and nine home-page blocks | One generic modal built from `content-blocks.ts` field metadata; photo picker stacks on top | Immediately on save (whole document `PUT /site-content`) |
| Pages (`features/cms/pages`) | Title, hero image, HTML body | Modal with a raw `textarea` ("use simple HTML: h2, p, ul, li...") | Immediately |
| Board (`features/community/board`) | Ordered list of directors | Modal; photo is a typed address, not the picker | Immediately (whole list `PUT`) |
| Assets (`features/operations/assets`) | Uploaded photos and files | Upload, detail and delete dialogs | Immediately |
| Documents (`features/community/documents`) | Notices, by-laws, reports | Create dialog with Draft / Published choice | Draft until published; the only draft flow |
| Settings (theme) | Public site colours | Form | Immediately, no contrast check (drift item D27) |

Where content appears on the public site is explained only in words: the
group headings "On every page" and "Home page", block names that echo the
public section titles, an ordering comment in `content-blocks.ts`, and the
page address `/pages/{slug}` shown as plain text rather than a link. There is
no preview. The only visual link to the public site is a hard-coded
`PUBLIC_SITE_URL` used to load photo thumbnails.

Two home blocks, "What's on" and "Board", are headings only. The notices
themselves live under Documents and the directors under Board, and neither
block points the editor there.

### Backend

- `SiteContent` and `BoardOfDirectors` are JSON blobs in the generic
  `JsonContent` table (`backend/src/Coop.Domain/CMS/JsonContent.cs`). Saving
  overwrites the blob. There is no draft and no history.
- `Page` is its own table with no publish flag: every undeleted page is live.
- `Document.Published` is the only publish concept in the system.
- A second board exists as `BoardMember : ProfileBase` profiles, unrelated to
  the CMS board list.

### Public site

- `SiteContentService` merges the published blob over `SITE_DEFAULTS`
  (`frontend/projects/public/src/app/core/site-content/site-defaults.ts`).
- The landing page's section order is fixed in `landing.component.html`.
  Content cannot reorder or hide a section.
- Four calls go to routes that do not exist and only work through fallbacks:
  `GET json-content/{name}`, `GET json-content`, `GET board-members`,
  `GET documents`. The last one is swallowed as an empty list, so the public
  Documents page shows nothing to a visitor.
- The landing page never calls the dedicated `api/board-of-directors`
  endpoint; it reads the blob through `jsoncontent/name/BoardOfDirectors`.

### What hurts

| Pain | Who feels it |
|---|---|
| "Which screen do I open to change the home page?" Six screens, flat sidebar, no page-shaped view | Office staff |
| No way to try a change safely: every save is live on the public site | Office staff, board |
| Placement is implicit; editors guess from block names where text will land | Office staff |
| Raw HTML authoring for pages is unsuitable for the office and for the audience it serves | Office staff |
| Two sources of truth for the board; dead public routes; empty public Documents page | Visitors, developers |
| Section order lives in code; adding or reordering a section is a release | Developers |

---

## 2. The target experience

**Principle: the admin mirrors the shape of the public site.** You edit a
*page*, not a list of blocks. Everything a visitor can see lives under one
"Website" area, laid out the way the visitor sees it.

### 2.1 One Website area

The sidebar gains a single **Website** entry in place of Website, Pages,
Board and Assets. Inside it, a site tree acts as sub-navigation:

```
Website
├── Home
├── Pages
│   ├── Our history
│   ├── The garden
│   └── + Add a page
├── Menu and footer
├── Board of directors
├── Photos
└── Look (colours)
```

Documents and notices stay under **Community** because members use them too,
but the home page's "What's on" section links straight to them (2.3).

The sidebar's other groups follow the existing feature folders so the grouping
users see matches the code: Community (Documents, Messages, Profiles),
Operations (Maintenance), Access (Users, Roles and privileges, Invitations),
plus Dashboard and Settings. Every route gets a title from a single path and
title registry, which the admin does not have today.

### 2.2 The page editor is a screen, not a dialog

Choosing Home or a Page opens a full editor screen.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Website › Home                          [Preview site] [Publish] [Discard]│
│ Draft: 3 changes not yet published                                       │
├────────────────┬──────────────────────────────┬──────────────────────────┤
│ Sections       │ Welcome banner               │ Preview                  │
│ (page order)   │                              │                          │
│ ● Welcome      │ Small heading  [Home        ]│ ┌──────────────────────┐ │
│   banner       │ Title          [Welcome to…]│ │  live render of the  │ │
│ ○ Numbers at a │ Lead paragraph [...........]│ │  public home page    │ │
│   glance       │ Photo          [Choose photo]│ │  with the draft      │ │
│ ○ Who we are   │ Main button    Label / Link │ │  content, scrolled   │ │
│ ○ Photos       │ Second button  Label / Link │ │  to this section     │ │
│ ○ What we offer│                              │ └──────────────────────┘ │
│ ○ What's on  ↗ │ Appears first on the home    │                          │
│ ○ Board      ↗ │ page, under the menu.        │                          │
│ ○ In their     │                              │                          │
│   words        │                              │                          │
│ ○ Visit us     │                              │                          │
│                │                              │                          │
│ [Show/Hide] [↑][↓]                            │                          │
└────────────────┴──────────────────────────────┴──────────────────────────┘
```

- **Left: sections in public order.** The list is the page. Move up and down
  reorders the public page; Hide removes a section from the public page
  without deleting its text.
- **Centre: the section form.** Built from the same field kinds the current
  editor uses (`text`, `textarea`, `lines`, `address`, `choice`, `photo`,
  `group`, `list`), so `ContentField`, `readPath` / `writePath`,
  `validate-block` and the photo picker are kept. Under the form, a plain
  sentence says where the section appears ("Appears first on the home page,
  under the menu").
- **Right: live preview.** The public app rendered in an iframe in preview
  mode, showing the draft, scrolled to the section being edited. At 400% zoom
  the three panes become three tabs: Sections, Edit, Preview.

Labels use plain words. No "CMS", "slug", "hero", "block" or "asset" in the
UI: "page address", "welcome banner", "section", "photo".

### 2.3 Sections that come from somewhere else

"What's on" and "Board of directors" stop being heading-only forms. Each shows
its heading fields plus a read-only summary of what will appear ("3 published
notices", "7 directors") and one link: **Manage notices** or **Manage
directors**. The editor can always see what the visitor will see and where to
change it.

### 2.4 Draft, preview, publish

The site has one working copy and one published copy.

- Every save on the Website area writes the **draft**. Nothing changes for
  visitors.
- **Preview site** opens the public site in preview mode, rendering the
  draft, in a new tab. The preview pane in the editor uses the same mode.
- **Publish** copies the draft to the published copy. Publishing twice is
  harmless (idempotent, recorded in an ADR like ADR 0002 and 0007).
- **Discard changes** throws the draft away.
- A banner at the top of the Website area always says whether there are
  unpublished changes.

Documents keep their existing Draft / Published flow; this proposal does not
touch it.

### 2.5 Pages without HTML

A page is edited with the same editor as Home. Its sections are a fixed
"Page banner" (title, photo) plus a body made of simple blocks the office can
compose: **Heading**, **Paragraph**, **Bullet list**, **Photo**, **Link
button**. The page address is shown as a clickable link to the public page.
Pages gain a Published flag so a new page can be written before it appears
in the menu.

Existing pages migrate by wrapping their current HTML body in a single
"Existing content" block that renders as today and can be replaced over time.

### 2.6 One board

The public site reads the board from `api/board-of-directors` only. The
profile-based fallback and the raw `jsoncontent` lookup go. The admin Board
screen moves under Website as "Board of directors" and gains the photo picker
instead of a typed address.

### 2.7 How content surfaces on the public site

The public home page stops hard-coding its section order. The content holds
an ordered list of sections, each with a kind:

```json
"home": {
  "sections": [
    { "kind": "hero",     "eyebrow": "...", "title": "...", "photo": {} },
    { "kind": "glance",   "figures": [] },
    { "kind": "about",    "values": [] },
    { "kind": "gallery",  "hidden": true, "photos": [] },
    { "kind": "notices",  "eyebrow": "...", "title": "What's on" },
    { "kind": "board",    "title": "Board of directors" },
    { "kind": "quote",    "text": "...", "attribution": "..." },
    { "kind": "visit",    "phone": "...", "hours": [] }
  ]
}
```

The landing component iterates the list and renders each section by kind
with the existing section templates. Reordering or hiding from the admin
needs no release. `SITE_DEFAULTS` and `mergeContent` stay as the fallback when
the API is unreachable. Header and footer keep their current shape.

The public Documents page calls the published-documents endpoint so visitors
see by-laws and reports, and the four dead routes are removed.

---

## 3. Architecture changes

### Backend (`backend/src`)

- Add a `SiteContentDraft` blob beside `SiteContent` in `JsonContent`.
- `GET api/site-content` keeps serving the published copy anonymously.
  `GET api/site-content?draft=true` needs the office role and returns the
  draft, or the published copy when no draft exists.
- `PUT api/site-content` writes the draft. `POST api/site-content/publish`
  copies draft to published, idempotent. `DELETE api/site-content/draft`
  discards it.
- Public preview mode: `GET api/site-content?preview={token}` where the token
  is short-lived, read-only and issued to office users by
  `POST api/site-content/preview-token`. Recommended over passing the admin's
  JWT to the public app, because the public app stays anonymous (ADR 0016).
- `Page` gains `Published` and `Sections` (JSON). `GET api/pages` serves
  published pages to visitors and all pages to the office.
- Validators extend `SaveSiteContentValidator` to the section list; the
  existing link, image and length rules are reused.
- `Coop.Cli`: `site-content publish` and `site-content discard`; export and
  import gain `--draft`.
- Seed: the published copy is seeded as today; no draft is seeded.
- ADRs: draft and publish for site content; public preview tokens; the
  Website area as the admin's content IA.

### Admin (`frontend/projects/admin`)

- A path and title registry (none exists today) and grouped sidebar links.
- `features/cms/website` becomes `features/website/` with `site-tree`,
  `page-editor`, `section-list`, `section-form`, `preview-pane` and
  `publish-bar`. `features/cms/pages` and `features/community/board` fold into
  the same editor. Reused as-is: `content-field*.ts`, `content-path.ts`,
  `block-draft.ts`, `validate-block.ts`, `safe-address.ts`, `move-item.ts`,
  the photo picker.
- Presentation pieces that are pure design system (section list item, publish
  bar, placement note) go in the `components` library with Storybook stories
  (ADR 0010, 0017).

### Public (`frontend/projects/public`)

- `HomeContent` becomes `{ sections: HomeSection[] }` with a discriminated
  `kind`; `landing.component.html` loops over sections and switches on kind.
- `?preview=` support in `SiteContentService`.
- Remove the `json-content`, `board-members` and `documents` calls; use
  `board-of-directors` and the published-documents endpoint.

### Tests

- Backend: API integration tests against the in-memory database for draft,
  publish, discard, preview token and published-only pages.
- Playwright: page objects for the site tree, page editor and publish bar;
  the in-process mock API in `e2e/fixtures/mock-api/` gains the draft,
  publish and preview endpoints. No backend is started.

---

## 4. Phases and effort

Assumptions: one developer who knows the repository; Angular and .NET as they
are; no new libraries, frameworks or infrastructure; each slice follows the
`implementing-incrementally` skill with Given-When-Then acceptance tests,
400% zoom and WCAG 2.2 AA checks included; no third-party CMS adopted.

| Phase | Scope | Days |
|---|---|---|
| 0 | Alignment documents. L1 REQ-020 and L2 094 to 100 and 080 to 084 updated; detailed designs `manage-site-content`, `manage-pages`, `manage-board`, `show-home-page` revised; mocks for the Website landing, page editor, preview, publish confirmation and notification; three ADRs | 3 |
| 1 | Admin information architecture. Website area with site tree, path and title registry, grouped sidebar, clickable public links. Existing dialogs still do the editing | 3 |
| 2 | Page editor screen. Section list in public order, section form, placement sentences, read-only summaries with links for What's on and Board. Saves still go live (no draft yet) | 4 |
| 3 | Draft, preview, publish. Backend blobs, endpoints, validators, CLI commands and API tests; admin publish bar and states; public preview mode with token | 5 |
| 4 | Pages on the section editor. Banner plus simple blocks, Published flag, migration of HTML bodies to an "Existing content" block, published-only listing for visitors | 4 |
| 5 | Public surfacing. Section-list rendering with order and hide, single board source, dead routes removed, public Documents page works for visitors | 4 |
| 6 | Hardening. Playwright page objects and mock API, Storybook stories for new library components, mocks coverage matrix, refresh of videos 01 and 02 where screens changed | 3 |
| | **Total** | **26** |

Range: 22 to 30 days. The spread is mostly phase 3 (preview token design)
and phase 4 (migrating existing HTML pages).

**Minimum cut.** Phases 0, 1, 2 and 5 deliver the mirrored IA, the page
editor and the fixed public surfacing without drafts or new page blocks, in
about **14 days**. Phases 3 and 4 can follow as separate pieces of work.

**Risks**

- Migrating existing HTML page bodies: the "Existing content" block keeps
  them rendering, but editing them means retyping into blocks.
- Preview token design must stay read-only and short-lived; review against
  ADR 0016 before building.
- Scope creep: the section kinds are the ones that exist today plus the five
  page blocks. New kinds are new requirements.

---

## 5. Out of scope

Not proposed, and not recommended for this co-operative's size: multiple
sites, version history and roll-back, scheduled publishing, a rich-text
(WYSIWYG) editor, roles finer than "office", and adopting an external CMS
product.
