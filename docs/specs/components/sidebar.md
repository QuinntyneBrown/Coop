# Sidebar

| Field | Value |
|---|---|
| Selector | `coop-sidebar` |
| Library path | `frontend/projects/components/src/lib/sidebar/` |
| Status | planned |
| Traces to | L2-REQ-018, L2-REQ-054, L2-REQ-066, L2-REQ-067 |
| Design system | [`sidebar.html`](../../design-system/components/sidebar.html) |
| Source mocks | [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-users/default`](../../mocks/pages/admin-users/default.html), [`pages/admin-roles/default`](../../mocks/pages/admin-roles/default.html), [`pages/public-dashboard/default`](../../mocks/pages/public-dashboard/default.html), [`pages/public-maintenance/default`](../../mocks/pages/public-maintenance/default.html), [`pages/public-onboarding/default`](../../mocks/pages/public-onboarding/default.html), [`dialogs/public-profile-switcher/default`](../../mocks/dialogs/public-profile-switcher/default.html) |
| Rendering | [`sidebar.html`](sidebar.html) |

## Purpose and scope

The sidebar is the primary navigation of a signed-in area: a logo header, a vertical list of destinations and, in the admin shell, a footer naming who is signed in. It is a list of page links, so it is a `<nav>` of `<a>` elements, never buttons and never a menu. In the admin shell it is docked beside the page above 768 px; in the member (public) app it is docked at 1024 px and wider and becomes a slide-out drawer below that, opened from the [top bar](top-bar.md) hamburger.

Use something else instead when:

- the destinations are the five member routes on a phone: [bottom tab bar](bottom-tab-bar.md);
- the control switches views inside one page: [tabs](tabs.md);
- the control is a global action such as notifications: [top bar](top-bar.md) with an [icon button](icon-button.md).

Out of scope:

- The shell layout around the sidebar: the main column's `margin-left` of `--layout-sidebar-width`, the skip link, and the DOM order (sidebar before `<main>`) are the shell's.
- The hamburger button. The [top bar](top-bar.md) owns it and its `aria-expanded`; this component only receives `open` and reports `openChange`.
- Which routes exist and which is current. The consumer passes the links; the Angular router marks the current one.
- Signing out. "Log Out" lives on the profile page ([button](button.md) sign-out variant); the footer only shows who is signed in (D-6).

## Usage

Every `.sidebar` in `docs/mocks` (113 uses on 37 screens) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| every admin shell screen: `pages/admin-dashboard/*`, `admin-maintenance/*`, `admin-documents/*`, `admin-messaging/*`, `admin-users/*`, `admin-roles/*`, `admin-profiles/*`, `admin-assets/*`, `admin-invitations/*`, `admin-settings/*`, their dialogs (`dialogs/admin-*`) and notifications (`notifications/admin-*-saved`, `admin-dashboard-unread`) | `shell="admin"`, `title="Coop Manager"`, `label="Admin"`, ten items, `user` set | icons `dashboard`, `build`, `description`, `chat`, `people`, `admin_panel_settings`, `badge`, `perm_media`, `mail`, `settings`; labels "Dashboard", "Maintenance", "Documents", "Messages", "Users", "Roles & Privileges", "Profiles", "Assets", "Invitations", "Settings"; footer avatar "M", "mira.fern", "Member" | one item current on every screen; docked above 768 px, hidden at 768 px and below | surface beside the canvas |
| every member shell screen: `pages/public-dashboard/*`, `public-maintenance/*`, `public-documents/*`, `public-messaging/*`, `public-profile/*`, `dialogs/public-maintenance-create`, `public-maintenance-detail`, `public-document-viewer`, `public-profile-switcher`, `notifications/public-profile-saved` | `shell="public"`, `title="Coop"`, `label="Member"`, five items, no `user`, `id="member-nav"` | icons `home`, `build`, `description`, `chat`, `person`; labels "Home", "Requests", "Documents", "Messages", "Profile" | one item current; docked at 1024 px and wider; drawer closed below (no mock captures the open drawer) | surface beside the canvas; drawer over `--color-bg-backdrop` |

Every row is buildable with the API below: two shells, a title and logo mark, a link list, an optional signed-in footer and the drawer state.

## Anatomy

1. **Backdrop (drawer only)** — `.sidebar-backdrop`. Fixed, covers the viewport with `--color-bg-backdrop` at `--z-drawer`; rendered only while the public drawer is open; a click on it closes the drawer.
2. **Container** — `.sidebar` on an `<aside>`. `--layout-sidebar-width` wide, `--color-bg-surface`, hairline right border, column flex; fixed to the left edge from top to bottom at `--z-sticky` when docked and `--z-drawer` when open as a drawer (`.open`). Carries `aria-label` from `label`.
3. **Header** — `.sidebar-header` with `.logo`: a `.logo-icon` mark (Material icon from `logoIcon` on `--color-brand`) and `.logo-text` (`title`). Hairline rule below, `--space-5` padding.
4. **Nav list** — `<nav class="sidebar-nav" aria-label="Primary">`. Grows to fill the height and scrolls vertically on overflow; `--space-3` padding.
5. **Item** — `.nav-item` (admin) or `.sidebar-link` (public) on an `<a>`: a 1.25 rem Material icon (`aria-hidden="true"`), then the label text. `--space-3` padding and gap, `--radius-md`, `--text-label`. The current page carries `aria-current="page"` and the `.active` class.
6. **Footer (admin only)** — `.sidebar-footer` with `.user-info`: a [`coop-avatar`](avatar.md) (initials "M"), then `.user-details` holding `.user-name` ("mira.fern") and `.user-role` ("Member"). Hairline rule above, `--space-4` by `--space-5` padding. Rendered only when `user` is set.

Host: `coop-sidebar` is `display: contents` and carries no classes. The backdrop `<div>` and the `<aside class="sidebar">` are its direct children; all classes and attributes go on them.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `shell` | `'admin' \| 'public'` | — | yes | `admin` renders items as `.nav-item`, docks above `--layout-breakpoint-md` (768 px) and hides at 768 px and below with no drawer. `public` renders items as `.sidebar-link`, docks at `--layout-breakpoint-lg` (1024 px) and wider and is a drawer below (D-4). |
| `title` | `string` | — | yes | The `.logo-text`: "Coop Manager" in the admin shell, "Coop" in the member app. |
| `logoIcon` | `string` | `'apartment'` | no | Material Icons ligature rendered inside `.logo-icon`, `aria-hidden="true"`. |
| `label` | `string` | — | yes | `aria-label` of the `<aside>` landmark: "Admin" or "Member". |
| `navLabel` | `string` | `'Primary'` | no | `aria-label` of the `<nav>`; distinct from the tab bar's "Main" so the two public landmarks are told apart. |
| `items` | `NavLink[]` | — | yes | One link per entry, in order. `NavLink` is `{ label: string; icon: string; link: string \| readonly unknown[]; testId?: string }` (`nav-link.ts`, shared with the [bottom tab bar](bottom-tab-bar.md)). `link` is passed to `routerLink`; `testId` becomes `data-testid` on the `<a>`. |
| `user` | `SidebarUser \| null` | `null` | no | `{ name: string; role: string; initials: string; avatarSrc?: string }` (`sidebar-user.ts`). When set, the footer renders; when `null`, no footer element exists. |
| `open` | `boolean` | `false` | no | Public shell only: `true` shows the drawer below 1024 px. Ignored while docked and in the admin shell. Bind two-way with `openChange`. |
| `id` | `string \| null` | `null` | when `shell="public"` | `id` on the `<aside>` so the top bar's hamburger can name it in `aria-controls`. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `openChange` | `boolean` (always `false`) | The drawer asks to close: <kbd>Esc</kbd>, a backdrop click, activation of a link, or the viewport growing to 1024 px while open. The consumer sets `open` to the payload; the component never opens itself. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Links and the footer are data (`items`, `user`) so the current-page logic, test ids and translation stay in the consumer. |

Translation: `title`, `label`, `navLabel`, every `NavLink.label` and the `user` strings are inputs; the component holds no copy (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Admin | `.nav-item` items, footer, `aria-label="Admin"` | The admin shell: ten management destinations (L2-REQ-054 AC1) and the signed-in user. |
| Public | `.sidebar-link` items, no footer, `aria-label="Member"`, `.open` while a drawer | The member app: five destinations, docked at LG, drawer below. |

Both variants render identically; the item class name is the only visual-stylesheet difference (design-system page).

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One | — | Full viewport height (`top: 0; bottom: 0`); items about 2.75 rem (1.25 rem icon plus two `--space-3`) | `--space-3` item padding and gap | `--text-label` |

Width is always `--layout-sidebar-width` (260 px); the shell offsets the main column by the same token.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Item default | — | `--color-fg-muted` label on `--color-bg-surface` | Link with the label as its name |
| Item hover | `:hover` | Background `--color-bg-subtle`, label `--color-fg-default`, over `--duration-base` | — |
| Item focus | `:focus-visible` | Shared ring: `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` | — |
| Item current | `aria-current="page"` (and `.active`) | Background `--color-accent-subtle`, label `--color-fg-accent` | "current page" |
| Docked | admin above 768 px; public at 1024 px and wider | Fixed left column at `--z-sticky`; no backdrop | All links in the tab order |
| Hidden (admin) | admin at 768 px and below | `display: none`; the shell drops its left offset and shows the tab bar | Not in the accessibility tree |
| Drawer closed (public) | public below 1024 px, `open` false | Off-canvas: `visibility: hidden` and `translateX(-100%)` | Links not focusable, not announced |
| Drawer open (public) | public below 1024 px, `open` true | `.open`: slides in to `translateX(0)` over `--duration-slow`, at `--z-drawer`, backdrop behind | Focus trapped inside; siblings `inert`; <kbd>Esc</kbd> closes |
| No current item | no link matches the route | All items default | No `aria-current` |

No disabled, loading, collapsed or badge state exists (design-system page).

## Markup

```html
<!-- rendered: admin shell, docked, Dashboard current -->
<aside class="sidebar" aria-label="Admin">
  <div class="sidebar-header">
    <div class="logo"><span class="material-icons logo-icon" aria-hidden="true">apartment</span><span class="logo-text">Coop Manager</span></div>
  </div>
  <nav class="sidebar-nav" aria-label="Primary">
    <a class="nav-item active" href="/dashboard" aria-current="page"><span class="material-icons" aria-hidden="true">dashboard</span><span>Dashboard</span></a>
    <a class="nav-item" href="/maintenance"><span class="material-icons" aria-hidden="true">build</span><span>Maintenance</span></a>
    <!-- Documents, Messages, Users, Roles & Privileges, Profiles, Assets, Invitations, Settings -->
  </nav>
  <div class="sidebar-footer">
    <div class="user-info">
      <span class="avatar" aria-hidden="true">M</span>
      <div class="user-details"><span class="user-name">mira.fern</span><span class="user-role">Member</span></div>
    </div>
  </div>
</aside>
```

```html
<!-- rendered: public shell, drawer open below 1024 px -->
<div class="sidebar-backdrop"></div>
<aside class="sidebar open" id="member-nav" aria-label="Member">
  <div class="sidebar-header">
    <div class="logo"><span class="material-icons logo-icon" aria-hidden="true">apartment</span><span class="logo-text">Coop</span></div>
  </div>
  <nav class="sidebar-nav" aria-label="Primary">
    <a class="sidebar-link active" href="/dashboard" aria-current="page"><span class="material-icons" aria-hidden="true">home</span><span>Home</span></a>
    <a class="sidebar-link" href="/maintenance"><span class="material-icons" aria-hidden="true">build</span><span>Requests</span></a>
    <a class="sidebar-link" href="/documents"><span class="material-icons" aria-hidden="true">description</span><span>Documents</span></a>
    <a class="sidebar-link" href="/messaging"><span class="material-icons" aria-hidden="true">chat</span><span>Messages</span></a>
    <a class="sidebar-link" href="/profile"><span class="material-icons" aria-hidden="true">person</span><span>Profile</span></a>
  </nav>
</aside>
```

Docked and closed differ from the open drawer only by the absence of `.open` and the backdrop. The admin shell never renders a backdrop.

```html
<!-- consumer -->
<coop-sidebar shell="admin" title="Coop Manager" label="Admin" [items]="adminLinks" [user]="signedIn()"></coop-sidebar>
<coop-sidebar shell="public" id="member-nav" title="Coop" label="Member" [items]="memberLinks" [open]="menuOpen()" (openChange)="menuOpen.set($event)"></coop-sidebar>
```

The classes and attributes above are part of the contract: the e2e page objects locate the sidebar by `.sidebar`, the items by `.nav-item` / `.sidebar-link`, `.active` and `aria-current`, and the footer by `.user-name` and `.user-role`.

## Design

- Width `--layout-sidebar-width`; surface `--color-bg-surface`; right border `--border-width-hairline` solid `--color-border-default`.
- Header padding `--space-5`; logo gap `--space-2`; mark 1.75 rem square, `--radius-sm`, `--color-brand` fill, `--color-fg-inverse` glyph; title `--text-h3`.
- Nav padding `--space-3`, `overflow-y: auto`; item padding `--space-3`, gap `--space-3`, bottom margin `--space-0-5`, radius `--radius-md`, font `--text-label`, icon `--icon-size` 1.25 rem.
- Footer padding `--space-4` by `--space-5`, gap `--space-3`; avatar at its default size; `.user-name` `--text-label` in `--color-fg-default`; `.user-role` `--text-caption` in `--color-fg-muted` (D-8).
- Transitions: item `background-color` over `--duration-base` with `--ease-standard`; drawer `transform` and backdrop opacity over `--duration-slow` with `--ease-standard` (D-5).
- Layers: `--z-sticky` docked; `--z-drawer` for the backdrop and the open drawer, backdrop first in DOM order so it paints beneath the panel.
- Focus ring: `--focus-ring-width` solid `--color-focus-ring`, `--focus-ring-offset`; items keep `--space-0-5` between them so the ring is never clipped by a neighbour.

Component tokens: none. The block reads semantic tokens directly (components.css declares no `--sidebar-*` token), so a surface cannot re-skin it; nothing in the product needs to.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Surface | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Right border, header and footer rules | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Item label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Item hover fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Item hover label, user name | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Current fill | `--color-accent-subtle` | `--palette-green-50` | `--palette-green-50` |
| Current label | `--color-fg-accent` | `--palette-green-700` | `--palette-green-700` |
| Logo mark fill | `--color-brand` | `--palette-green-500` | `--palette-green-500` |
| Logo glyph | `--color-fg-inverse` | `--palette-white` | `--palette-white` |
| Backdrop | `--color-bg-backdrop` | black at 50 % | black at 50 % |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Item label, user role |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Hovered item label |
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Current item label |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Title and user name |
| `--color-brand` | `--color-bg-surface` | 3:1 | Logo mark (non-text) |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on an item |
| `--color-focus-ring` | `--color-accent-subtle` | 3:1 | Focus ring on the current item |

The right border and the rules are decorative and exempt from 1.4.11. The mocks' admin current item (white on the brand green, 4.2:1) is replaced by the tinted pair above (design-system drift note). Under `forced-colors: active` the ring becomes `Highlight` and borders `CanvasText` (tokens.css); the current item keeps `aria-current`, so the state survives without colour.

## Responsive behaviour

- Admin: docked and fixed above `--layout-breakpoint-md` (769 px and wider, the mocks' `max-width: 768px` rule inverted); `display: none` at 768 px and below, where the shell removes its left offset and the [bottom tab bar](bottom-tab-bar.md) carries the five shared destinations. No admin drawer exists (D-4).
- Public: docked and fixed at `--layout-breakpoint-lg` (1024 px) and wider; below that it is a drawer that the top bar hamburger opens (L2-REQ-067 AC2, AC3). The drawer is `--layout-sidebar-width` wide at every viewport, so at 320 px it covers 260 px and the backdrop the remaining 60 px.
- When the viewport grows to 1024 px while the drawer is open, the component emits `openChange(false)`, removes the backdrop and `inert`, and docks; when it shrinks below 1024 px the docked sidebar becomes a closed drawer without emitting.
- Labels wrap onto a second line rather than truncate; "Roles & Privileges" fits on one line at the default size and wraps at larger text spacing without clipping.
- With ten items on a short viewport (for example 200 % zoom on a 1080 px tall screen), `.sidebar-nav` scrolls inside the sidebar; the header and footer stay in place.
- At 320 px nothing scrolls horizontally; at 400 % zoom the member drawer stays reachable from the hamburger and every link stays operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: items are about 44 px tall and the full width of the list, above the 24 px `--target-min` and at the 44 px size the accessibility foundation sets for primary phone actions.

## Accessibility

### Role and pattern

An `<aside>` complementary landmark named by `label`, containing a `<nav>` landmark named by `navLabel` whose children are native links. [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/), not the menu pattern: no `role="menu"`, `menuitem` or `tablist`. The open drawer follows the modal part of the [dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for focus (trap, return, inert siblings) without taking `role="dialog"`, because it remains the page's navigation landmark.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the links in DOM order; each link is one stop. In the open drawer, wraps within the drawer (CDK `FocusTrap`). |
| <kbd>Enter</kbd> | Follows the link; in the drawer, also closes it (`openChange(false)`). |
| <kbd>Esc</kbd> | Drawer only: emits `openChange(false)`. |

### Focus

- Docked: no focus management; links are ordinary stops after the skip link and before `<main>`.
- Drawer open: the component records the opener (`document.activeElement`, the hamburger), traps focus with `@angular/cdk/a11y` `FocusTrap` and moves focus to the first link once the slide finishes (`focusInitialElementWhenReady`). Every sibling of the host receives `inert` so the page behind is neither focusable nor read (D-9).
- Drawer close: the trap is released, `inert` removed, and focus returns to the opener if it is still in the document; otherwise to the first focusable element of `<main>`.
- The shared ring shows on `:focus-visible` and is not clipped: `.sidebar-nav` scrolls vertically only and keeps `--space-3` padding around the items.

### Labelling

- The link text is the accessible name; the icon is `aria-hidden="true"`.
- The current page carries `aria-current="page"`; the `.active` class alone is not announced and exists for the stylesheet and page objects.
- `<aside aria-label>` and `<nav aria-label>` are required and come from inputs; the mocks' unlabelled landmarks are drift.
- The footer shows the handle and role as text (`.user-name`, `.user-role`); the avatar is decorative (`aria-hidden`) because the name is beside it (avatar `name` left empty).

### Announcements

None. Opening the drawer moves focus into a labelled landmark, which screen readers announce as "Primary, navigation"; no live region is needed.

### Motion

The drawer slides in and out and the backdrop fades over `--duration-slow`; item backgrounds change over `--duration-base`. Under `prefers-reduced-motion: reduce` tokens.css sets both to 0.01 ms, so the drawer appears in place. Focus moves after the transition ends, which under reduced motion is immediate.

## Content and internationalisation

- Labels are one or two Title Case nouns naming the destination, the same noun as the page title it opens: "Dashboard", "Maintenance", "Documents", "Messages", "Users", "Roles & Privileges", "Profiles", "Assets", "Invitations", "Settings"; member app: "Home", "Requests", "Documents", "Messages", "Profile". Home first, Profile last; admin management items follow the shared items (navigation pattern).
- Titles: "Coop Manager" (admin), "Coop" (member). Landmark labels: "Admin", "Member", "Primary".
- Footer: the handle and role from the current profile, "mira.fern" and "Member" (L2-REQ-018); the role is the profile type as a single Title Case word.
- Translatable inputs: `title`, `label`, `navLabel`, `NavLink.label`, `SidebarUser.role`. Data values: `SidebarUser.name`, `SidebarUser.initials`, `logoIcon`, `NavLink.icon`, `NavLink.link`.
- Long strings: a French label about 30 % longer ("Rôles et privilèges", "Invitations") wraps to a second line inside the 260 px column without clipping; the item grows in height.

## Performance

- Change detection: `OnPush`, signal inputs; the item class, the drawer mode (from a `BreakpointObserver` signal) and the open state are `computed`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the docked sidebar is fixed and `--layout-sidebar-width` wide from first paint; the drawer is off-canvas, not `display: none`, so opening it never reflows the page. The footer reserves the avatar's size.
- Weight: imports `@angular/core`, `@angular/common`, `@angular/router` (`RouterLink`, `RouterLinkActive`), `@angular/cdk/a11y` (`FocusTrap`) and `@angular/cdk/layout` (`BreakpointObserver`); composes [`coop-avatar`](avatar.md). No page-level or data dependencies.

## Acceptance criteria

### Rendering

- **AC-1** Given `shell="admin"`, `title="Coop Manager"`, `label="Admin"` and the ten admin links, when it renders above 768 px, then the DOM holds `<aside class="sidebar" aria-label="Admin">` with a `.sidebar-header` logo reading "Coop Manager", a `<nav class="sidebar-nav" aria-label="Primary">` of ten `.nav-item` links in the order Dashboard, Maintenance, Documents, Messages, Users, Roles & Privileges, Profiles, Assets, Invitations, Settings, and a `.sidebar-footer`. (L2-REQ-054)
- **AC-2** Given `shell="public"`, `title="Coop"`, `label="Member"` and the five member links, when it renders at 1024 px, then the DOM holds five `.sidebar-link` links labelled "Home", "Requests", "Documents", "Messages", "Profile" with the icons `home`, `build`, `description`, `chat`, `person`, and no `.sidebar-footer`. (L2-REQ-066)
- **AC-3** Given the "Maintenance" link with `icon="build"`, when it renders, then a `.material-icons` span containing "build" with `aria-hidden="true"` precedes the label text and the link's accessible name is exactly "Maintenance". (L2-REQ-066)
- **AC-4** Given `user` is `{ name: "mira.fern", role: "Member", initials: "M" }`, when the admin sidebar renders, then the footer shows an avatar with "M", `.user-name` reading "mira.fern" and `.user-role` reading "Member" below it. (L2-REQ-018)
- **AC-5** Given the current profile changes from the Member profile to Mira Fern's BoardMember profile, when `user` updates to `{ role: "BoardMember" }`, then `.user-role` reads "BoardMember" and nothing else in the sidebar re-renders. (L2-REQ-018)

### States

- **AC-6** Given the route is `/users`, when the admin sidebar renders, then only the "Users" link has `aria-current="page"` and the `.active` class, a `--color-accent-subtle` fill and a `--color-fg-accent` label with contrast of at least 4.5:1. (L2-REQ-054)
- **AC-7** Given the "Documents" link, when it is hovered, then its fill changes to `--color-bg-subtle` and its label to `--color-fg-default` over `--duration-base`, and the current item keeps its accent colours. (L2-REQ-066)
- **AC-8** Given the "Messages" link, when it receives keyboard focus, then a `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is visible and unclipped by `.sidebar-nav`. (L2-REQ-066)
- **AC-9** Given the onboarding route `/onboarding`, when the page renders, then no member sidebar is rendered: onboarding is a focused first-run flow outside the member shell (D-7). (L2-REQ-066)

### Drawer

- **AC-10** Given `shell="public"` at 375 px wide and `open` false, when the page renders, then the sidebar is off-canvas (`visibility: hidden`), none of its five links is in the tab order, and no `.sidebar-backdrop` exists. (L2-REQ-067)
- **AC-11** Given the member drawer closed at 375 px, when `open` becomes true, then `.sidebar` gains `.open`, slides to `translateX(0)` over `--duration-slow` at `--z-drawer`, a `.sidebar-backdrop` covers the page behind it, and the same five links as the docked sidebar are visible. (L2-REQ-067)
- **AC-12** Given the drawer has just opened from the "Open menu" button, when the slide ends, then focus is on the "Home" link, <kbd>Tab</kbd> from "Profile" returns to "Home", and every sibling of the sidebar host has the `inert` attribute. (L2-REQ-067)
- **AC-13** Given the open drawer, when <kbd>Esc</kbd> is pressed, then `openChange` emits `false`, and when the consumer sets `open` to false the drawer slides out, `inert` is removed from the siblings and focus returns to the "Open menu" button. (L2-REQ-067)
- **AC-14** Given the open drawer, when the backdrop is clicked, then `openChange` emits `false`. (L2-REQ-067)
- **AC-15** Given the open drawer, when the "Requests" link is activated, then navigation to `/maintenance` starts and `openChange` emits `false`. (L2-REQ-067)
- **AC-16** Given the open drawer at 1000 px, when the viewport grows to 1024 px, then `openChange` emits `false`, the backdrop and `inert` are removed and the sidebar is docked at `--z-sticky` without `.open`. (L2-REQ-067)

### Screen readers

- **AC-17** Given the admin sidebar on `/dashboard`, when read with a screen reader, then it exposes a complementary landmark "Admin" containing a navigation landmark "Primary", and the first link is announced as "Dashboard, current page, link". (L2-REQ-054)
- **AC-18** Given the member sidebar, when its links are listed by assistive technology, then the names are exactly "Home", "Requests", "Documents", "Messages", "Profile" with no icon ligature text. (L2-REQ-066)

### Theming

- **AC-19** Given either shell, when the page sets `data-theme="dark"`, then the sidebar renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-066)

### Responsive

- **AC-20** Given the open member drawer at 320 px, when measured, then the panel is 260 px wide, the backdrop fills the remaining width, no label clips and the page does not scroll horizontally. (L2-REQ-067)
- **AC-21** Given the admin sidebar with ten items in a 540 px tall viewport, when rendered, then `.sidebar-nav` scrolls vertically, the header and footer remain visible, and "Settings" is reachable by scrolling or by <kbd>Tab</kbd>. (L2-REQ-054)
- **AC-22** Given the admin sidebar, when the viewport is 768 px wide, then the sidebar is `display: none`, none of its links is focusable and the main column has no left offset. (L2-REQ-054)

### Motion

- **AC-23** Given `prefers-reduced-motion: reduce`, when the member drawer opens, then it appears in place within 0.01 ms, the backdrop does not fade and focus moves to "Home" immediately. (L2-REQ-067)

### Performance

- **AC-24** Given the admin sidebar, when the route changes from `/users` to `/roles`, then only the `aria-current` and `.active` of the two affected links change and no other item re-renders (`OnPush` with signal inputs). (L2-REQ-054)

## Implementation notes

- Folder `frontend/projects/components/src/lib/sidebar/`: `sidebar.component.ts`, `sidebar.component.html`, `sidebar.component.css`, `sidebar-shell.ts` (type alias), `sidebar-user.ts` (interface), `nav-link.ts` (interface, imported by the bottom tab bar); export from `public-api.ts`.
- Items render with `routerLink`, `routerLinkActive="active"` and `ariaCurrentWhenActive="page"` so `.active` and `aria-current` always agree.
- Drawer mode is `shell() === 'public' && !matchesLg()`, where `matchesLg` is a signal from `BreakpointObserver.observe('(min-width: 64rem)')`; the stylesheet uses the same query (`64rem` written literally, since custom properties cannot appear in media conditions).
- Focus: `ConfigurableFocusTrapFactory.create(aside)` when the drawer opens; `focusInitialElementWhenReady()` after `transitionend` (or immediately under reduced motion); `destroy()` on close. The opener is stored before the trap takes focus.
- `inert` is set and removed with `Renderer2` on `host.parentElement.children` other than the host; the shell keeps the sidebar a direct child of its layout element (next to the top bar, `<main>` and the tab bar).
- Document `keydown` for <kbd>Esc</kbd> is listened to only while the drawer is open.
- The admin hidden state and the public docked state are stylesheet rules on the inner `<aside>`; the host adds `position: fixed; inset-block: 0; left: 0` to the design-system block, which only sets width, surface and border.
- `@angular/cdk` is not yet in `frontend/package.json`; the first slice adds it at the workspace's Angular major.
- Composes [`coop-avatar`](avatar.md); composed by neither; the [top bar](top-bar.md) drives `open` through its `menuToggled` output. The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Does the admin shell get a drawer at 768 px and below?* No. The mocks hide the admin sidebar with no replacement and the design-system page documents that as implemented; the navigation pattern asks for an admin drawer or an equivalent route, but no L2 requirement or mock specifies it, so adding one would be new behaviour (AGENTS.md scope rule). The `shell` input keeps the two behaviours apart so an admin drawer can be added later without changing the public one; it needs an `engineering-requirements` update and a mock first.
- **D-5** *Does the drawer animate?* Yes, a `translateX` slide and backdrop fade over `--duration-slow`. L2-REQ-067 AC3 calls it a "slide-out", the design-system page says a slide "must respect" reduced motion, and the duration token already collapses to 0.01 ms under that preference. The element stays rendered off-canvas so the transition can run.
- **D-6** *Does the footer hold a sign-out control?* No. Every admin mock shows avatar, handle and role only, and the design-system anatomy says the same; "Log Out" is a button on the profile page. The footer is read-only.
- **D-7** *What is current on a page the sidebar does not list?* Nothing: no link matches the route, so no `aria-current` is set; the navigation pattern's "don't" is about listed destinations. Onboarding does not show the sidebar at all, so a new member finishes the wizard without leaving it part-way.
- **D-8** *How are `.user-info`, `.user-name` and `.user-role` styled?* components.css has no rule for them; the CRD maps the mocks' 14 px/500 name and 12 px muted role to `--text-label` on `--color-fg-default` and `--text-caption` on `--color-fg-muted`, which pass 4.5:1. The design-system stylesheet should add the rule.
- **D-9** *Why not host the drawer in a CDK Dialog?* The same element is docked beside the page at 1024 px and a drawer below; a dialog would re-parent it into the overlay container and break the sidebar-before-main DOM order the skip link relies on. The CRD uses the CDK `FocusTrap` primitive plus `inert` on the host's siblings, which gives the dialog pattern's focus behaviour in place.
- **D-10** *How does the drawer find its breakpoint?* `BreakpointObserver` on `(min-width: 64rem)`, the LG token's value, written literally because custom properties cannot be used in media conditions (layout foundation).
- **D-11** *Which element gets the logo mark?* A `.logo-icon` span with the `apartment` ligature, as the design-system page renders for both shells. The public mocks' inline "C" SVG is drift the design system replaced with Material Icons.
