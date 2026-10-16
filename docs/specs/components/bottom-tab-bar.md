# Bottom tab bar

| Field | Value |
|---|---|
| Selector | `coop-bottom-tab-bar` |
| Library path | `frontend/projects/components/src/lib/bottom-tab-bar/` |
| Status | planned |
| Traces to | L2-REQ-053, L2-REQ-054, L2-REQ-067, L2-REQ-076 |
| Design system | [`bottom-tab-bar.html`](../../design-system/components/bottom-tab-bar.html) |
| Source mocks | [`pages/public-dashboard/default`](../../mocks/pages/public-dashboard/default.html), [`pages/public-maintenance/default`](../../mocks/pages/public-maintenance/default.html), [`pages/public-profile/default`](../../mocks/pages/public-profile/default.html), [`pages/admin-maintenance/default`](../../mocks/pages/admin-maintenance/default.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/public-login/default`](../../mocks/pages/public-login/default.html) |
| Rendering | [`bottom-tab-bar.html`](bottom-tab-bar.html) |

## Purpose and scope

The bottom tab bar is the primary navigation of a signed-in app on a phone or tablet: five destinations, each an icon above a short label, fixed to the bottom edge where a thumb reaches them. It replaces the [sidebar](sidebar.md) below the shell's docking breakpoint and disappears where the sidebar is docked. The items navigate between pages, so they are links; the bar is a `<nav>` landmark, not an ARIA tablist.

Use something else instead when:

- the control switches views inside one page: [tabs](tabs.md);
- the control filters a list: [filter chips](filter-chips.md);
- the screen is wide enough for the docked [sidebar](sidebar.md).

Out of scope:

- The space the page reserves for the bar (72 px of bottom padding on the scrolling region) and `viewport-fit=cover` in the app's `index.html`, both the shell's.
- Which routes exist and which is current: the consumer passes the links; the Angular router marks the current one.
- Badges or counts on items. No mock or design-system state has them.

## Usage

Every `.bottom-tab-bar` in `docs/mocks` (101 uses on 27 screens) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| every member shell screen: `pages/public-dashboard/*`, `public-maintenance/*`, `public-documents/*`, `public-messaging/*`, `public-profile/*`, `dialogs/public-*`, `notifications/public-profile-saved` | `shell="public"`, `label="Main"`, five items | `home` "Home" (/dashboard), `build` "Requests" (/maintenance), `description` "Documents" (/documents), `chat` "Messages" (/messaging), `person` "Profile" (/profile) | one item current; shown below 1024 px and hidden from 1024 px, where the sidebar docks (D-4) | surface over the canvas |
| admin shell screens that render the `.mobile-only` wrapper: `pages/admin-dashboard/*`, `admin-maintenance/*`, `admin-documents/*`, `admin-messaging/*`, their dialogs and `notifications/admin-dashboard-unread`, `admin-profile-saved` | `shell="admin"`, `label="Main"`, the same five items with `.tab-label` spans | as above; "Profile" links to /profile | one item current; shown at 768 px and below | surface over the canvas |
| `pages/public-login/*`, `public-register/*`, `public-forgot-password/*`, `pages/admin-login/*`, `admin-register/*` | not rendered (D-5) | — | the member sign-in page and its mocks show no bar; the admin sign-in mocks still render it on phones with no current item, linking to pages that need a session | — |

Every row is buildable with the API below: a labelled list of three to five links and the shell whose breakpoint hides the bar.

## Anatomy

1. **Bar** — `.bottom-tab-bar` on a `<nav>`. Sticky to the bottom at `--z-sticky`, `--color-bg-surface`, hairline top border `--color-border-default`, items spaced evenly; padding `--space-2` top and `--space-2` plus `env(safe-area-inset-bottom)` bottom. Carries `aria-label` from `label`.
2. **Item** — `.tab-item` on an `<a>`. Column flex, centred, `--space-0-5` gap, minimum width 3.5 rem, `--space-1` by `--space-3` padding, `--radius-sm`; `--color-fg-muted` at rest, `--color-fg-accent` when current. The current page carries `aria-current="page"` and the `.active` class.
3. **Icon** — `<span class="material-icons" aria-hidden="true">` at the default `--icon-size` (1.5 rem).
4. **Label** — `<span class="tab-label">` in `--text-caption` at `--font-weight-medium`; always visible.

Host: `coop-bottom-tab-bar` is `display: contents`; the `<nav class="bottom-tab-bar">` is its only child and carries every class and attribute. The shell places the host as the last child of its layout column so the sticky bar sits at the bottom of the viewport.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `items` | `NavLink[]` | — | yes | Three to five links, in order. `NavLink` is `{ label: string; icon: string; link: string \| readonly unknown[]; testId?: string }` (`nav-link.ts` in the [sidebar](sidebar.md) folder). `link` is passed to `routerLink`; `testId` becomes `data-testid` on the `<a>`. More than five is a consumer error: labels would wrap (design-system page). |
| `label` | `string` | `'Main'` | no | `aria-label` of the `<nav>`; distinct from the sidebar's "Primary". |
| `shell` | `'public' \| 'admin'` | `'public'` | no | `public` shows the bar below `--layout-breakpoint-lg` (1024 px) and hides it from 1024 px; `admin` shows it at `--layout-breakpoint-md` (768 px) and below and hides it above (D-4). |

All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The items are router links; navigation is the event. The router's own events serve any page that needs to react. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Items are data so the current-page logic, test ids and translation stay in the consumer. |

Translation: `label` and every `NavLink.label` are inputs; the component holds no copy (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| One | — | Member app and admin app on compact screens; the five Coop destinations. The `shell` input changes only the breakpoint at which the bar hides. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One | — | about 4.25 rem (two `--space-2`, 1.5 rem icon, `--space-0-5` gap, one line of `--text-caption`, two `--space-1`) plus the safe-area inset | bar `--space-2`; item `--space-1` by `--space-3` | `--text-caption` at `--font-weight-medium` |

Width is the viewport; items share it evenly (`justify-content: space-around`) and at 320 px shrink to equal shares so five labels fit (D-6).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Item default | — | `--color-fg-muted` icon and label | Link with the label as its name |
| Item hover | `:hover` | Icon and label `--color-fg-accent` over `--duration-base`; no underline | — |
| Item focus | `:focus-visible` | Shared ring `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset`, drawn outside the item | — |
| Item current | `aria-current="page"` (and `.active`) | Icon and label `--color-fg-accent` | "current page" |
| Shown | public below 1024 px; admin at 768 px and below | Sticky bar at the bottom | Navigation landmark "Main" |
| Hidden | public from 1024 px; admin above 768 px | `display: none` | Not in the accessibility tree |
| No current item | no link matches the route | All items default | No `aria-current` |

The current item changes colour only; the label and position stay fixed and `aria-current` carries the state, which the design-system page accepts for 1.4.1. No badge, disabled or loading state exists.

## Markup

```html
<!-- rendered: member app, Requests current -->
<nav class="bottom-tab-bar" aria-label="Main">
  <a class="tab-item" href="/dashboard"><span class="material-icons" aria-hidden="true">home</span><span class="tab-label">Home</span></a>
  <a class="tab-item active" href="/maintenance" aria-current="page"><span class="material-icons" aria-hidden="true">build</span><span class="tab-label">Requests</span></a>
  <a class="tab-item" href="/documents"><span class="material-icons" aria-hidden="true">description</span><span class="tab-label">Documents</span></a>
  <a class="tab-item" href="/messaging"><span class="material-icons" aria-hidden="true">chat</span><span class="tab-label">Messages</span></a>
  <a class="tab-item" href="/profile"><span class="material-icons" aria-hidden="true">person</span><span class="tab-label">Profile</span></a>
</nav>
```

The admin shell renders the same markup; only the hide breakpoint differs. A hidden bar keeps this markup under `display: none`.

```html
<!-- consumer -->
<coop-bottom-tab-bar [items]="memberLinks"></coop-bottom-tab-bar>
<coop-bottom-tab-bar shell="admin" [items]="adminPhoneLinks"></coop-bottom-tab-bar>
```

The classes and attributes above are part of the contract: the e2e page objects locate the bar by `.bottom-tab-bar`, the items by `.tab-item`, `.active` and `aria-current`, and a `data-testid` from `NavLink.testId` (`tab-home`, `tab-requests`, `tab-docs`, `tab-messages`, `tab-profile`).

## Design

- Bar: `position: sticky; bottom: 0`, `--z-sticky`, `--color-bg-surface`, top border `--border-width-hairline` solid `--color-border-default`, `justify-content: space-around`, padding `--space-2` top and `calc(--space-2 + env(safe-area-inset-bottom, 0px))` bottom.
- Item: column flex, `--space-0-5` gap, `min-width: 3.5rem`, padding `--space-1` by `--space-3`, `--radius-sm`, `--text-caption` with `--font-weight-medium`, `text-decoration: none`; at 320 px `flex: 1 1 0` and `min-width: 0` so five items share the width (D-6).
- Icon `--icon-size` 1.5 rem; label one line, wrapping to two only when a translated label cannot fit its share.
- Transition: `color` over `--duration-base` with `--ease-standard`. Nothing moves.
- Focus ring `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset`, outside the item; the bar has no `overflow: hidden`.

Component tokens: none. The block reads semantic tokens directly; no surface re-skins it.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Surface | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Top rule | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Item icon and label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Current and hovered item | `--color-fg-accent` | `--palette-green-700` | `--palette-green-700` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Item label |
| `--color-fg-accent` | `--color-bg-surface` | 4.5:1 | Current and hovered label |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the bar |

The top rule is decorative and exempt from 1.4.11. Under `forced-colors: active` the ring becomes `Highlight` and the rule `CanvasText` (tokens.css); the current item keeps `aria-current`, so the state survives without colour.

## Responsive behaviour

- Public: shown below `--layout-breakpoint-lg` (1024 px), hidden with `display: none` at 1024 px and wider, where the docked [sidebar](sidebar.md) takes over (D-4).
- Admin: shown at `--layout-breakpoint-md` (768 px) and below, where the admin sidebar is hidden; hidden above (the mocks' `.mobile-only` wrapper, folded into the component).
- Safe areas: the bottom padding adds `env(safe-area-inset-bottom, 0px)` so the labels clear a phone's home indicator; the inset is non-zero only when the shell declares `viewport-fit=cover` (responsive foundation).
- At 320 px five items fit on one row without horizontal scrolling: with the default labels each item keeps its 3.5 rem minimum (five make 280 px); with longer labels the items share the width equally and labels wrap to two lines (D-6).
- Labels never hide at any width (navigation pattern: do not hide labels at small widths); at 400 % zoom the bar stays at the bottom of the 320 px viewport with all five items reachable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: each item is at least 56 px wide and about 52 px tall, above the 24 px `--target-min` and the 44 px size the accessibility foundation sets for primary phone actions.

## Accessibility

### Role and pattern

A native `<nav aria-label="Main">` landmark of native links. [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/); not the [tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): no `role="tablist"`, `tab` or `tabpanel`, because each item loads a page.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the five links in DOM order; each is one stop. Arrow keys do nothing (not a tablist). |
| <kbd>Enter</kbd> | Follows the link. |

### Focus

Focus lands on the native links, never on the host. The shared ring shows on `:focus-visible`, drawn outside the item with `--focus-ring-offset`, and is not clipped: the bar and its items have no `overflow: hidden`. The bar is the last landmark in the tab order (it follows `<main>` in the DOM) so the skip link to `#main` remains useful. A hidden bar (`display: none`) removes its links from the tab order.

### Labelling

- The visible label text is the accessible name; the icon is `aria-hidden="true"`. No item is ever icon-only.
- The current page carries `aria-current="page"`; the `.active` class alone is not announced and exists for the stylesheet and page objects.
- `aria-label` on the `<nav>` is required and comes from `label`; the mocks' unlabelled nav is drift.

### Announcements

None. Navigation announces the new page through its title and `h1`.

### Motion

Only `color` transitions, over `--duration-base`; under `prefers-reduced-motion: reduce` tokens.css shortens it to 0.01 ms. The bar never slides or hides on scroll.

## Content and internationalisation

- One word per label, matching the page heading where it fits: "Home", "Requests", "Documents", "Messages", "Profile", the same labels as the sidebar. "Requests" is shortened from "Maintenance Requests"; the page heading keeps the long form.
- Same destination, same icon as the sidebar: `home`, `build`, `description`, `chat`, `person`. Home first, Profile last.
- Labels are `--text-caption` (12 px), the smallest size on the scale; the mocks' 11 px is drift and nothing may go smaller.
- Translatable inputs: `label`, `NavLink.label`. Data values: `NavLink.icon`, `NavLink.link`, `NavLink.testId`.
- Long strings: French labels about 30 % longer ("Accueil", "Demandes", "Docs", "Messages", "Profil") share the width equally at 320 px; a label that still does not fit wraps to a second line and the bar grows, rather than clipping or hiding the label.

## Performance

- Change detection: `OnPush`, signal inputs; the hide breakpoint is a stylesheet rule keyed on a host attribute from `shell`, so no observer runs.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the bar's height is fixed by its tokens from first paint; `aria-current` changes colour only, so a route change shifts nothing. The shell reserves 72 px so content never jumps when the bar appears.
- Weight: imports `@angular/core`, `@angular/common` and `@angular/router` (`RouterLink`, `RouterLinkActive`); no CDK; composes nothing.

## Acceptance criteria

### Rendering

- **AC-1** Given the five member links, when the bar renders at 375 px, then the DOM holds `<nav class="bottom-tab-bar" aria-label="Main">` with five `.tab-item` links labelled "Home", "Requests", "Documents", "Messages", "Profile" in that order, linking to `/dashboard`, `/maintenance`, `/documents`, `/messaging`, `/profile`. (L2-REQ-053)
- **AC-2** Given the "Requests" item with `icon="build"`, when it renders, then a `.material-icons` span containing "build" with `aria-hidden="true"` sits above a `.tab-label` reading "Requests" in `--text-caption` at `--font-weight-medium`, and the icon is 24 px. (L2-REQ-067)
- **AC-3** Given `NavLink.testId` is "tab-home", when the "Home" item renders, then its `<a>` has `data-testid="tab-home"`. (L2-REQ-053)

### States

- **AC-4** Given the route is `/maintenance`, when the bar renders, then only "Requests" has `aria-current="page"` and `.active`, with a `--color-fg-accent` icon and label at a contrast of at least 4.5:1, and the other four items are `--color-fg-muted`. (L2-REQ-053)
- **AC-5** Given the "Documents" item, when it is hovered, then its icon and label change to `--color-fg-accent` over `--duration-base` and nothing is underlined. (L2-REQ-067)
- **AC-6** Given the "Messages" item, when it receives keyboard focus, then a `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is visible outside the item and unclipped by the bar. (L2-REQ-067)
- **AC-7** Given the onboarding route `/onboarding`, when the page renders, then no member bar is rendered: onboarding is a focused first-run flow outside the member shell. (L2-REQ-053)

### Keyboard and focus

- **AC-8** Given focus on the last link in `<main>`, when <kbd>Tab</kbd> is pressed, then focus moves to "Home", then "Requests", "Documents", "Messages", "Profile" in turn, and <kbd>Enter</kbd> on "Profile" navigates to `/profile`. (L2-REQ-053)

### Screen readers

- **AC-9** Given the bar, when read with a screen reader, then it is a navigation landmark named "Main" containing five links, the current one announced as "Requests, current page, link", with no tab or tablist role and no icon ligature text. (L2-REQ-067)

### Theming

- **AC-10** Given the bar, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-067)

### Responsive

- **AC-11** Given `shell="public"`, when the viewport is 375, 640 and 768 px, then the bar is visible and sticky at the bottom edge at `--z-sticky`, and when the viewport is 1024 px it is `display: none` and its links are not focusable. (L2-REQ-067)
- **AC-12** Given `shell="admin"`, when the viewport is 768 px, then the bar is visible, and when it is 769 px the bar is `display: none`. (L2-REQ-054)
- **AC-13** Given a device with a 34 px bottom safe-area inset and `viewport-fit=cover`, when the bar renders, then its bottom padding is `--space-2` plus 34 px and the labels sit above the home indicator. (L2-REQ-067)
- **AC-14** Given the five default labels at 320 px, when measured, then all five items are visible on one row, each at least 56 × 44 CSS px, no label is hidden or clipped and the page does not scroll horizontally. (L2-REQ-067)
- **AC-15** Given French labels "Accueil", "Demandes", "Docs", "Messages", "Profil" at 320 px, when measured, then the items share the width equally, any label that does not fit wraps to a second line, and nothing overflows the viewport. (L2-REQ-067)
- **AC-16** Given the login page, when it renders at 375 px, then no `.bottom-tab-bar` is present. (L2-REQ-076)

### Motion

- **AC-17** Given `prefers-reduced-motion: reduce`, when an item is hovered, then its colour changes with a 0.01 ms transition and the bar never animates its position. (L2-REQ-067)

### Performance

- **AC-18** Given the bar, when the route changes from `/dashboard` to `/documents`, then only the `aria-current` and `.active` of "Home" and "Documents" change and no other item re-renders or shifts (`OnPush` with signal inputs). (L2-REQ-053)

## Implementation notes

- Folder `frontend/projects/components/src/lib/bottom-tab-bar/`: `bottom-tab-bar.component.ts`, `bottom-tab-bar.component.html`, `bottom-tab-bar.component.css`; `NavLink` imported from `../sidebar/nav-link.ts`; export from `public-api.ts`.
- Items render with `routerLink`, `routerLinkActive="active"` and `ariaCurrentWhenActive="page"` so `.active` and `aria-current` always agree.
- The host sets `data-shell` from `shell`; the stylesheet hides the inner `<nav>` with `@media (min-width: 64rem)` for `public` and `@media (min-width: 48.0625rem)` for `admin` (the mocks' `max-width: 768px` inverted), written literally because custom properties cannot appear in media conditions.
- The component stylesheet adds `@media (max-width: 20rem) { .tab-item { flex: 1 1 0; min-width: 0; padding-inline: var(--space-1); } }` (D-6) and `.tab-item .tab-label { text-align: center; }`; the design-system block supplies everything else.
- The existing admin `app-bottom-tab-bar` and `.mobile-only` wrapper in `frontend/projects/admin` are replaced by this component with `shell="admin"` when the shells migrate.
- Composes nothing; composed by neither. The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Where does the bar hide?* Public from 1024 px, admin above 768 px, chosen by `shell`. The app and mocks hide it there; the design-system page and the responsive foundation treat it as phone and tablet navigation only and the sign-in stylesheet already hides it from 1024 px. The two shells dock their sidebars at different widths and the design system keeps both, so one input selects the breakpoint rather than the component guessing it.
- **D-5** *Is the bar rendered on sign-in, register and forgot-password pages?* No. The member sign-in page no longer renders it; the admin sign-in mocks still do on phones, linking to pages that need a session; the navigation pattern treats those pages as shell-free and the design system omits the bar. Those pages simply do not place the component.
- **D-6** *What happens when five labels do not fit at 320 px?* Items drop their 3.5 rem minimum and share the width equally (`flex: 1 1 0`), and a label wraps to a second line. Hiding or truncating labels is forbidden by the navigation pattern; the default labels fit without this rule, so it only affects translations.
- **D-7** *Sticky or fixed?* Sticky at `--z-sticky`, as the design-system page resolves the mocks' mixed fixed and sticky bars, with the shell reserving 72 px at the bottom of its scrolling region. The component is then the last child of the shell column and never covers content it is not sticky within.
- **D-8** *Does the label span carry a class?* Yes, `.tab-label`, as the admin mocks do; the public mocks and the design-system page use a bare `<span>`. A class on the span changes nothing visually and lets page objects and the stylesheet address the label.
- **D-9** *Does `NavLink` live here or in the sidebar?* In the sidebar folder, imported here. The two components take the same shape, and one definition keeps a route change a single edit for consumers.
