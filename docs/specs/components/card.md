# Card

| Field | Value |
|---|---|
| Selector | `coop-card` |
| Library path | `frontend/projects/components/src/lib/card/` |
| Status | planned |
| Traces to | L2-REQ-030, L2-REQ-035, L2-REQ-054, L2-REQ-065, L2-REQ-070, L2-REQ-071, L2-REQ-076 |
| Design system | [`card.html`](../../design-system/components/card.html) |
| Source mocks | [`pages/public-maintenance/default`](../../mocks/pages/public-maintenance/default.html), [`pages/admin-maintenance/default`](../../mocks/pages/admin-maintenance/default.html), [`pages/public-documents/default`](../../mocks/pages/public-documents/default.html), [`pages/public-landing/default`](../../mocks/pages/public-landing/default.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-dashboard/empty`](../../mocks/pages/admin-dashboard/empty.html), [`pages/public-dashboard/default`](../../mocks/pages/public-dashboard/default.html), [`pages/public-onboarding/unit-selected`](../../mocks/pages/public-onboarding/unit-selected.html), [`pages/public-login/default`](../../mocks/pages/public-login/default.html) |
| Rendering | [`card.html`](card.html) |

## Purpose and scope

A card is the product's one container: a white, bordered, rounded surface that groups one subject. Pages are stacks of cards on the canvas. A static card holds content that is read or edited in place (a notice, a board member, a sign-in form, the dashboard's "Recent Requests"). An interactive card is a whole summary that opens or selects something (a maintenance request, a document, a unit to move into); its title holds the one control and the rest of the card is a larger pointer target for it. A quick-action tile is a small subtle surface with an icon above a label that takes a staff member to a section of the admin app; it is a variant of this component (D-4).

Use something else instead when:

- the row is a dense, repeating one-liner with a leading avatar or icon tile: the admin document row, the asset row, the conversation list and the profile switcher are [list items](list-item.md);
- the surface is a table: `.table-card` belongs to [table](table.md);
- the surface floats over the page: `.modal-content.card` belongs to [dialog](dialog.md);
- the card shows one number: [metric card](metric-card.md);
- the control is a button with a label: [button](button.md).

Out of scope:

- Grid and stack layouts around cards (`.document-list`, `.board-grid`, `.notices-grid`, `.quick-actions-grid`, `.request-list`). The page owns them; this CRD only requires the card to behave inside them at every width.
- The content of the body: badges, avatars, forms, lists and empty states are projected by the consumer and specified in their own CRDs ([badge](badge.md), [avatar](avatar.md), [form field](form-field.md), [empty state](empty-state.md)).
- What happens after activation (opening a dialog, navigating, selecting a detail panel). The consumer handles `activated` or supplies `href`.

## Usage

Every `.card`, `.card-interactive` and `.quick-action-btn` in `docs/mocks` is one of the configurations below. The mocks' per-screen classes (`.request-card`, `.document-card`, `.notice-card`, `.board-member-card`, `.unit-option`, `.recent-requests`) are consumer classes; the component emits only the design-system classes.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/public-maintenance/*` request cards | interactive, `title`, `header` slot, `meta` | header: badges "New" + "High"; title "Kitchen tap leak"; body "The kitchen tap drips after it is closed."; meta "Oct 13, 2026" | default, hover, focus; opens the detail dialog on `activated` | canvas |
| `pages/admin-maintenance/*` request cards | interactive, `title`, `header` slot, `meta`, `selected` | header: badge "New"; title "Kitchen tap leak"; body sentence; meta "Oct 13, 2026, 8:00 AM" | default, hover, focus, selected (`detail-*` states) | canvas, master list |
| `pages/public-documents/*` document cards | interactive, `href`, `title`, `meta` | title "Autumn courtyard gathering"; meta "Notice · Oct 13, 2026" | default, hover, focus; grid of cards, one column at 640 px and below | canvas |
| `pages/public-landing/default`, `pages/admin-landing/default` board members | static | avatar, `title` "Mira Fern", body "Treasurer" | default | canvas band |
| `pages/public-landing/default`, `pages/admin-landing/default` notices | static, `title`, `meta` | title "Autumn courtyard gathering"; excerpt; meta "Oct 13, 2026" | default | canvas band |
| `pages/admin-dashboard/*`, `pages/public-dashboard/*` "Recent Maintenance Requests", "Recent Requests", "Recent Notices", "Quick Actions" | static, `title`, `header` slot (sectioned) | header: "View all" link; body: a list, four tiles, or the empty state "No recent requests" | default | canvas |
| `pages/admin-dashboard/*` quick actions | `variant="quick-action"`, `icon`, `href` | `build` "New Maintenance", `description` "Create Document", `chat` "New Message", `mail` "Send Invitation" | default, hover, focus | inside the "Quick Actions" card |
| `pages/public-login/*`, `pages/admin-login/*`, `pages/*-register/*`, `pages/*-forgot-password/*`, `pages/admin-change-password/*`, `pages/public-profile/*`, `pages/admin-settings/*` | static | a form, or a heading, paragraph and form | default | canvas, centred column |
| `pages/public-onboarding/*` unit options | interactive, `title`, `selected` | title "Unit 101"; body "101" | default, hover, focus, selected | card |

Every row is buildable with the API below: a static card with optional title, header slot and meta line; an interactive card whose title is a button (`activated`) or a link (`href`) and which can be `selected`; and the quick-action tile.

## Anatomy

1. **Container** — `.card`. `--color-bg-surface` fill, `--border-width-hairline` solid `--color-border-default` edge, `--radius-lg` corners, `--space-5` padding. A `<div>` for a static card, an `<article>` for an interactive one. Interactive adds `.card-interactive` (`--space-4` padding, pointer cursor, hover and selected styles).
2. **Header (optional)** — `.card-header`. Rendered when the `header` slot is filled: the title on the left, the projected header content (a "View all" link, a status badge) on the right, a hairline below. When the header is rendered the container padding is 0 and the body goes in `.card-body` (D-8).
3. **Title (optional)** — an `h3` (or the level given by `headingLevel`) in `--text-h3`, from the `title` input. In an interactive card the title wraps the one control: `<a href>` when `href` is set, otherwise `<button type="button">` (D-5, D-6).
4. **Body** — the default slot: paragraphs in `--text-body-sm`, `--color-fg-muted`, `--line-height-snug`. Inside `.card-body` when sectioned, otherwise directly in the container.
5. **Meta line (optional)** — `.card-meta`: type and date in `--text-caption`, `--color-fg-muted`, after the body, from the `meta` input.
6. **Quick-action tile** — `.quick-action-btn`, an `<a href>`: a `.material-icons` span (`aria-hidden="true"`, `--color-fg-accent`) above the projected label, `--color-bg-subtle` fill, `--radius-md`, `--space-4` padding, `--space-2` gap.

Host: `coop-card` is `display: block` and carries no classes of its own. All classes and attributes go on the inner `.card` container or `.quick-action-btn` anchor. A pointer click anywhere on an interactive card that is not on another control is forwarded to the title control (D-5).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `'default' \| 'quick-action'` | `'default'` | no | `quick-action` renders the `.quick-action-btn` anchor instead of `.card`; it needs `icon` and `href` and ignores every other input. |
| `interactive` | `boolean` | `false` | no | Adds `.card-interactive`, renders the container as `<article>` and puts the control in the title. Requires `title`. |
| `title` | `string \| null` | `null` | when `interactive` | Rendered as the heading. Null renders no heading (the consumer may project its own). |
| `headingLevel` | `2 \| 3 \| 4` | `3` | no | Element used for the title (`h2`, `h3`, `h4`) so the page outline stays in order. Styling is the same at every level. |
| `href` | `string \| null` | `null` | for `quick-action` | Interactive: the title control becomes `<a href>` and `activated` is not emitted. Quick action: the tile's destination. The consumer passes the resolved URL. |
| `selected` | `boolean` | `false` | no | Sets `aria-current="true"` on the interactive container (accent edge and `--shadow-selected`). Ignored when not interactive. |
| `meta` | `string \| null` | `null` | no | Rendered as the `.card-meta` line after the body. |
| `icon` | `string \| null` | `null` | for `quick-action` | Material Icons ligature name for the tile. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `activated` | `void` | The interactive card's title button is activated by click, <kbd>Enter</kbd> or <kbd>Space</kbd>, or the card is clicked anywhere other than on another control. Not emitted when `href` is set (the link navigates) or when the card is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | block content: paragraphs, an avatar, a form, a list, an empty state, the tile label | The body. For `quick-action` it is the label text (one to three words). |
| `[slot=header]` | inline content: a link, a badge or two | Rendered on the right of `.card-header`; filling it switches the card to the sectioned layout (D-8). |

Translation: `title` and `meta` are inputs and the body and header are projected, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Static | `.card` | Content read or edited in place: notices, board members, forms, dashboard sections. The default. |
| Interactive | `.card.card-interactive` | A summary that opens or selects: request cards, document cards, unit options. One control in the title. |
| Quick action | `.quick-action-btn` | Dashboard shortcut tiles: "New Maintenance", "Create Document", "New Message", "Send Invitation". Always a link. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | from content | `--space-5` (static), `--space-4` (interactive and tile), header and body `--space-4` by `--space-5` | `--text-h3` title, `--text-body-sm` body, `--text-caption` meta |

The card takes the width of its container (a grid cell, a column or the full content width) and the height of its content. Nothing truncates.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Surface fill, hairline edge, no shadow | Static: none. Interactive: control named by the title |
| Hover (interactive) | `:hover` on the container | Edge `--color-accent`, `--shadow-2`, over `--duration-base` | — |
| Hover (tile) | `:hover` | Fill `--color-bg-subtle-hover`, no underline | — |
| Focus | `:focus-visible` on the title control or the tile | Shared ring `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` | — |
| Active | `:active` | Same as hover (D-9) | — |
| Selected (interactive) | `selected` → `aria-current="true"` | Edge `--color-accent` plus `--shadow-selected` halo | Container reports current |
| Sectioned | `header` slot filled | `.card-header` and `.card-body` with their own padding; container padding 0 | — |

Disabled, loading and error states do not exist for cards (design-system page); the page shows a [spinner](spinner.md) or an [empty state](empty-state.md) in place of the list instead.

## Markup

```html
<!-- rendered: static notice card -->
<div class="card">
  <h3>Autumn courtyard gathering</h3>
  <p>Join your neighbours in the courtyard on Saturday at 2 pm. Bring a mug and a story to share.</p>
  <span class="card-meta">Oct 13, 2026</span>
</div>
```

```html
<!-- rendered: sectioned static card (header slot filled) -->
<div class="card" style="padding: 0">
  <div class="card-header"><h3>Recent Requests</h3><a href="/maintenance">View all</a></div>
  <div class="card-body">…list or empty state…</div>
</div>
```

```html
<!-- rendered: interactive request card, button form, with header badges -->
<article class="card card-interactive" style="padding: 0">
  <div class="card-header"><h3><button type="button">Kitchen tap leak</button></h3><span class="badge badge-warning">New</span><span class="badge badge-danger">High</span></div>
  <div class="card-body"><p>The kitchen tap drips after it is closed.</p><span class="card-meta">Oct 13, 2026</span></div>
</article>
```

```html
<!-- rendered: interactive document card, link form, selected -->
<article class="card card-interactive" aria-current="true">
  <h3><a href="/documents/7">Autumn courtyard gathering</a></h3>
  <span class="card-meta">Notice · Oct 13, 2026</span>
</article>
```

```html
<!-- rendered: quick-action tile -->
<a class="quick-action-btn" href="/maintenance"><span class="material-icons" aria-hidden="true">build</span><span>New Maintenance</span></a>
```

The unselected card omits `aria-current`; the unsectioned interactive card puts the `h3`, body and meta directly in the `<article>`.

```html
<!-- consumer -->
<coop-card title="Autumn courtyard gathering" meta="Oct 13, 2026"><p>Join your neighbours in the courtyard on Saturday at 2 pm.</p></coop-card>
<coop-card title="Recent Requests"><a slot="header" [href]="maintenanceUrl">View all</a><coop-list>…</coop-list></coop-card>
<coop-card interactive [title]="request.title" [meta]="request.submitted | date" [selected]="request.id === selectedId()" (activated)="select(request)">
  <coop-badge slot="header" tone="warning">New</coop-badge><p>{{ request.description }}</p>
</coop-card>
<coop-card interactive [title]="doc.title" [href]="viewerUrl(doc)" [meta]="doc.type + ' · ' + (doc.date | date)"></coop-card>
<coop-card variant="quick-action" icon="build" [href]="maintenanceUrl">New Maintenance</coop-card>
```

The classes and attributes above are part of the contract: the e2e page objects locate cards by `.card`, `.card-interactive`, `aria-current`, `.card-header`, `.card-meta` and `.quick-action-btn`.

## Design

- Container: padding `--space-5`; `--border-width-hairline` solid `--color-border-default`; radius `--radius-lg`; fill `--color-bg-surface`. Interactive: padding `--space-4`, `cursor: pointer`.
- Header and body: padding `--space-4` by `--space-5`; header is a flex row, centred, space between, with a `--border-width-hairline` `--color-border-default` rule below. Sectioned containers have padding 0 (D-8).
- Title `--text-h3`, margin 0 0 `--space-2`. The title control (link or button) takes `--color-fg-link`, no underline at rest, underline and `--color-fg-link-hover` on hover; the button form is reset to look exactly like the link (font inherit, no border, no fill, no padding, left aligned) in the component stylesheet (D-5).
- Body `--text-body-sm`, `--color-fg-muted`, `--line-height-snug`, margin 0. Meta `--text-caption`, `--color-fg-muted`, block, margin-top `--space-2`.
- Hover and selected: `border-color` and `box-shadow` transition over `--duration-base` with `--ease-standard`; `--shadow-2` on hover, `--shadow-selected` when selected. Nothing moves or scales.
- Tile: column flex, centred, gap `--space-2`, padding `--space-4`, radius `--radius-md`, fill `--color-bg-subtle` (`--color-bg-subtle-hover` on hover), label `--text-body-sm` in `--color-fg-default`, icon `--icon-size` 1.5rem in `--color-fg-accent`. About 74 px tall.
- Layer: none; cards sit in the flow of their surface.

Component tokens: none. The card block in `components.css` reads semantic tokens directly; surfaces do not re-skin it.

| Token | Aliases | Overridden by |
|---|---|---|
| `--color-bg-surface` | `--palette-white` | — (the tile uses `--color-bg-subtle`) |
| `--color-border-default` | `--palette-gray-200` | hover and selected use `--color-accent` |
| `--radius-lg` | 1rem | the tile uses `--radius-md` |
| `--space-5` | 1.25rem | `.card-interactive` and the tile use `--space-4`; sectioned cards use 0 |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Hover and selected edge | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Title | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Title control | `--color-fg-link` | `--palette-green-700` | `--palette-green-700` |
| Title control, hover | `--color-fg-link-hover` | `--palette-green-800` | `--palette-green-800` |
| Body and meta | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Tile fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Tile fill, hover | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-200` |
| Tile label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Tile icon | `--color-fg-accent` | `--palette-green-700` | `--palette-green-700` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Title on card |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Body and meta on card |
| `--color-fg-link` | `--color-bg-surface` | 4.5:1 | Title control |
| `--color-fg-link-hover` | `--color-bg-surface` | 4.5:1 | Title control, hover |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Tile label |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | Tile label, hover |
| `--color-fg-accent` | `--color-bg-subtle` | 3:1 | Tile icon (non-text; D-15) |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Hover and selected edge on the page |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a card |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |

The default edge (`--color-border-default`) is decorative and exempt from 1.4.11: the card is identified by its surface and content. Under `forced-colors: active` the edge becomes `CanvasText` and the ring `Highlight` (tokens.css); the component adds no colour of its own.

## Responsive behaviour

- The card is fluid: it fills its container and has no breakpoint of its own (design-system page). Padding does not change on phones.
- The page lays document cards in a grid that becomes one column at `--layout-breakpoint-sm` (640 px) and below; board member cards go to two columns at 640 px and below in the mocks, and L2-REQ-071 AC1 asks for a single column on XS and SM; notice cards stack to one column. The card must render correctly in all of these: at 320 px in a single column and at 360 px in a two-column grid (about 150 px per cell) with the name wrapping (D-13).
- Quick-action tiles sit in the page's `.quick-actions-grid`; in a cell about 140 px wide the label wraps onto two lines and the tile keeps its padding.
- Titles, body text and meta wrap; nothing truncates. A long title such as "September maintenance report" wraps onto two lines at 320 px.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom every card and control stays reachable and operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: the title control is at least `--target-min` (24 px) tall by its line height, and the whole interactive card (at least 72 px tall) is its pointer target; the tile is about 74 px tall (accessibility foundation).

## Accessibility

### Role and pattern

A static card is a generic `<div>` with no role. An interactive card is an `<article>` whose title holds one native control (`<a href>` or `<button type="button">`); the card follows the "card" convention in which the control is the only tab stop and the surface is a larger pointer target for it ([WAI-ARIA APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/), [Link pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/)). The container never gets `role="button"` or `role="link"`: a role on the container would hide the heading, the badges and any nested control (D-5). The tile is a native `<a href>`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the title control (one stop per card), then to any control projected into the card, in DOM order. A static card has no stop of its own. |
| <kbd>Enter</kbd> | Activates the title button (emits `activated`) or follows the title link or the tile. |
| <kbd>Space</kbd> | Activates the title button. No action on a link. |

### Focus

Focus lands on the title control or on the tile, never on the container or the host. The shared ring shows on `:focus-visible` and must not be clipped: the card has no `overflow: hidden`. Clicking the card body forwards the activation to the title control and focuses it, so keyboard focus and the selected state stay together. Focus does not move when `selected` changes.

### Labelling

- The title text is the accessible name of the control. The heading level is preserved for the page outline.
- `selected` is exposed as `aria-current="true"` on the container; the `.selected` class is not emitted (D-7).
- The tile's accessible name is its visible label; the icon is `aria-hidden="true"`.
- Badges and meta text stay in the reading order after the title (header: title first, then badges).
- No `aria-label` or `aria-describedby` is added; the body is read as content.

### Announcements

None. Selection changes are visible and exposed through `aria-current`; the page's detail panel or dialog announces itself.

### Motion

Only `border-color` and `box-shadow` transition, over `--duration-base`. Under `prefers-reduced-motion: reduce` tokens.css shortens `--duration-base` to 0.01 ms; nothing else animates.

## Content and internationalisation

- Titles are short noun phrases: "Courtyard gate", "Autumn courtyard gathering", "Unit 101"; not sentences.
- Body text is one or two sentences; long text belongs in the detail dialog the card opens.
- Meta shows type then date, separated by a middle dot: "Notice · Oct 13, 2026". Dates use "Oct 13, 2026" and, with a time, "Oct 13, 2026, 8:00 AM" (content foundation).
- Quick-action labels are Title Case verb phrases or destinations of one to three words: "New Maintenance", "Send Invitation".
- Section titles are Title Case: "Recent Requests", "Quick Actions"; the header link reads "View all".
- Translatable inputs: `title`, `meta`; the body, header and tile label are projected. Data values: titles and dates from records.
- A French tile label about 30 % longer ("Nouvelle demande d'entretien") wraps onto two lines inside the tile; a French title wraps in the card at 320 px without clipping.

## Performance

- Change detection: `OnPush`, signal inputs, class list and container tag from `computed` signals.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: hover and selection change only colour and shadow, so the card's size never changes with state; the sectioned layout is decided at render time from the slot, not after load.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK, no router (the consumer resolves `href`).

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-card title="Autumn courtyard gathering" meta="Oct 13, 2026">` with a body paragraph, when it renders, then the DOM holds `<div class="card"><h3>Autumn courtyard gathering</h3><p>…</p><span class="card-meta">Oct 13, 2026</span></div>` with a `--color-bg-surface` fill, a `--border-width-hairline` `--color-border-default` edge and `--radius-lg` corners. (L2-REQ-065)
- **AC-2** Given a static card with no `header` slot, when it renders, then it has no box shadow at rest and `--space-5` padding on every side. (L2-REQ-065)
- **AC-3** Given `title="Recent Requests"` with a "View all" link in `[slot=header]` and a list in the body, when it renders, then `.card-header` holds the `h3` and the link, `.card-body` wraps the list, a hairline separates them and the container's padding is 0. (L2-REQ-065)
- **AC-4** Given a board member card with a projected avatar, `title="Mira Fern"` and the body "Treasurer", when the landing page renders, then the avatar, the name heading and the title paragraph appear inside `.card` in that order. (L2-REQ-070)
- **AC-5** Given a notice card with `title="Autumn courtyard gathering"`, an excerpt and `meta="Oct 13, 2026"`, when it renders, then the title, the excerpt and the `.card-meta` date appear in that order. (L2-REQ-070)
- **AC-6** Given the public login form projected into a static card, when the login page renders, then the form sits inside one `.card` centred in the content column with the "Sign In" button as its last control. (L2-REQ-076)
- **AC-7** Given `headingLevel="2"` on a card titled "Quick Actions", when it renders, then the title is an `h2` with the same `--text-h3` styling. (L2-REQ-065)

### Interactive and quick action

- **AC-8** Given `interactive`, `title="Kitchen tap leak"`, the badges "New" and "High" in `[slot=header]`, a body sentence and `meta="Oct 13, 2026"`, when it renders, then the DOM holds `<article class="card card-interactive">` with `.card-header` > `h3` > `<button type="button">Kitchen tap leak</button>` followed by the badges, and `.card-body` with the sentence and `.card-meta`. (L2-REQ-030)
- **AC-9** Given `interactive`, `href="/documents/7"`, `title="Autumn courtyard gathering"` and `meta="Notice · Oct 13, 2026"`, when it renders, then the title is `<h3><a href="/documents/7">Autumn courtyard gathering</a></h3>`, the article has no `role` attribute and the meta line follows. (L2-REQ-035)
- **AC-10** Given an interactive request card, when it is hovered, then its edge becomes `--color-accent`, `--shadow-2` appears over `--duration-base` and the cursor is a pointer. (L2-REQ-030)
- **AC-11** Given `selected` on the "Kitchen tap leak" card in the admin request list, when it renders, then the article has `aria-current="true"`, an `--color-accent` edge and the `--shadow-selected` halo, and no other card in the list has `aria-current`. (L2-REQ-030)
- **AC-12** Given a click on the body sentence of an interactive request card, when the click is not on another control, then `activated` emits once and the title button receives focus. (L2-REQ-030)
- **AC-13** Given `variant="quick-action" icon="build" href="/maintenance"` with the label "New Maintenance", when it renders, then the DOM holds `<a class="quick-action-btn" href="/maintenance"><span class="material-icons" aria-hidden="true">build</span><span>New Maintenance</span></a>` with a `--color-bg-subtle` fill, `--radius-md` corners and the icon in `--color-fg-accent`. (L2-REQ-054)
- **AC-14** Given a quick-action tile, when it is hovered, then its fill becomes `--color-bg-subtle-hover`, the label keeps `--color-fg-default` and no underline appears. (L2-REQ-054)

### Keyboard and focus

- **AC-15** Given <kbd>Tab</kbd> reaches a request card, when focus arrives, then it lands on the title control only (one stop per card) and the `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is visible and unclipped. (L2-REQ-030)
- **AC-16** Given focus on the title button of "Hallway light", when <kbd>Enter</kbd> or <kbd>Space</kbd> is pressed, then `activated` emits exactly once. (L2-REQ-030)
- **AC-17** Given focus on the title link of the "Shared spaces bylaw" document card, when <kbd>Enter</kbd> is pressed, then the browser follows `href` and `activated` does not emit. (L2-REQ-035)
- **AC-18** Given <kbd>Tab</kbd> reaches the "Send Invitation" tile, when <kbd>Enter</kbd> is pressed, then the browser follows `/invitations`, and the ring was visible on the tile while focused. (L2-REQ-054)

### Screen readers

- **AC-19** Given the "Kitchen tap leak" request card, when queried by assistive technology, then the control's role is button and its name is "Kitchen tap leak", the heading keeps its level, and the selected admin card reports current. (L2-REQ-030)
- **AC-20** Given the "New Maintenance" tile, when queried by assistive technology, then its role is link, its name is exactly "New Maintenance" and the icon is not announced. (L2-REQ-054)

### Theming

- **AC-21** Given any variant, when the page sets `data-theme="dark"`, then the card renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-065)

### Responsive

- **AC-22** Given three document cards in the documents grid at 320 px, when the page renders, then the grid is one column, each card spans the full width, "September maintenance report" wraps and nothing scrolls horizontally. (L2-REQ-035)
- **AC-23** Given the three board member cards in a single-column list at 320 px, when measured, then each card fills the column and "Mira Fern" and "Treasurer" are fully visible. (L2-REQ-071)
- **AC-24** Given notice cards at 360 px, when the page renders, then they stack vertically, each full width, with the excerpt wrapping. (L2-REQ-071)
- **AC-25** Given four quick-action tiles in a two-column grid at 320 px, when measured, then "Send Invitation" wraps inside its tile, each tile keeps `--space-4` padding and is at least 44 px tall. (L2-REQ-054)

### Motion

- **AC-26** Given `prefers-reduced-motion: reduce`, when an interactive card is hovered, then the edge and shadow change with a 0.01 ms transition and nothing moves. (L2-REQ-030)

### Performance

- **AC-27** Given a list of twenty request cards, when one card's `selected` input changes, then only that card re-renders (`OnPush` with signal inputs). (L2-REQ-030)

## Implementation notes

- Folder `frontend/projects/components/src/lib/card/`: `card.component.ts`, `card.component.html`, `card.component.css`, `card-variant.ts` (type alias), `card-heading-level.ts` (type alias); export from `public-api.ts`.
- One `<ng-template>` holds the default slot and one holds the header slot; the template renders either the tile branch or the card branch and projects into it. The header slot is detected with `contentChild` on a `[slot=header]` element to switch to the sectioned layout.
- The container tag (`div` or `article`) and the heading tag come from `ngComponentOutlet`-free conditional branches (`@switch` on `headingLevel`), not from dynamic element creation.
- The component stylesheet resets the title button to the link look (`font: inherit; color: var(--color-fg-link); background: none; border: 0; padding: 0; text-align: left; cursor: pointer`) and applies `padding: 0` on the container when sectioned; everything else comes from `components.css`.
- A host `click` listener checks `event.target.closest('a, button, input, select, textarea, [tabindex]')`; when the match is null or the title control itself, it calls the title control's `click()` and `focus()`.
- No CDK primitive. Composes nothing; [badge](badge.md), [avatar](avatar.md), [empty state](empty-state.md) and [list item](list-item.md) are projected by consumers. [Metric card](metric-card.md) composes the `.card` surface.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Is the quick-action tile a variant of the card?* Yes, `variant="quick-action"`, rendering an anchor. The design-system card page documents the tile as a related surface, it shares the card's content rules and it has no other home; a separate component would duplicate the icon and link handling.
- **D-5** *Where is the control of an interactive card?* In the title, as a native `<a>` or `<button>`, with the container forwarding body clicks to it. The design-system page requires a native control in the title (the mocks' `div role="link"` had no Enter handling), and a role on the container would hide the heading, the badges and nested controls. This deviates from the shared contract's `role="button"`/`tabindex` on the container for the reason above.
- **D-6** *Button or link?* `href` decides: with `href` the title is a link that navigates (document viewer routes, future detail routes); without it the title is a button and `activated` tells the consumer to open a dialog or select the detail panel (request cards, unit options).
- **D-7** *Is the `.selected` class emitted?* No. `aria-current="true"` is the state; `components.css` keeps `.selected` as an alias for the static mocks only. One state attribute keeps the page objects and the CSS in step.
- **D-8** *When does the card use `.card-header` and `.card-body`?* Only when the `header` slot is filled; the container padding is then 0, as the design-system examples do. Request cards put their badges in the header slot, to the right of the title (the public mock placed them above it); the design-system anatomy shows the status beside the title.
- **D-9** *Is there an active state?* The same as hover. `components.css` defines no `:active` rule for cards or tiles, and a press lasts only until the dialog or detail opens.
- **D-10** *Does the card have a `shadow` input for the "optional shadow" of L2-REQ-065 AC1?* No. No mock shows a resting shadow on a plain card; the optional shadow is the hover and selected shadow here and the resting `--shadow-1` of the [metric card](metric-card.md).
- **D-11** *What becomes of the public document card's coloured top bar?* It is dropped; the design-system page excludes `.card-color-bar`, and the document type moves into the meta line ("Notice · Oct 13, 2026") so the type is still read.
- **D-12** *Which card-like rows are not this component?* The admin document rows, asset rows, conversation items and the profile switcher are [list items](list-item.md) (the design-system list item page consolidates them); table cards are [table](table.md); dialog surfaces are [dialog](dialog.md).
- **D-13** *Who owns the grids, and how is the board grid conflict handled?* The page. L2-REQ-071 AC1 asks for a single-column board list on XS and SM while the landing mock keeps two columns at 640 px and below; the card takes no side and must render in both, so the rendering shows a 320 px single column and a 360 px two-column grid.
- **D-14** *Why a `headingLevel` input?* The design-system page says to choose the heading level for the page outline, and dashboards already use an `h1` greeting with `h3` section titles; the input lets a page keep its headings in order without a second component.
- **D-15** *The tile icon pair is not in `contrast-pairs.json`?* The CRD lists `--color-fg-accent` on `--color-bg-subtle` at 3:1 (a non-text icon) and the rendering computes it live; the design system should add the pair to the file.
