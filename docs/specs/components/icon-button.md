# Icon button

| Field | Value |
|---|---|
| Selector | `coop-icon-button` |
| Library path | `frontend/projects/components/src/lib/icon-button/` |
| Status | planned |
| Traces to | L2-REQ-002, L2-REQ-003, L2-REQ-016, L2-REQ-034, L2-REQ-038, L2-REQ-064, L2-REQ-067 |
| Design system | [`icon-button.html`](../../design-system/components/icon-button.html) |
| Source mocks | [`pages/admin-users/default`](../../mocks/pages/admin-users/default.html), [`pages/admin-documents/default`](../../mocks/pages/admin-documents/default.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`notifications/admin-dashboard-unread/info`](../../mocks/notifications/admin-dashboard-unread/info.html), [`pages/public-dashboard/default`](../../mocks/pages/public-dashboard/default.html), [`pages/admin-assets/default`](../../mocks/pages/admin-assets/default.html), [`dialogs/admin-document-viewer/default`](../../mocks/dialogs/admin-document-viewer/default.html), [`dialogs/public-document-viewer/default`](../../mocks/dialogs/public-document-viewer/default.html), [`dialogs/public-maintenance-create/default`](../../mocks/dialogs/public-maintenance-create/default.html), [`pages/public-messaging/chat`](../../mocks/pages/public-messaging/chat.html), [`pages/admin-messaging/chat`](../../mocks/pages/admin-messaging/chat.html), [`pages/public-profile/default`](../../mocks/pages/public-profile/default.html) |
| Rendering | [`icon-button.html`](icon-button.html) |

## Purpose and scope

An icon button is a square, text-free button for an action whose glyph is universally understood and whose space is tight: the notification bell and the menu button in the top bar, edit and delete at the end of a table row or document card, the close button of a viewer or form dialog, the back button from a conversation on phones, and the upload button beside a profile avatar. The glyph is a Material Icons ligature; the accessible name is always an explicit label.

Use something else instead when:

- the action needs a visible word to be understood ("Add User", "Delete" in a confirmation): [button](button.md), which also renders the icon-only "send" submit because that one lives in a form;
- the control filters a list and stays pressed: [filter chips](filter-chips.md);
- the control is a navigation destination: [sidebar](sidebar.md) or [bottom tab bar](bottom-tab-bar.md).

Out of scope:

- Showing and hiding the hamburger by viewport, the drawer it opens, and the `Esc` that closes the drawer. The [top bar](top-bar.md) and [sidebar](sidebar.md) own them; this component only exposes `aria-expanded` and `aria-controls`.
- Hiding the back button above 768 px and swapping the conversation panes. The messaging page owns that.
- The "Confirm Delete" dialog an edit or delete button opens, and the return of focus to the button when the dialog closes: [dialog](dialog.md).
- The file chooser the avatar upload button opens. The profile page owns the hidden `<input type="file" accept="image/*">`; the button only emits its click.
- The notification list behind the bell. No mock renders one and the bell has no handler in the mocks (navigation pattern page); the component emits a click and shows a count.

## Usage

Every `.icon-btn`, `.notification-btn`, `.back-btn`, `.close-btn` and `.avatar-upload-btn` in `docs/mocks` (174 uses on 81 screens) is one of the configurations below. The mocks draw four of the glyphs as inline SVG and one as the character "×"; the component renders every one as a Material Icons ligature (D-5).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/public-dashboard/*`, `pages/public-maintenance/*`, `pages/public-documents/*`, `pages/public-messaging/*`, `pages/public-profile/*` and their dialogs and notifications, top bar | `icon="notifications"`, `label="Notifications"` | — | default | top bar surface |
| same screens, top bar | `icon="menu"`, `label="Open menu"`, `expanded` false or true, `controls` = the drawer id | — | default, expanded (the drawer open state the mocks never capture) | top bar surface |
| `pages/admin-users/*` table rows | `icon="edit"`, `label="Edit mira.fern"`; `icon="delete"`, `label="Delete mira.fern"` | — | default, hover, focus | card (table) |
| `pages/admin-documents/*` and the document dialogs, card toolbar (`.delete-doc-btn`) | `icon="delete"`, `label="Delete Autumn courtyard gathering"` | — | default | card |
| `dialogs/admin-document-viewer/default`, `dialogs/public-document-viewer/default`, `.modal-header` | `icon="close"`, `label="Close"` | — | default | dialog |
| `dialogs/public-maintenance-create/*`, `dialogs/public-maintenance-detail/*`, dialog header (`.close-btn` "×") | `icon="close"`, `label="Close"` | — | default | dialog |
| `pages/public-messaging/chat`, `pages/admin-messaging/chat`, chat header (`.back-btn`) | `icon="arrow_back"`, `label="Back to conversations"` | — | default | surface |
| `pages/public-profile/*`, `dialogs/public-profile-switcher/default`, `notifications/public-profile-saved/success`, avatar section (`.avatar-upload-btn`) | `icon="upload"`, `label="Upload photo"` | — | default | card |

Every row is buildable with the API below: one look, a required glyph and label, an optional count with its spoken form, and the disclosure and toggle attributes for the menu button.

## Anatomy

1. **Container** — `.icon-btn`. Inline-flex, centred, `--icon-btn-size` (2.5rem) minimum width and height, no padding, no border, transparent fill, `--radius-sm` corners, `position: relative` so the count badge can anchor to it.
2. **Glyph** — `<span class="material-icons" aria-hidden="true">` holding the ligature from `icon`, at the default `--icon-size` (1.5rem), `currentColor`.
3. **Count badge (optional)** — `<span class="notification-badge" aria-hidden="true">` at the top-right corner (`--space-1` from each edge), 1.25rem minimum width and height, `--radius-full`, `--color-danger-solid` fill, `--color-fg-on-danger` text at `--font-size-xs`. Rendered only when `count` is 1 or more.
4. **Accessible name** — `aria-label` from `label`, with `countLabel` appended when the badge shows. There is no visible text.

Host: `coop-icon-button` is `display: inline-flex` and carries no classes of its own; `.icon-btn` and every attribute go on the inner native `<button type="button">`. Consumer hooks such as the top bar's `hamburger` class go on the host, never on the inner button (D-4). The host forwards `click` only when the control is not disabled (`pointer-events: none` on the host while disabled).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `icon` | `string` | — | yes | A Material Icons ligature from the iconography catalog (`notifications`, `menu`, `edit`, `delete`, `close`, `arrow_back`, `upload`). Rendered as the glyph span. |
| `label` | `string` | — | yes | The accessible name (`aria-label`): a verb and, in a row, its object ("Edit mira.fern"), or the purpose of a toolbar icon ("Notifications", "Open menu"). Never the glyph name. |
| `disabled` | `boolean` | `false` | no | Native `disabled`; removed from the tab order; opacity 0.5; hover and active change nothing. |
| `count` | `number \| null` | `null` | no | When 1 or more, renders the count badge; 100 or more renders "99+" (D-8). `null` and 0 render no badge. |
| `countLabel` | `string \| null` | `null` | when `count` can be 1 or more | The spoken form of the count, already pluralised by the consumer ("2 unread"). Appended to the name as "Notifications, 2 unread" while the badge shows (D-7). |
| `expanded` | `boolean \| null` | `null` | no | When not `null`, sets `aria-expanded` for a disclosure button (the menu button). The name does not change with the state (D-9). |
| `controls` | `string \| null` | `null` | when `expanded` is set | The id of the element the button discloses, rendered as `aria-controls`. |
| `pressed` | `boolean \| null` | `null` | no | When not `null`, sets `aria-pressed` for a toggle button. No mock uses a toggle; the input exists for the shared contract (D-12). `expanded` and `pressed` are never both set. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs. There is no `type`, `href` or `size` input: every usage is a `type="button"` control of one size (D-11).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | Consumers bind `(click)` on the host; the host suppresses pointer events while disabled and the native `disabled` attribute suppresses keyboard activation. What happens next (open the drawer, open a dialog, open the file chooser, swap the chat panes) belongs to the consumer. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The component is icon-only by definition; the glyph comes from `icon` and the name from `label`. A control that needs visible text is a [button](button.md). |

Translation: `label` and `countLabel` are inputs, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation). The count digits are rendered as given; locale digit formatting is the consumer's.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Default | — | The only look; the glyph alone distinguishes the buttons. The mocks' `.notification-btn`, `.back-btn`, `.close-btn`, `.delete-doc-btn` and `.hamburger` are this variant (D-4). |
| With count | `count` ≥ 1 | The bell when unread notifications exist: the same button plus the `.notification-badge` corner marker. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| Single | — | `--icon-btn-size` = 2.5rem square | 0 (the glyph is centred) | glyph at `--icon-size` = 1.5rem |

The design-system page defines one size and the accessibility foundation names it as the 40 px icon-button target. Width equals height; the count badge overlaps the corner and adds no width.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Transparent fill, `--color-fg-default` glyph | Name = `label` |
| Hover | `:hover` | Fill `--color-bg-subtle` over `--duration-base` | — |
| Focus | `:focus-visible` | Shared ring: `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` | — |
| Active | `:active` | Fill `--color-bg-subtle-hover` | — |
| Disabled | `disabled` | Opacity 0.5, `cursor: not-allowed`, no hover change | Not focusable; exposed as disabled |
| With count | `count` ≥ 1 | `.notification-badge` at the top-right corner | Name = "`label`, `countLabel`"; the badge text itself is hidden |
| Expanded | `expanded` true | No fill of its own; the open drawer is the visible state (D-10) | `aria-expanded="true"`, `aria-controls` |
| Pressed | `pressed` true | No fill of its own (D-10) | `aria-pressed="true"` |

Every state applies to every glyph; the matrix in the rendering is the contract.

## Markup

```html
<!-- rendered: table row actions -->
<button class="icon-btn" type="button" aria-label="Edit mira.fern"><span class="material-icons" aria-hidden="true">edit</span></button>
<button class="icon-btn" type="button" aria-label="Delete mira.fern"><span class="material-icons" aria-hidden="true">delete</span></button>
```

```html
<!-- rendered: bell with two unread -->
<button class="icon-btn" type="button" aria-label="Notifications, 2 unread"><span class="material-icons" aria-hidden="true">notifications</span><span class="notification-badge" aria-hidden="true">2</span></button>
```

```html
<!-- rendered: menu button, drawer closed and open -->
<button class="icon-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="public-drawer"><span class="material-icons" aria-hidden="true">menu</span></button>
<button class="icon-btn" type="button" aria-label="Open menu" aria-expanded="true" aria-controls="public-drawer"><span class="material-icons" aria-hidden="true">menu</span></button>
```

```html
<!-- rendered: viewer close, inside the dialog header -->
<div class="modal-header"><h3 id="viewer-title">Autumn courtyard gathering</h3><button class="icon-btn" type="button" aria-label="Close"><span class="material-icons" aria-hidden="true">close</span></button></div>
```

```html
<!-- rendered: back from a conversation on phones; disabled -->
<button class="icon-btn" type="button" aria-label="Back to conversations"><span class="material-icons" aria-hidden="true">arrow_back</span></button>
<button class="icon-btn" type="button" aria-label="Upload photo" disabled><span class="material-icons" aria-hidden="true">upload</span></button>
```

The bell without unread, the avatar upload button and the document delete button differ only by `icon` and `label`; `pressed` adds only `aria-pressed`.

```html
<!-- consumer -->
<coop-icon-button icon="edit" [label]="'Edit ' + user.username" (click)="openEdit(user)"></coop-icon-button>
<coop-icon-button icon="notifications" label="Notifications" [count]="unread()" [countLabel]="unread() + ' unread'"></coop-icon-button>
<coop-icon-button class="hamburger" icon="menu" label="Open menu" [expanded]="drawerOpen()" controls="public-drawer" (click)="toggleDrawer()"></coop-icon-button>
<coop-icon-button icon="close" label="Close" (click)="dialogRef.close()"></coop-icon-button>
<coop-icon-button icon="upload" label="Upload photo" (click)="fileInput.click()"></coop-icon-button>
```

The classes and attributes above are part of the contract: the e2e page objects locate these controls by `.icon-btn`, `aria-label`, `aria-expanded`, `disabled` and `.notification-badge`.

## Design

- Size `--icon-btn-size` (2.5rem) as both `min-width` and `min-height`; the glyph is centred by flex, so no padding is declared.
- Glyph `--icon-size` (1.5rem) through `.material-icons`; the mocks' 20 px back chevron and 16 px camera are rendered at the standard 1.5rem (D-5).
- Radius `--radius-sm`; no border.
- Transition: `background-color` over `--duration-base` with `--ease-standard`. Nothing moves.
- Count badge: offset `--space-1` from the top and right edges, 1.25rem minimum width and height, `--radius-full`, `--font-size-xs`; it overlaps the glyph's corner and never changes the button's box, so its arrival causes no layout shift.
- Layer: none; the button sits in the flow of its bar, cell or header. The badge is `position: absolute` within the button only.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--icon-btn-size` | 2.5rem | — (one size) |
| `--icon-size` | 1.5rem (declared by `.material-icons`) | — (the button never sets a size modifier) |

The block reads `--color-fg-default`, `--color-bg-subtle`, `--color-bg-subtle-hover`, `--color-danger-solid`, `--color-fg-on-danger` and `--color-focus-ring` directly; it declares no colour tokens of its own.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Glyph | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Fill, hover | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Fill, active | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-200` |
| Count badge fill | `--color-danger-solid` | `--palette-red-600` | `--palette-red-600` |
| Count badge text | `--color-fg-on-danger` | `--palette-white` | `--palette-white` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Glyph on a top bar, card or dialog |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Glyph on the dashboard canvas |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Glyph on the hover fill |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | Glyph on the active fill |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Count on the badge |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Badge edge against the bar |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a bar, card or dialog |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the canvas |

The glyph is a meaningful icon, so 3:1 is the floor (WCAG 1.4.11); the pairs above clear 4.5:1. Disabled glyphs are exempt from contrast. Under `forced-colors: active` the ring becomes `Highlight` (tokens.css); the badge keeps its system `ButtonText` on `ButtonFace` and the component adds no colour of its own.

## Responsive behaviour

- The mocks define no media rule for this component; it is 40 px square at every width (design-system page).
- The public top bar hides the hamburger at 1024 px and wider, where the docked sidebar replaces the drawer, and the messaging page shows the back button at 768 px and narrower; both are the consumer's rules, applied to the host.
- At 320 px the public top bar holds the logo, the bell (with its count) and the menu button on one row: two 40 px buttons with a `--space-2` gap take 88 px, leaving room for the logo without horizontal scrolling. In the users table the action cell keeps both 40 px buttons side by side and the table card scrolls inside itself, never the page.
- At 400 % zoom every icon button stays reachable and operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: 40 × 40 CSS px, above the 24 px `--target-min` and equal to the accessibility foundation's icon-button size. Adjacent icon buttons keep the `--space-2` gap of `.top-bar-actions` or the table cell's own spacing.

## Accessibility

### Role and pattern

Native `<button type="button">`; no ARIA role is added. [WAI-ARIA APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/). With `expanded` set it is a [disclosure button](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) (`aria-expanded`, `aria-controls`); with `pressed` set it is a toggle button (`aria-pressed`).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the button in DOM order. Disabled buttons are skipped. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates it (browser default). |
| <kbd>Esc</kbd> | Not handled here. The drawer and the dialog close themselves and return focus to the button that opened them. |

### Focus

Focus lands on the inner native element, never on the host. The shared ring (`--focus-ring-width` solid `--color-focus-ring`, offset `--focus-ring-offset`) shows on `:focus-visible` and must not be clipped by the top bar's or table card's `overflow`; the count badge sits inside the ring. When the button opens a dialog or drawer, that overlay returns focus to the button on close ([dialog](dialog.md), [sidebar](sidebar.md)). The mocks' `outline: none` is not reproduced.

### Labelling

- `aria-label` is the whole accessible name; there is no visible text, so WCAG 2.5.3 Label in Name does not apply.
- Row actions name the verb and the row: "Edit mira.fern", "Delete mira.fern", "Delete Autumn courtyard gathering" (table page). Toolbar actions name their purpose: "Notifications", "Open menu", "Close", "Back to conversations", "Upload photo". The mocks' review-only labels ("dashboard notification bell", "dashboard hamburger menu", "profile avatar upload btn") are not used.
- The glyph span and the count badge are `aria-hidden="true"`, so a ligature name is never read if the icon font fails.
- With a count, the name is "Notifications, 2 unread" (D-7).
- `aria-expanded` and `aria-controls` on the menu button; `aria-pressed` on a toggle. No `aria-disabled`; the native attribute carries the state.

### Announcements

None by the button. A changing count is reflected in the name on the next focus; it is not announced live (D-7). The drawer, dialog and file chooser announce themselves.

### Motion

Only `background-color` transitions, over `--duration-base`. Under `prefers-reduced-motion: reduce` tokens.css shortens `--duration-base` to 0.01 ms; the component adds no animation.

## Content and internationalisation

- Labels are a verb, optionally with the object: "Edit mira.fern", "Delete mira.fern", "Delete Autumn courtyard gathering", "Upload photo", "Back to conversations"; toolbar icons are labelled by purpose: "Notifications", "Open menu", "Close". Never the glyph name ("delete") and never a test id.
- The count badge shows the number as given ("2") and "99+" from 100 up. `countLabel` is the spoken count, pluralised by the consumer: "1 unread", "2 unread".
- Translatable inputs: `label`, `countLabel`. Data values: the username or title inside a row label, the count.
- Long labels have no visual effect (no visible text); a French label such as "Ouvrir le menu" or "Supprimer mira.fern" changes only the spoken name.

## Performance

- Change detection: `OnPush`, signal inputs; the accessible name and the badge text are `computed` from `label`, `count` and `countLabel`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the box is always 2.5rem square; the count badge is absolutely positioned, so its appearance and disappearance never shift the bar.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK (the drawer and dialog own their overlays), no router.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-icon-button icon="edit" label="Edit mira.fern">` in the row for mira.fern on the users page, when it renders, then the DOM holds `<button class="icon-btn" type="button" aria-label="Edit mira.fern"><span class="material-icons" aria-hidden="true">edit</span></button>`, 40 × 40 CSS px with a transparent fill. (L2-REQ-002)
- **AC-2** Given the "Delete mira.fern" button in the same row, when it is activated, then the host's `click` fires exactly once and the component changes nothing itself; the page opens the "Confirm Delete" dialog. (L2-REQ-003)
- **AC-3** Given the delete button on the "Autumn courtyard gathering" document card with `label="Delete Autumn courtyard gathering"`, when it renders, then its only class is `.icon-btn` (no `.delete-doc-btn`) and its accessible name is "Delete Autumn courtyard gathering". (L2-REQ-034)
- **AC-4** Given the viewer dialog for "Autumn courtyard gathering" with `icon="close" label="Close"` at the end of `.modal-header`, when it renders, then the button is 40 px square, its glyph is the `close` ligature rather than the character "×", and its name is "Close". (L2-REQ-064)
- **AC-5** Given the public "Create Request" dialog whose mock shows a "×" `.close-btn`, when it renders with this component, then the control is `<button class="icon-btn" type="button" aria-label="Close">` with the `close` glyph and the same position in the header. (L2-REQ-064)

### Count

- **AC-6** Given the admin dashboard bell with `count="2"` and `countLabel="2 unread"`, when it renders, then a `.notification-badge` reading "2" sits at the top-right corner inside the button, `--space-1` from each edge, with a `--color-danger-solid` fill and `aria-hidden="true"`, and the button's accessible name is "Notifications, 2 unread". (L2-REQ-038)
- **AC-7** Given the bell with `count` 0 or `null`, when it renders, then no `.notification-badge` exists and the name is exactly "Notifications". (L2-REQ-038)
- **AC-8** Given `count="120"` and `countLabel="120 unread"`, when it renders, then the badge reads "99+" and the name is "Notifications, 120 unread". (L2-REQ-038)
- **AC-9** Given a bell showing no badge, when `count` changes to 2 while the page is open, then the badge appears, the button's box stays 40 × 40 CSS px, nothing in the bar moves and no live region announces the change. (L2-REQ-038)

### Menu button

- **AC-10** Given `<coop-icon-button icon="menu" label="Open menu" [expanded]="false" controls="public-drawer">` in the public top bar at 375 px, when it renders, then it is visible beside the bell with `aria-expanded="false"` and `aria-controls="public-drawer"`. (L2-REQ-067)
- **AC-11** Given the menu button with the drawer closed, when it is activated and the consumer sets `expanded` to true, then `aria-expanded` becomes `"true"`, the name stays "Open menu" and the drawer with the navigation links and "Member Login" is the visible result. (L2-REQ-067)

### Avatar upload

- **AC-12** Given `<coop-icon-button icon="upload" label="Upload photo">` beside the large avatar on the public profile, when it is activated, then the host's `click` fires once and the page opens its hidden `<input type="file" accept="image/*">`; the button itself renders no file input. (L2-REQ-016)

### States

- **AC-13** Given the "Edit mira.fern" button, when it is hovered, then its fill changes to `--color-bg-subtle` over `--duration-base` and the glyph colour does not change. (L2-REQ-002)
- **AC-14** Given the "Delete mira.fern" button, when it is pressed and held, then its fill is `--color-bg-subtle-hover`. (L2-REQ-003)
- **AC-15** Given `disabled` on the "Upload photo" button while an upload is in progress, when it renders, then the native `disabled` attribute is present, opacity is 0.5, hover changes nothing and <kbd>Tab</kbd> skips it. (L2-REQ-016)

### Keyboard and focus

- **AC-16** Given focus on "Edit mira.fern", when <kbd>Enter</kbd> or <kbd>Space</kbd> is pressed, then the host's `click` fires once, and when <kbd>Tab</kbd> is pressed instead, focus moves to "Delete mira.fern". (L2-REQ-002)
- **AC-17** Given the public top bar at 375 px, when <kbd>Tab</kbd> moves through it, then the bell and then the menu button receive focus in that order and each shows the `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset`, unclipped by the bar. (L2-REQ-067)
- **AC-18** Given focus on the "Close" button of the viewer dialog, when <kbd>Enter</kbd> is pressed, then the host's `click` fires once and the dialog, not the button, moves focus back to the control that opened it. (L2-REQ-064)

### Screen readers

- **AC-19** Given the users table row for mira.fern, when its action cell is read by assistive technology, then two buttons are reported, named "Edit mira.fern" and "Delete mira.fern", and the words "edit" and "delete" from the ligatures are not read. (L2-REQ-002)
- **AC-20** Given the menu button with `expanded` true, when queried by assistive technology, then its role is button, its name is "Open menu" and it reports expanded with the drawer as the controlled element. (L2-REQ-067)

### Theming

- **AC-21** Given any icon button, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-064)

### Responsive

- **AC-22** Given the public top bar at 320 px with the bell (`count` 2) and the menu button, when measured, then both are 40 × 40 CSS px, the count badge is fully visible, and the page does not scroll horizontally. (L2-REQ-067)
- **AC-23** Given the users table at 320 px, when the action cell is measured, then both buttons remain 40 × 40 CSS px side by side and any overflow scrolls inside the table card, not the page. (L2-REQ-002)

### Motion

- **AC-24** Given `prefers-reduced-motion: reduce`, when the "Close" button is hovered, then its fill changes with a 0.01 ms transition and nothing animates. (L2-REQ-064)

### Performance

- **AC-25** Given the users page with ten rows (twenty icon buttons) and the bell, when the bell's `count` changes, then only the bell re-renders (`OnPush` with signal inputs) and no row button does. (L2-REQ-038)

## Implementation notes

- Folder `frontend/projects/components/src/lib/icon-button/`: `icon-button.component.ts`, `icon-button.component.html`, `icon-button.component.css`; export from `public-api.ts`. No separate type files: every input is a primitive.
- The accessible name is one `computed`: `label` alone, or `label + ', ' + countLabel` when `count` is 1 or more and `countLabel` is set; the badge text is a second `computed` (`count > 99 ? '99+' : String(count)`).
- `aria-expanded`, `aria-controls` and `aria-pressed` are bound with `[attr.…]` so they are absent, not `"null"`, when the input is `null`.
- The host sets `pointer-events: none` via a host binding when `disabled`, so a consumer's `(click)` never fires in that state.
- No CDK primitive; composes nothing. [Top bar](top-bar.md), [table](table.md), [card](card.md) (document card toolbar), [dialog](dialog.md) (viewer and form headers), the messaging page and the profile page compose it; the [avatar](avatar.md) CRD places the upload button beside the large avatar.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Are `.notification-btn`, `.back-btn`, `.close-btn`, `.delete-doc-btn` and `.hamburger` separate components or classes?* No. Each is this component: the admin `.topbar` bell, the chat back button, the public dialogs' "×" and the document card's delete all share the icon button's anatomy, and the design-system page names bell, menu, edit, delete and close as its glyphs. The component emits `.icon-btn` only; a consumer that needs a hook (the top bar hiding the hamburger at 1024 px, the messaging page showing the back button at 768 px) puts its class on the `coop-icon-button` host.
- **D-5** *What replaces the mocks' inline SVGs and the "×" character?* Material Icons ligatures, per the iconography foundation: the bell outline becomes `notifications`, the three-line menu becomes `menu`, the chevron becomes `arrow_back`, the "×" becomes `close` and the camera becomes `upload`. All render at the standard 1.5rem glyph size; the mocks' 20 px and 16 px glyphs are not kept.
- **D-6** *Is the avatar upload button this component?* Yes, with `icon="upload"` and `label="Upload photo"` (the copy of the onboarding upload area), rendered in the standard 40 px transparent look beside the large avatar. The mocks' 32 px accent circle overlaid on the avatar is below the icon-button size the accessibility foundation sets and would be a second look for a component the design system gives one look; `upload` is the catalog's upload glyph, and a camera glyph is not in the catalog.
- **D-7** *How does a screen reader learn the count?* The badge is `aria-hidden` and `countLabel` is appended to the name: "Notifications, 2 unread". The list-item page requires an unread count to be readable as "2 unread" rather than a bare "2", and `aria-label` already overrides the button's content, so the spoken form must be part of the label. A count change is not announced live: nothing in the mocks announces it and an unrequested live region would interrupt reading.
- **D-8** *What does a large count show?* "99+" from 100 up. The 1.25rem badge holds two digits; three would overflow the corner. The spoken `countLabel` keeps the exact number.
- **D-9** *Does the menu button's name change when the drawer is open?* No. The disclosure pattern keeps one name ("Open menu") and conveys state with `aria-expanded`; `aria-controls` is required alongside it because the top-bar page requires both. The design-system page's "Open menu" replaces the mocks' "dashboard hamburger menu".
- **D-10** *Do expanded and pressed have a persistent fill?* No. The design-system page gives the icon button hover, focus, active and disabled only, and the top-bar page shows the open menu button with the active fill while held. The open drawer is the visible state; colour alone must not carry it.
- **D-11** *Does the API include `type`, `href` or a size?* No. Every use in the mocks is a `type="button"` control of one 40 px size; the back button changes the messaging page's panes rather than navigating, and the design-system page defines a single size. A navigation that looks like an icon button is not a usage in this product.
- **D-12** *Why keep `pressed` when no mock uses a toggle?* The shared component contract names it and it costs one attribute binding; a toggle without it would need an API change later. It is never set together with `expanded`.
- **D-13** *What does a row action's label contain?* The verb and the row's identity ("Edit mira.fern", "Delete Autumn courtyard gathering"), per the table page, rather than the icon-button page's generic "Edit user": a screen reader moving through ten rows needs to know which user each button acts on.
