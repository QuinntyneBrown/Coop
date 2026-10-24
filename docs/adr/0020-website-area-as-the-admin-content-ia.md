# 0020. The Website area is the admin's information architecture for public content

- Status: Accepted
- Date: 2026-10-24

## Context

The office edited the public website from six screens that did not know
about each other, listed in a flat sidebar of thirteen links: Website
(header, footer and home blocks in a dialog), Pages, Board, Assets,
Documents and Settings (theme). Where a value appeared on the public site
was explained only by block names. The proposal
`docs/proposals/content-management-reimagined.md` asks that the admin
mirror the shape of the public site (L2-REQ-118, L2-REQ-119), and
`AGENTS.md` asks for a path and title registry rather than repeated route
strings.

## Decision

- One **Website** entry in the office's sidebar replaces Website, Pages,
  Board and Assets. The sidebar is grouped to match the feature folders:
  Dashboard, Website, Community (Documents, Messages, Profiles),
  Operations (Maintenance), Access (Users, Roles and privileges,
  Invitations), Settings. Members' sidebar is unchanged (ADR 0016).
- Inside Website a **site tree** is the sub-navigation: Home, Pages (one
  entry per page plus "Add a page"), Menu and footer, Board of directors,
  Photos, Look. It is the content of `/website`, and a column beside the
  Board screen from 64rem. The page editor shows a breadcrumb instead of
  the tree, to keep its width for the three panes.
- Home, Menu and footer and each page open the **page editor screen**
  (`/website/home`, `/website/menu-and-footer`, `/website/pages/{id}`,
  `/website/pages/new`), a full screen rather than a dialog: the sections
  in public order, the selected section's form drawn from the existing
  field kinds, and a preview of the draft. Each section states where it
  appears in one sentence. "What's on" and "Board of directors" show what
  visitors will see and link to the screen that manages it.
- The Board screen moves to `/website/board` and takes the photo picker;
  the Assets screen becomes Photos at `/website/photos`; the theme editor
  is reached as Look at `/website/look` and keeps its logic. The former
  addresses `/pages`, `/board` and `/assets` redirect.
- Documents and notices stay under Community: members use them too.
- The admin gets a path and title registry (`core/app-paths.ts`,
  `core/app-titles.ts`) and a title strategy that appends
  "OWN Housing Co-op Admin"; routes and links read from it.
- The admin feature folder `features/cms/website` becomes
  `features/website/`, holding the landing, the site tree, the page editor,
  the publish bar, the preview pane, the photo picker, the field kinds and
  the board and photos screens. `features/cms/pages` and
  `features/community/board` fold into it.
- Plain words in the UI: "Welcome banner", "page address", "section",
  "photo", "Photos". No "CMS", "slug", "hero", "block" or "asset".

## Consequences

- The office answers "which screen do I open to change the home page?"
  from the public site's own shape.
- Six screens become one area with one draft and one publish bar.
- Links published before the move keep working through the redirects.
- Every route has a title and the sidebar, tab bar and tests take paths
  from one place.
- The three-pane editor needs 64rem; below that, and at 400% zoom, the
  panes are tabs (L2-REQ-119 AC3).
