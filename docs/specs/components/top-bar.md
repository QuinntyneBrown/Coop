# Top bar

| Field | Value |
|---|---|
| Selector | `coop-top-bar` |
| Library path | `frontend/projects/components/src/lib/top-bar/` |
| Status | planned |
| Traces to | L2-REQ-038, L2-REQ-054, L2-REQ-066, L2-REQ-067 |
| Design system | [`top-bar.html`](../../design-system/components/top-bar.html) |
| Source mocks | [`pages/public-dashboard/default`](../../mocks/pages/public-dashboard/default.html), [`pages/public-maintenance/default`](../../mocks/pages/public-maintenance/default.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`notifications/admin-dashboard-unread/info`](../../mocks/notifications/admin-dashboard-unread/info.html), [`pages/admin-users/default`](../../mocks/pages/admin-users/default.html), [`pages/admin-roles/default`](../../mocks/pages/admin-roles/default.html), [`pages/public-landing/default`](../../mocks/pages/public-landing/default.html), [`pages/admin-landing/default`](../../mocks/pages/admin-landing/default.html) |
| Rendering | [`top-bar.html`](top-bar.html) |

## Purpose and scope

The top bar is the sticky strip across the top of a screen. It names where the person is (the co-op's name "OWN Housing Co-op" in the member app and on the marketing site, the page title in the admin app) and holds a few global actions: the notification bell, the menu button that opens the [sidebar](sidebar.md) drawer, and whatever the page projects beside them (the admin search bar, the marketing site's "Sign In" link and "Member Login" button). It is a banner landmark, not navigation: page destinations belong in the [sidebar](sidebar.md) or the [bottom tab bar](bottom-tab-bar.md).

Use something else instead when:

- the row names a section inside a page and carries its primary action: the page header (`.page-header`), owned by the page;
- the control is a page destination: [sidebar](sidebar.md) or [bottom tab bar](bottom-tab-bar.md).

Out of scope:

- The drawer itself. The [sidebar](sidebar.md) owns opening, focus trapping and closing; this component only renders the hamburger, reflects `menuExpanded` and emits `menuToggled`.
- What the bell opens. The mocks have no notification list (navigation pattern: "not implemented"); the component emits `notificationsOpened` and the page decides.
- The shell's `scroll-padding-top`. The shell sets it to the bar's height so a sticky bar never covers a focused element (accessibility foundation, WCAG 2.4.11); the bar's height is 4 rem plus the hairline.
- The search bar's behaviour: [search bar](search-bar.md), projected into the actions slot.

## Usage

Every `.top-bar`, `.topbar`, `.landing-navbar` and `.navbar` in `docs/mocks` (76 uses on 29 screens) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| every member shell screen: `pages/public-dashboard/*`, `public-maintenance/*`, `public-documents/*`, `public-messaging/*`, `public-profile/*`, `dialogs/public-*`, `notifications/public-profile-saved` | `title="OWN Housing Co-op"`, `notifications`, `menuControls="member-nav"`, `[menuExpanded]` | logo mark + "OWN Housing Co-op"; bell "Notifications"; hamburger "Open menu" | menu collapsed on every mock; hamburger shown below 1024 px (the mocks leave it visible at every width: drift) | surface, sticky over the canvas |
| `pages/admin-dashboard/*`, `notifications/admin-dashboard-unread/info` | `title="Dashboard"`, `heading`, `notifications`, `unreadCount` 2, `notificationsLabel="Notifications, 2 unread"` | logo mark + `<h1>` "Dashboard"; `[slot=actions]` search bar; bell with badge "2" | unread count; the mocks also show a hamburger that opens nothing (D-6) | surface at the top of the main column |
| `pages/admin-users/*`, `admin-roles/*`, `admin-assets/*`, `admin-invitations/*`, `admin-settings/*` and their dialogs and notifications (`.topbar`) | `title="Users"` etc., `heading`, `logoIcon` null, `notifications` | `<h1>` "Users" / "Roles & Privileges" / "Digital Assets" / "Invitations" / "Settings"; `[slot=actions]` search bar; bell | no count | surface at the top of the main column |
| `pages/public-landing/default` (`.landing-navbar`), `pages/admin-landing/default` (`.navbar`) | `title="OWN Housing Co-op"` | `[slot=actions]`: "Sign In" text link and a primary [button](button.md) link "Get Started" / "Register"; L2-REQ-066 names this button "Member Login" (D-7) | no bell, no hamburger | surface, sticky above the hero |

Every row is buildable with the API below: a title that may be the page heading, an optional logo mark, an optional bell with count, an optional hamburger bound to a drawer, and one projection slot for page-specific actions.

## Anatomy

1. **Bar** — `.top-bar` on a `<header>`. Sticky at `top: 0`, `--z-sticky`, `--color-bg-surface`, hairline bottom border `--color-border-default`.
2. **Inner row** — `.top-bar-inner`. Flex row, space between, centred, `max-width: --layout-container-max` (1440 px), `--space-3` by `--space-4` padding; wraps onto a second row when the actions do not fit (D-8).
3. **Logo lockup** — `.logo`: an optional `.logo-icon` mark (1.75 rem square on `--color-brand`, Material icon from `logoIcon`, `aria-hidden="true"`) and `.logo-text` holding `title`, rendered as `<h1>` when `heading` is true, else `<span>`.
4. **Actions** — `.top-bar-actions`. Flex row, `--space-2` gap, in this order: projected `[slot=actions]` content, the bell, the hamburger.
5. **Bell** — a [`coop-icon-button`](icon-button.md) (`icon="notifications"`, `label` from `notificationsLabel`, `count` from `unreadCount`), which renders `<button class="icon-btn">` with a `.notification-badge` when the count is above zero.
6. **Hamburger** — a [`coop-icon-button`](icon-button.md) (`icon="menu"`, `label` from `menuLabel`, `expanded` from `menuExpanded`, `controls` from `menuControls`), which renders `<button class="icon-btn" type="button">` with `aria-expanded` and `aria-controls`; rendered only when `menuControls` is set and hidden at 1024 px and wider (D-5).

Host: `coop-top-bar` is `display: contents`; the `<header class="top-bar">` is its only child and carries every class and attribute.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | The `.logo-text`: "OWN Housing Co-op" on member and marketing screens, the page title ("Users") on admin screens. |
| `heading` | `boolean` | `false` | no | Renders the title as `<h1 class="logo-text">`. Admin screens set it; the page then has no other `h1` (accessibility foundation: one `h1` per page). |
| `logoIcon` | `string \| null` | `'apartment'` | no | Material Icons ligature inside `.logo-icon`; `null` omits the mark (the admin page bars show the title alone). |
| `notifications` | `boolean` | `false` | no | Renders the bell. |
| `notificationsLabel` | `string` | `'Notifications'` | no | The bell's full accessible name. When unread messages exist the consumer passes the count in it: "Notifications, 2 unread" (D-9). |
| `unreadCount` | `number \| null` | `null` | no | Shown in `.notification-badge` on the bell; `null` or `0` shows no badge. Counts above 99 are the consumer's to format ("99+"). |
| `menuControls` | `string \| null` | `null` | no | The `id` of the sidebar drawer. When set the hamburger renders with `aria-controls` equal to it. |
| `menuExpanded` | `boolean` | `false` | no | `aria-expanded` on the hamburger; bind it to the sidebar's `open`. |
| `menuLabel` | `string` | `'Open menu'` | no | `aria-label` of the hamburger; constant while `aria-expanded` carries the state. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `notificationsOpened` | `void` | The bell is activated by pointer or keyboard. |
| `menuToggled` | `boolean` (the requested state, `!menuExpanded`) | The hamburger is activated. The consumer sets the sidebar's `open` and this bar's `menuExpanded` to the payload. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `[slot=actions]` | Links, [buttons](button.md), the [search bar](search-bar.md) | Projected once into `.top-bar-actions` before the bell. When `menuControls` is set, the slot is hidden below 1024 px because the drawer carries the same links (L2-REQ-067 AC2); without a hamburger it stays visible at every width. |

Translation: `title`, `notificationsLabel` and `menuLabel` are inputs and the slot is the consumer's; the component holds no copy (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| App bar | `.top-bar` with `.logo-icon`, bell and hamburger | Member app screens: brand plus global actions. |
| Page bar | `.top-bar` with `heading`, usually `logoIcon` null, search in the slot, bell | Admin screens: the page title as the `h1`. |
| Marketing bar | `.top-bar` with the slot only | Landing page and, per L2-REQ-076 AC1, the login and register pages: "Sign In" and the primary call to action. |

One class list for all three; the mocks' `.topbar`, `.top-bar-left`, `.top-bar-right`, `.topbar-left`, `.topbar-right` and `.notification-btn` are retired (D-4).

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One | — | 4 rem (2.5 rem `--icon-btn-size` plus two `--space-3`) plus the hairline | `--space-3` by `--space-4` | `--text-h3` title |

Width is the viewport; the inner row is capped at `--layout-container-max` and centred.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Surface, hairline rule, sticky | `banner` landmark |
| Bell hover | `:hover` on `.icon-btn` | `--color-bg-subtle` fill over `--duration-base` | — |
| Bell focus | `:focus-visible` | Shared ring `--focus-ring-width` `--color-focus-ring` at `--focus-ring-offset` | — |
| Bell active | `:active` | `--color-bg-subtle-hover` fill | — |
| Unread | `unreadCount` > 0 | `.notification-badge`: 1.25 rem circle, `--color-danger-solid` fill, `--color-fg-on-danger` digits at `--font-size-xs`, top-right of the bell | Name "Notifications, 2 unread" |
| Menu collapsed | `menuExpanded` false | Hamburger `menu` icon | `aria-expanded="false"` |
| Menu expanded | `menuExpanded` true | Same icon; the drawer is open beside it | `aria-expanded="true"` |
| Hamburger hidden | 1024 px and wider | Hamburger not rendered; slot content shown | Not in the tree |
| Stuck | page scrolled | Same look; the bar stays at the top at `--z-sticky` | — |

The bar itself has no disabled, loading or error state. The bell's disabled state is the icon button's and is never used here.

## Markup

```html
<!-- rendered: member app bar, below 1024 px -->
<header class="top-bar">
  <div class="top-bar-inner">
    <div class="logo"><svg class="logo-icon" width="28" height="28" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="#B4502A"></rect><circle cx="17" cy="27" r="8" fill="#F6A98A"></circle><circle cx="31" cy="27" r="8" fill="#F0B35A"></circle><circle cx="24" cy="17" r="8" fill="#FBF7F0"></circle></svg><span class="logo-text">OWN Housing Co-op</span></div>
    <div class="top-bar-actions">
      <button class="icon-btn" type="button" aria-label="Notifications"><span class="material-icons" aria-hidden="true">notifications</span></button>
      <button class="icon-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="member-nav"><span class="material-icons" aria-hidden="true">menu</span></button>
    </div>
  </div>
</header>
```

```html
<!-- rendered: admin page bar with search and an unread count -->
<header class="top-bar">
  <div class="top-bar-inner">
    <div class="logo"><h1 class="logo-text">Users</h1></div>
    <div class="top-bar-actions">
      <div class="search-bar"><span class="material-icons" aria-hidden="true">search</span><input type="search" aria-label="Search" placeholder="Search..."></div>
      <button class="icon-btn" type="button" aria-label="Notifications, 2 unread"><span class="material-icons" aria-hidden="true">notifications</span><span class="notification-badge" aria-hidden="true">2</span></button>
    </div>
  </div>
</header>
```

```html
<!-- rendered: marketing bar -->
<header class="top-bar">
  <div class="top-bar-inner">
    <div class="logo"><svg class="logo-icon" width="28" height="28" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="#B4502A"></rect><circle cx="17" cy="27" r="8" fill="#F6A98A"></circle><circle cx="31" cy="27" r="8" fill="#F0B35A"></circle><circle cx="24" cy="17" r="8" fill="#FBF7F0"></circle></svg><span class="logo-text">OWN Housing Co-op</span></div>
    <div class="top-bar-actions">
      <a href="/login">Sign In</a>
      <a class="btn btn-primary" href="/register">Get Started</a>
    </div>
  </div>
</header>
```

The admin dashboard bar adds the `.logo-icon` mark before its `<h1>`; the expanded hamburger differs only by `aria-expanded="true"`.

```html
<!-- consumer -->
<coop-top-bar title="OWN Housing Co-op" notifications menuControls="member-nav" [menuExpanded]="menuOpen()" (menuToggled)="menuOpen.set($event)" (notificationsOpened)="openNotifications()"></coop-top-bar>
<coop-top-bar title="Users" heading [logoIcon]="null" notifications [unreadCount]="unread()" [notificationsLabel]="unreadLabel()">
  <coop-search-bar slot="actions" label="Search" placeholder="Search..."></coop-search-bar>
</coop-top-bar>
<coop-top-bar title="OWN Housing Co-op">
  <a slot="actions" routerLink="/login">Sign In</a>
  <coop-button slot="actions" variant="primary" href="/register">Get Started</coop-button>
</coop-top-bar>
```

The classes and attributes above are part of the contract: the e2e page objects locate the bar by `.top-bar`, the buttons by their accessible names, and the count by `.notification-badge`.

## Design

- Surface `--color-bg-surface`; bottom rule `--border-width-hairline` solid `--color-border-default`; `position: sticky; top: 0`; layer `--z-sticky`.
- Inner row `max-width: --layout-container-max`, `margin: 0 auto`, padding `--space-3` by `--space-4`, `flex-wrap: wrap`, row gap `--space-2`.
- Logo gap `--space-2`; mark 1.75 rem, `--radius-sm`, `--color-brand` fill, `--color-fg-inverse` glyph; title `--text-h3` in `--color-fg-default`, no margin when it is an `<h1>`.
- Actions gap `--space-2`; `.top-bar-actions` and each of its projected children have `min-width: 0` so a projected search bar shrinks to the space left instead of overflowing (D-8); icon buttons keep their `--icon-btn-size` (2.5 rem) square, `--radius-sm`, and never shrink; badge 1.25 rem, `--radius-full`, `--font-size-xs`, inset `--space-1` from the button's top-right.
- Transitions: icon-button `background-color` over `--duration-base` with `--ease-standard`. Nothing else moves; the bar does not hide on scroll.

Component tokens: none of its own. The bell uses the icon button's `--icon-btn-size`; the bar reads semantic tokens directly.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Surface | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Bottom rule | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Title and icons | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Logo mark fill | `--color-brand` | `--palette-green-500` | `--palette-green-500` |
| Logo glyph | `--color-fg-inverse` | `--palette-white` | `--palette-white` |
| Icon-button hover fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Icon-button active fill | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-200` |
| Badge fill | `--color-danger-solid` | `--palette-red-600` | `--palette-red-600` |
| Badge digits | `--color-fg-on-danger` | `--palette-white` | `--palette-white` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Title; bell and menu glyphs (icons, 3:1 would suffice) |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Glyph on a hovered icon button |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | Glyph on a pressed icon button |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Badge digits |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Badge edge against the bar |
| `--color-brand` | `--color-bg-surface` | 3:1 | Logo mark (non-text) |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the bar |

The bottom rule is decorative and exempt from 1.4.11. Under `forced-colors: active` the ring becomes `Highlight` and the rule `CanvasText` (tokens.css); the badge keeps its digits, so the count survives without colour.

## Responsive behaviour

- Sticky at every width; the inner row fills the width up to `--layout-container-max` (1440 px) and centres beyond it (L2-REQ-066 AC1).
- Below `--layout-breakpoint-lg` (1024 px) with `menuControls` set: the hamburger renders and the `[slot=actions]` content is hidden; the bar shows logo, title and hamburger (L2-REQ-067 AC1, AC2). At 1024 px and wider the hamburger is not rendered and the slot content shows (L2-REQ-066 AC3, AC4); in the member shell the bar sits above the main column beside the docked sidebar, shows the bell at the right and hides its logo lockup, which the sidebar already shows.
- Without `menuControls` (admin page bars, marketing bar today) the slot content shows at every width.
- At 320 px the logo and two icon buttons fit on one row; longer slot content (the admin search bar beside "Roles & Privileges") wraps onto a second row inside `.top-bar-inner`, and a projected search bar shrinks to the row's remaining width (its input is `flex: 1; min-width: 0` in the design system) rather than overflowing (D-8). Nothing scrolls horizontally, and at 400 % zoom the bell and hamburger stay reachable (AGENTS.md reflow rule; WCAG 1.4.10).
- The title wraps rather than truncates; at 320 px "Roles & Privileges" occupies two lines of `--text-h3`.
- Targets: icon buttons are 40 px square with `--space-2` between them, above the 24 px `--target-min` (accessibility foundation).

## Accessibility

### Role and pattern

A native `<header>` as the page's `banner` landmark (it is a direct child of the shell, not nested in `<main>`). The hamburger is a [disclosure button](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): `aria-expanded` reflects the drawer and `aria-controls` names it. The bell is a plain button. No `role="navigation"`: page links live in the sidebar and tab bar.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the projected links and controls, then the bell, then the hamburger, in DOM order. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates the focused button: `notificationsOpened` or `menuToggled`. |
| <kbd>Esc</kbd> | Nothing here; the open drawer handles it and returns focus to the hamburger ([sidebar](sidebar.md)). |

### Focus

Focus lands on the native buttons and projected controls, never on the host. The shared ring shows on `:focus-visible` and is not clipped: the bar has no `overflow: hidden`. Because the bar is sticky, the shell sets `scroll-padding-top` to the bar's height so an element scrolled into view by focus is never under it (WCAG 2.4.11). After the drawer closes, focus returns to the hamburger, which is still rendered because the drawer only exists below 1024 px, where the hamburger is shown.

### Labelling

- Icon-only buttons take their names from `notificationsLabel` ("Notifications", "Notifications, 2 unread") and `menuLabel` ("Open menu"); the mocks' page-prefixed names ("dashboard hamburger menu") are drift.
- The badge is `aria-hidden="true"`; the count is in the bell's name, so it is read once.
- The title is visible text; as an `<h1>` it is the page's heading and the `banner` landmark takes no extra label.
- `aria-controls` points at the sidebar's `id`; `aria-expanded` is `"true"` only while the drawer is open.

### Announcements

None. A change in `unreadCount` updates the bell's name silently; the messaging page's own status region announces new messages if the product adds one.

### Motion

Only the icon buttons' `background-color` transitions, over `--duration-base`; under `prefers-reduced-motion: reduce` tokens.css shortens it to 0.01 ms. The bar never animates its position.

## Content and internationalisation

- Title: the co-op's name "OWN Housing Co-op" in the member app and on the marketing site; the page title in Title Case on admin screens ("Dashboard", "Users", "Roles & Privileges", "Digital Assets", "Invitations", "Settings"), the same words as the sidebar label where one exists.
- Action names name the action, not the icon: "Notifications", "Open menu"; never "Bell" or "Hamburger". With a count: "Notifications, 2 unread".
- The badge shows a bare number ("2"); the consumer caps it ("99+") if ever needed.
- Marketing actions: "Sign In" as a text link and one primary button; the mocks say "Get Started" / "Register", L2-REQ-066 says "Member Login" (D-7).
- Translatable inputs: `title`, `notificationsLabel`, `menuLabel`; the slot content is the consumer's. Data values: `unreadCount`, `logoIcon`, `menuControls`.
- Long strings: a French admin title ("Rôles et privilèges") and label ("Notifications, 2 non lues") about 30 % longer wrap and extend the bar's height; the badge keeps one line.

## Performance

- Change detection: `OnPush`, signal inputs; the hamburger's presence and the slot's visibility come from a `computed` over `menuControls` and the LG breakpoint signal.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the bar is 4 rem tall from first paint; the badge is absolutely positioned so a count appearing shifts nothing; wrapping of slot content happens at render, not after data loads.
- Weight: imports `@angular/core`, `@angular/common` and `@angular/cdk/layout` (`BreakpointObserver`); composes [`coop-icon-button`](icon-button.md). No router dependency (projected links bring their own).

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-top-bar title="OWN Housing Co-op" notifications menuControls="member-nav">` at 375 px, when it renders, then the DOM holds `<header class="top-bar">` with a `.top-bar-inner` containing a `.logo` (`.logo-icon` three-circle mark and `.logo-text` "OWN Housing Co-op") and `.top-bar-actions` holding a "Notifications" button and an "Open menu" button, in that order. (L2-REQ-067)
- **AC-2** Given the member bar at 1024 px and at 1440 px, when measured, then the `<header>` spans the main column beside the docked sidebar (it is never drawn under the sidebar, so the bell stays visible and can be pressed), has a `--color-bg-surface` background and a `--color-border-default` bottom border, and `.top-bar-inner` is at most 1440 px wide and horizontally centred. (L2-REQ-066)
- **AC-3** Given the marketing bar with `title="OWN Housing Co-op"`, when it renders, then the `.logo-icon` is the co-op's three-circle mark and the `.logo-text` reads "OWN Housing Co-op" in `--text-h3`. (L2-REQ-066)
- **AC-4** Given `title="Users"`, `heading` and `[logoIcon]="null"`, when it renders, then `.logo` contains `<h1 class="logo-text">Users</h1>` and no `.logo-icon`, and the page has exactly one `h1`. (L2-REQ-054)
- **AC-5** Given a "Sign In" link and a primary "Get Started" button projected into `[slot=actions]` with no `menuControls`, when the marketing bar renders at 1440 px, then both appear inside `.top-bar-actions` at the far right of the bar, the button last. (L2-REQ-066)
- **AC-6** Given `notifications` and `[unreadCount]="2"` with `notificationsLabel="Notifications, 2 unread"`, when it renders, then the bell shows a `.notification-badge` reading "2" with a `--color-danger-solid` fill and its accessible name is "Notifications, 2 unread". (L2-REQ-038)
- **AC-7** Given `notifications` with `unreadCount` `null` or `0`, when it renders, then no `.notification-badge` exists and the bell's name is "Notifications". (L2-REQ-038)

### States

- **AC-8** Given `menuControls="member-nav"` and `menuExpanded` false, when the hamburger renders, then it is `<button class="icon-btn" type="button">` with `aria-label="Open menu"`, `aria-expanded="false"` and `aria-controls="member-nav"`. (L2-REQ-067)
- **AC-9** Given `menuExpanded` becomes true, when the hamburger re-renders, then `aria-expanded` is `"true"` and the label is unchanged. (L2-REQ-067)
- **AC-10** Given the collapsed hamburger, when it is pressed, then `menuToggled` emits `true`, and when pressed again while `menuExpanded` is true it emits `false`. (L2-REQ-067)
- **AC-11** Given the bell, when it is hovered and then focused by keyboard, then its fill changes to `--color-bg-subtle` over `--duration-base` and the `--focus-ring-width` `--color-focus-ring` ring shows unclipped. (L2-REQ-066)
- **AC-12** Given the bell, when it is activated by pointer, <kbd>Enter</kbd> or <kbd>Space</kbd>, then `notificationsOpened` emits once per activation. (L2-REQ-038)

### Keyboard and focus

- **AC-13** Given the admin page bar with a search bar in the slot, when <kbd>Tab</kbd> is pressed from the skip link, then focus visits the search input, then the bell, in that order, and each shows the shared ring. (L2-REQ-054)
- **AC-14** Given the sticky member bar and a page scrolled so a link sits just under it, when that link receives focus with the shell's `scroll-padding-top` equal to the bar's height, then the link is scrolled fully below the bar and is not obscured. (L2-REQ-066)

### Screen readers

- **AC-15** Given the member bar, when read with a screen reader, then it is a banner landmark containing two buttons named "Notifications" and "Open menu", and no icon ligature text ("notifications", "menu") is announced. (L2-REQ-067)
- **AC-16** Given `unreadCount` changes from 0 to 2 and the consumer updates `notificationsLabel`, when the bell is queried again, then its name is "Notifications, 2 unread" and the badge text is not announced separately. (L2-REQ-038)

### Theming

- **AC-17** Given any variant, when the page sets `data-theme="dark"`, then the bar renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-066)

### Responsive

- **AC-18** Given a bar titled "OWN Housing Co-op" with `menuControls="member-nav"` and a "Sign In" link projected into `[slot=actions]`, when the viewport is 375, 640 and 768 px, then the bar shows the logo, "OWN Housing Co-op" and the hamburger, and the projected "Sign In" is not rendered or focusable. (L2-REQ-067)
- **AC-19** Given the same bar, when the viewport is 1024 px, then the hamburger is not rendered and the projected "Sign In" is visible and focusable. (L2-REQ-066)
- **AC-20** Given the admin bar titled "Roles & Privileges" with the search bar in the slot at 320 px, when measured, then the actions wrap onto a second row inside `.top-bar-inner`, the title wraps rather than truncates and the page does not scroll horizontally. (L2-REQ-054)
- **AC-21** Given the member bar at 320 px and 400 % zoom, when measured, then the bell and the hamburger are each at least 40 × 40 CSS px, visible and activatable. (L2-REQ-067)

### Motion

- **AC-22** Given `prefers-reduced-motion: reduce`, when the bell is hovered, then its fill changes with a 0.01 ms transition and the bar's position never animates. (L2-REQ-066)

### Performance

- **AC-23** Given the admin dashboard bar, when `unreadCount` changes from 2 to 3, then only the badge text and the bell's name update and the title, search bar and layout do not re-render or shift (`OnPush` with signal inputs). (L2-REQ-038)

## Implementation notes

- Folder `frontend/projects/components/src/lib/top-bar/`: `top-bar.component.ts`, `top-bar.component.html`, `top-bar.component.css`; export from `public-api.ts`.
- One `<ng-content select="[slot=actions]">` inside `.top-bar-actions`; the bell is `<coop-icon-button icon="notifications" [label]="notificationsLabel()" [count]="unreadCount()" (click)="notificationsOpened.emit()">`; the hamburger is `<coop-icon-button icon="menu" [label]="menuLabel()" [expanded]="menuExpanded()" [controls]="menuControls()" (click)="menuToggled.emit(!menuExpanded())">` (D-10).
- `showMenu = computed(() => menuControls() !== null && !matchesLg())` with `matchesLg` from `BreakpointObserver.observe('(min-width: 64rem)')`; the slot wrapper gets `hidden` when `showMenu()` is true, so hidden links leave the tab order.
- `.top-bar-inner { flex-wrap: wrap; row-gap: var(--space-2); }`, `.top-bar-actions { min-width: 0; }`, `.top-bar-actions > :not(.icon-btn, coop-icon-button) { min-width: 0; }` and `.top-bar-actions .icon-btn { flex-shrink: 0; }` are added in the component stylesheet (D-8); the design-system rule has no wrap.
- The `<h1>`/`<span>` choice is an `@if` on `heading()` around the same `.logo-text` content.
- `@angular/cdk` is not yet in `frontend/package.json`; the first slice adds it at the workspace's Angular major.
- Composes [`coop-icon-button`](icon-button.md); pages project [`coop-search-bar`](search-bar.md) and [`coop-button`](button.md); drives the [sidebar](sidebar.md) through `menuToggled`. The existing e2e page objects find the bell and hamburger by `data-testid`; when the shells adopt this component they locate them by role and name instead. The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *One markup for the public `.top-bar`, the admin `.topbar` and the landing navbars?* Yes. The design-system page gives the two bars one rule and says they differ only in content; the landing navbar has the same surface, rule and stickiness. `.topbar`, `.topbar-left/-right`, `.top-bar-left/-right`, `.notification-btn`, `.landing-navbar`, `.navbar`, `.nav-inner`, `.nav-logo` and `.nav-links` are retired in favour of `.top-bar`, `.top-bar-inner`, `.logo` and `.top-bar-actions`.
- **D-5** *Is the hamburger shown at 1024 px and wider?* No. The mocks leave it visible at every width (drift noted on the design-system page); the responsive foundation requires the hamburger only where the sidebar is not shown, and the public sidebar docks at 1024 px. The hamburger is not rendered there, so `aria-controls` never points at a docked sidebar.
- **D-6** *Does the admin dashboard bar get a hamburger?* No. The admin mocks show one that opens nothing (navigation pattern: no mock captures a menu opening), and the accessibility foundation says not to present a control unless it works. Admin bars render the bell and the projected search only; a hamburger returns if an admin drawer is specified ([sidebar](sidebar.md) D-4).
- **D-7** *"Member Login" or "Get Started" / "Sign In"?* The component does not decide: the marketing actions are projected by the landing page. L2-REQ-066 AC3 and AC4 name CMS links (Home, About, Amenities, Bylaws, Contact) and a "Member Login" button; the mocks show "Sign In" and "Get Started" / "Register" and no CMS links. The slot renders whichever the page projects, and the hamburger-and-drawer rule (L2-REQ-067 AC2, AC3) applies to it as soon as the page passes `menuControls`. Resolving the copy and adding the CMS links is an `engineering-requirements` and mock change, not a component one.
- **D-8** *What happens when the actions do not fit beside the title?* `.top-bar-inner` wraps and the actions move to a second row, right-aligned, with `--space-2` between rows; `.top-bar-actions` and its direct children get `min-width: 0` so the projected search bar shrinks to that row (an `<input>` otherwise holds its intrinsic 20-character width and the admin actions measure about 309 px). The admin search bar beside a long title would otherwise overflow at 320 px (77 admin mocks already overflow on phones; the responsive foundation requires reflow at 320 px).
- **D-9** *Who composes "Notifications, 2 unread"?* The consumer, through `notificationsLabel`. Composing it inside the component would hard-code "unread" and its plural, which the content rule forbids; the badge shows the bare count.
- **D-10** *Is the hamburger a `coop-icon-button`?* Yes. The [icon button](icon-button.md) API carries `expanded` and `controls`, which render the `aria-expanded` and `aria-controls` the disclosure pattern requires, so both the bell (with `count`) and the hamburger compose the same component and the rendered DOM is identical to the markup above.
- **D-11** *Is the logo a link?* No. No mock links it, L2-REQ-066 AC3 lists "Home" among the navigation links, and a second route to home would duplicate it.
