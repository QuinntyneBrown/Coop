# Every screen at 400% zoom

## Overview

Many members of the co-operative read with the browser zoomed in. At 400%
zoom a 1280 px window is 320 CSS px wide, and WCAG 2.2 1.4.10 Reflow asks
that every screen then reads in one column, with no sideways scrolling and
nothing lost (L2-REQ-090).

The public app already reflowed, apart from the filter tabs on the documents
page. Most admin screens ran off the right edge, and below 768 px the admin
menu was hidden with no way to open it. This design changes the existing
component styles only; it adds no component, service or template.

The narrow layout shows in every page mock in `docs/mocks/pages/` opened in a
window 320 CSS px wide; the extracted styles in `docs/mocks/assets/styles/`
carry the same rules as the applications.

## Description

All rules sit in a `@media (max-width: 768px)` block in each component's own
styles, beside the breakpoint the components already used.

### Admin shell

| Component | Narrow layout |
|-----------|---------------|
| `LayoutComponent` | The layout becomes a column: the menu sits above the screen instead of being hidden. |
| `SidebarComponent` | The menu stops being fixed to the left edge, takes the full width and its natural height, and keeps every link and the signed-in user. |
| `TopbarComponent` | The title and the search row wrap; the search field takes the full width and may shrink. |

### Admin screens

| Screen | Narrow layout |
|--------|---------------|
| Dashboard | The top bar wraps and its search shrinks; the metric cards stack; quick actions sit two to a row. |
| Maintenance | The status filter buttons wrap. |
| Documents | The toolbar wraps and the document cards stack. |
| Messages | The empty "Select a conversation" panel is hidden until a conversation is opened; the search field may shrink. |
| Users, Assets | The page header and its actions wrap; the search field may shrink. |
| Users, Invitations | The table scrolls inside its own card when it is wider than the screen, as the roles table already did. |
| Roles | The role list and privileges stack, and the privileges header wraps. |
| Profile, Profiles | The profile list and the profile view stack. |
| Settings | The tabs wrap and the theme form and preview stack. |

Page padding drops from 24 px to 16 px on these screens so the content keeps
its width.

### Public application

The filter tabs on `/documents` wrap onto a second line instead of scrolling
sideways.

### Tests

`e2e/pages/reflow.page.ts` opens a screen and checks that the document is no
wider than the viewport and that every visible link, button, field and tab
sits inside it; a control inside a data table may sit in the table's own
scrolling region. `e2e/tests/public/reflow.spec.ts` and
`e2e/tests/admin/reflow.spec.ts` run it at 320 × 800 on every route of both
apps, signed in where the route needs it, and the admin spec also uses the
menu at that width. They run against the mock API.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-REQ-090` | `L1-REQ-013` | Every screen of both apps stays usable at 400% zoom: one column, no sideways scrolling, nothing lost. |
