# List item

| Field | Value |
|---|---|
| Selector | `coop-list-item` |
| Library path | `frontend/projects/components/src/lib/list-item/` |
| Status | planned |
| Traces to | L2-REQ-019, L2-REQ-035, L2-REQ-036, L2-REQ-037, L2-REQ-038, L2-REQ-041 |
| Design system | [`list-item.html`](../../design-system/components/list-item.html) |
| Source mocks | [`pages/admin-messaging/default`](../../mocks/pages/admin-messaging/default.html), [`pages/admin-messaging/empty`](../../mocks/pages/admin-messaging/empty.html), [`pages/public-messaging/default`](../../mocks/pages/public-messaging/default.html), [`dialogs/admin-new-conversation/default`](../../mocks/dialogs/admin-new-conversation/default.html), [`pages/admin-profiles/default`](../../mocks/pages/admin-profiles/default.html), [`pages/admin-profile/default`](../../mocks/pages/admin-profile/default.html), [`dialogs/public-profile-switcher/default`](../../mocks/dialogs/public-profile-switcher/default.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-assets/default`](../../mocks/pages/admin-assets/default.html) |
| Rendering | [`list-item.html`](list-item.html) |

## Purpose and scope

A list item is one row of a vertical list that people scan and choose from: a conversation in the Messages list, a profile to switch to, a notice on the dashboard, an asset in Digital Assets. It leads with an [avatar](avatar.md) or an icon tile, carries a title and one line of metadata, and may end with an unread count or a time. The title is the row's one control (a link or a button); the whole row is its click target, and the open or current row carries the accent marker.

Use something else instead when:

- rows have several comparable columns and row actions: [table](table.md);
- each entry needs a title and a paragraph of its own (documents, maintenance requests, quick actions): [card](card.md);
- the row is a navigation link in the sidebar or tab bar: [sidebar](sidebar.md), [bottom tab bar](bottom-tab-bar.md).

Out of scope:

- The list container and its name. The consumer renders `<div role="list" aria-label="Conversations">` (or a `<ul>`) around the items; this component is one `listitem`.
- Filtering, searching and the empty list. The page owns the search bar and shows an [empty state](empty-state.md) ("No conversations yet") in place of the list.
- The messaging page layout (the list hides behind the open chat at 768 px and below with a back button). That is page CSS; the row does not change.
- Fetching and formatting data: previews, dates ("Oct 13, 2026") and sizes ("2 KB") arrive as strings.

## Usage

Every row type the design system consolidated into `.list-item` (the mocks' `.conversation-item` on 2 pages and 1 dialog, `.profile-card` on 2 pages and 2 notifications, `.profile-option` in the switcher dialog, `.notice-item` on 1 page and 1 notification, `.asset-card` on 1 page) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-messaging/*` list panel, behind `dialogs/admin-new-conversation` | leading avatar "C"; `title`, `meta` (last message); `unread`; button form (`activated` opens the chat in place); `selected` on the open conversation | "Courtyard gathering", "Can I bring a table?", unread 2 | default, hover, selected, empty "No conversations yet" (page) | panel surface |
| `pages/public-messaging/*` | no leading; `title`, `meta`; trailing time; `unread`; `href` to the chat page | "Courtyard gathering", "Shall we meet at the courtyard?", "Oct 13, 2026", unread 2 | default, empty | canvas, on a card |
| `pages/admin-profiles/*`, `pages/admin-profile/*`, `notifications/admin-profile-saved`, `admin-profiles-saved` | `title` (name), `meta` (profile type); trailing success badge "Active" on the current profile; `selected`; button form | "Mira Fern", "Member" / "Board Member", "Active" | default, selected | card |
| `dialogs/public-profile-switcher/default` | `title`, `meta`; button form (`activated` switches profile) | "Mira Fern", "Member" / "Board Member" | default, hover | dialog |
| `pages/admin-dashboard/*`, `notifications/admin-dashboard-unread` | `icon="campaign"` `iconTone="success"`; `title`, `meta` "Type · date"; `href` to the notice | "Autumn courtyard gathering", "Notice · Oct 13, 2026" | default | card |
| `pages/admin-assets/*` | `icon="insert_drive_file"` (neutral); `title` (file name), `meta` "size · date"; button form (`activated` opens the Asset Details dialog) | "Courtyard plan.pdf", "2 KB · Oct 13, 2026"; "Meeting notes.pdf" | default, hover, empty "No assets uploaded yet" (page), no-results | canvas, on a card |

Every row is buildable with the API below: a title that is a link or a button, optional meta, an avatar in the leading slot or an icon tile from inputs, an unread count, a trailing slot for a time or a badge, and a selected state.

## Anatomy

1. **Row** — `.list-item`. Flex row, `--space-3` gap, `--space-3` by `--space-5` padding, hairline below, a reserved `--border-width-thick` transparent left border that turns `--color-accent` when selected.
2. **Leading visual (optional)** — a `coop-avatar` projected in `[slot=leading]` (people, conversations), or an `.icon-tile` rendered from `icon` (documents, notices, assets). Both `aria-hidden="true"`.
3. **Text column** — `.list-item-text`. `flex: 1 1 auto; min-width: 0` so the title wraps instead of pushing the trailing content out (D-11).
4. **Title** — `.list-item-title` holding the control: `<a href>` when `href` is set, otherwise `<button type="button">`. The control's text is the accessible name.
5. **Meta (optional)** — `.list-item-meta`. `--text-caption`, muted: the last message, "Notice · Oct 13, 2026", "2 KB · Oct 13, 2026".
6. **Unread badge (optional)** — `.badge.badge-info` rendered from `unread`, with a visually hidden `.list-item-unread-label` suffix ("unread").
7. **Trailing (optional)** — `[slot=trailing]`: a time in `.list-item-meta` or a `coop-badge` ("Active").

Host: `coop-list-item` is `display: block` with the host attribute `role="listitem"` (D-4); the row classes go on the inner `div.list-item`. The consumer places items directly inside its `role="list"` container.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `title` | `string` | — | yes | The control's text and the accessible name: "Courtyard gathering", "Mira Fern", "Courtyard plan.pdf". |
| `meta` | `string \| null` | `null` | no | One line under the title in `.list-item-meta`; omitted when null. |
| `href` | `string \| null` | `null` | no | When set the title renders as `<a href>` (the consumer resolves the URL); otherwise as `<button type="button">` and `activated` is emitted. |
| `selected` | `boolean` | `false` | no | Sets `aria-current="true"` on `.list-item`: accent marker and `--color-accent-subtle` fill. One selected row per list. |
| `icon` | `string \| null` | `null` | no | Material Icons name rendered in an `.icon-tile` before the text. Ignored when `[slot=leading]` is filled. |
| `iconTone` | `'neutral' \| 'success' \| 'info' \| 'warning'` | `'neutral'` | no | `success` → `.icon-tile-success` (notice), `info` → `.icon-tile-info` (by-law), `warning` → `.icon-tile-warning` (report); neutral adds nothing (asset). |
| `unread` | `number \| null` | `null` | no | When greater than 0 renders `.badge.badge-info` with the count and the hidden `unreadLabel`; 0 or null renders nothing. |
| `unreadLabel` | `string` | `'unread'` | no | The visually hidden word after the count, so the badge reads "2 unread". |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `activated` | `void` | The button-form control is activated by click, <kbd>Enter</kbd> or <kbd>Space</kbd>, or the row is clicked anywhere outside another control. Not emitted in the link form, which navigates. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `[slot=leading]` | one `coop-avatar` | Rendered before the text column; replaces the icon tile. |
| `[slot=trailing]` | a `coop-badge` or a `<span class="list-item-meta">` time | Rendered after the unread badge; keeps its width while the text column shrinks. |

Translation: `title`, `meta` and `unreadLabel` are inputs and the slots are the consumer's; the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| With avatar | `coop-avatar` in `[slot=leading]` | Conversations (initial of the subject, "C"); people. |
| With icon tile | `.icon-tile` (+ `.icon-tile-success`, `-info`, `-warning`) | Notices, by-laws, reports, assets. |
| Text only | no leading visual | Profiles to switch to ("Mira Fern" / "Member"). |
| Link | `href` set → `<a>` | Rows that go to another page (notice, public conversation). |
| Button | no `href` → `<button>` | Rows that change the view in place (admin conversation, profile switch, asset details). |

One size. The leading visual is 2.25rem (avatar) or 3rem (icon tile); rows are at least 60 px tall with a visual and at least 45 px without, above the 44 px phone target (design-system page).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--color-bg-surface` row, transparent 3px left border, hairline below | listitem containing a link or button named by the title |
| Hover | `.list-item:hover` | Fill `--color-bg-subtle` over `--duration-base`; the link underlines when the pointer is on it | — |
| Focus | `:focus-visible` on the title control | Shared ring on the control, offset `--focus-ring-offset` | — |
| Selected | `aria-current="true"` (alias `.selected`) | `--border-width-thick` `--color-accent` left border, `--color-accent-subtle` fill | "current" |
| Unread | `unread` > 0 | `.badge.badge-info` with the count | "2 unread" |
| Empty list | no items | Not a row state; the page renders an [empty state](empty-state.md) | — |

Disabled and loading rows are not implemented and are not states of this component (design-system page).

## Markup

```html
<!-- rendered: conversation row, button form, selected, unread -->
<coop-list-item role="listitem">
  <div class="list-item" aria-current="true">
    <span class="avatar" aria-hidden="true">C</span>
    <div class="list-item-text">
      <div class="list-item-title"><button type="button">Courtyard gathering</button></div>
      <div class="list-item-meta">Can I bring a table?</div>
    </div>
    <span class="badge badge-info">2<span class="list-item-unread-label"> unread</span></span>
  </div>
</coop-list-item>
```

```html
<!-- rendered: notice row, link form, icon tile -->
<coop-list-item role="listitem">
  <div class="list-item">
    <span class="icon-tile icon-tile-success" aria-hidden="true"><span class="material-icons">campaign</span></span>
    <div class="list-item-text">
      <div class="list-item-title"><a href="/documents/7">Autumn courtyard gathering</a></div>
      <div class="list-item-meta">Notice · Oct 13, 2026</div>
    </div>
  </div>
</coop-list-item>
```

```html
<!-- rendered: profile row with a trailing badge -->
<coop-list-item role="listitem">
  <div class="list-item" aria-current="true">
    <div class="list-item-text">
      <div class="list-item-title"><button type="button">Mira Fern</button></div>
      <div class="list-item-meta">Member</div>
    </div>
    <span class="badge badge-success">Active</span>
  </div>
</coop-list-item>
```

The asset row differs from the notice row only by a neutral `.icon-tile` and a button; the public conversation row has no leading visual and a trailing `<span class="list-item-meta">Oct 13, 2026</span>` before the unread badge.

```html
<!-- consumer -->
<div role="list" aria-label="Conversations">
  @for (c of conversations(); track c.id) {
    <coop-list-item [title]="c.subject" [meta]="c.lastMessage" [unread]="c.unreadCount" [selected]="c.id === openId()" (activated)="open(c)">
      <coop-avatar slot="leading" [initials]="c.initial" />
    </coop-list-item>
  }
</div>
<coop-list-item title="Autumn courtyard gathering" meta="Notice · Oct 13, 2026" icon="campaign" iconTone="success" [href]="noticeUrl" />
<coop-list-item title="Mira Fern" meta="Member" selected (activated)="switchTo(member)"><coop-badge slot="trailing" tone="success">Active</coop-badge></coop-list-item>
```

The classes and attributes above are part of the contract: the e2e page objects locate rows by `.list-item`, the open row by `[aria-current="true"]`, the title control by `.list-item-title a, .list-item-title button` and the unread count by `.badge`.

## Design

- Padding `--space-3` by `--space-5`; gap `--space-3`; divider `--border-width-hairline` solid `--color-border-default`; selected marker `--border-width-thick`.
- Title `--text-label` at `--font-weight-semibold`; meta `--text-caption` in `--color-fg-muted`. The title wraps; nothing truncates (D-7).
- The title control inherits the title's font and colour and has no border, fill or padding of its own; the link form has no underline until hovered (global link rule).
- Icon tile 3rem square, `--radius-md`, `--color-bg-subtle` fill and `--color-fg-muted` glyph; tinted tiles use the status background and foreground tokens. Avatar per [avatar](avatar.md).
- Unread badge: `.badge.badge-info`, `white-space: nowrap`; the hidden label is an inline 1 px clipped span (`clip-path: inset(50%)`), not absolutely positioned, so it never widens a scroll container.
- Transition: `background-color` over `--duration-base` with `--ease-standard`. Nothing moves; the reserved transparent border means selecting a row shifts no content (D-9).
- Cursor: pointer on the whole row.
- Layer: none.

Component tokens: none. The row consumes semantic tokens directly (there is no `--list-item-*` group in components.css).

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Row fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Hover fill, neutral tile fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Selected fill | `--color-accent-subtle` | `--palette-green-50` | `--palette-green-50` |
| Selected marker | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Title | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Meta, neutral tile glyph | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Divider | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Success tile and badge | `--color-success-bg`, `--color-success-fg` | `--palette-green-100`, `--palette-green-800` | `--palette-green-100`, `--palette-green-800` |
| Info tile and unread badge | `--color-info-bg`, `--color-info-fg` | `--palette-blue-100`, `--palette-blue-800` | `--palette-blue-100`, `--palette-blue-800` |
| Warning tile | `--color-warning-bg`, `--color-warning-fg` | `--palette-amber-100`, `--palette-amber-700` | `--palette-amber-100`, `--palette-amber-700` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Title |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Meta |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Meta on a hovered row |
| `--color-fg-default` | `--color-accent-subtle` | 4.5:1 | Title on the selected row |
| `--color-fg-muted` | `--color-accent-subtle` | 4.5:1 | Meta on the selected row |
| `--color-accent` | `--color-accent-subtle` | 3:1 | Selected marker on the selected row |
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | Unread count |
| `--color-success-fg` | `--color-success-bg` | 3:1 | Notice tile glyph (non-text) |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a row |
| `--color-focus-ring` | `--color-accent-subtle` | 3:1 | Focus ring on the selected row |

The divider is decorative and exempt from 1.4.11. Selection is conveyed by `aria-current` and the marker, not by the fill alone. Under `forced-colors: active` the ring becomes `Highlight` and the divider `CanvasText` (tokens.css); the marker keeps its border and so stays visible.

## Responsive behaviour

- The row is fluid at every width: the text column shrinks and wraps, the leading visual and the trailing badge keep their width. The mocks and the design system define no media rule for the row itself.
- At 320 px a conversation row holds the avatar, a two-line title and the unread badge without horizontal scrolling; a long asset name ("September maintenance report for the courtyard gate.pdf") wraps at spaces and breaks inside an unbroken word only when it would otherwise overflow (`overflow-wrap: anywhere` on the title, D-7).
- At 400 % zoom every row stays a single tab stop and its whole area stays clickable; nothing clips (AGENTS.md reflow rule, WCAG 1.4.10).
- Page rules that move the list (the admin list panel becomes full width at 768 px and below; the public documents list becomes one column at 640 px and below) belong to the pages.
- Targets: the row is at least 45 px tall and the full row width is the click target, above `--target-min` and the 44 px phone target.

## Accessibility

### Role and pattern

The host is a `listitem` inside the consumer's `list`, so the number of rows is announced ("list, 3 items"). The row's one control is a native `<a href>` or `<button type="button">` around the title; no ARIA role is added to the row. [WAI-ARIA APG Link pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/) and [Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/). The mocks' `div role="link" tabindex="0"` without a key handler is replaced (D-5).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | One stop per row, on the title control, in DOM order. |
| <kbd>Enter</kbd> | Follows the link, or activates the button (`activated`). |
| <kbd>Space</kbd> | Activates the button form (browser default); does nothing on the link form. |

### Focus

Focus lands on the title control, never on the row or the host. The shared ring (`--focus-ring-width` solid `--color-focus-ring`, offset `--focus-ring-offset`) shows on `:focus-visible`; the row's padding keeps it unclipped. Clicking anywhere on the row activates the control and moves focus to it (D-6). When the selected row changes because a different row was activated, focus stays on the control that was activated; the component moves focus nowhere on its own.

### Labelling

- The control's text is the row's name: "Courtyard gathering", "Mira Fern", "Courtyard plan.pdf".
- Avatars and icon tiles are `aria-hidden="true"`; the meta text carries the type ("Notice", "2 KB") so nothing depends on the glyph.
- The unread badge reads "2 unread" through the hidden `unreadLabel` suffix, never a bare "2".
- The selected row has `aria-current="true"`, so the marker is not conveyed by colour alone.

### Announcements

None by the row. The page announces new messages or a profile switch through its own [alert](alert.md) or status region.

### Motion

Only `background-color` transitions, over `--duration-base`. Under `prefers-reduced-motion: reduce` tokens.css shortens it to 0.01 ms; the component adds no animation.

## Content and internationalisation

- The title is the item's name: a conversation subject, a person's name, a document title or a file name. Sentence case for subjects and titles ("Autumn courtyard gathering"); names and file names as given.
- Meta is the first useful detail: the last message body for a conversation ("Shall we meet at the courtyard?"), the profile type ("Member", "Board Member", with a space, D-10), "Type · date" for documents ("Notice · Oct 13, 2026"), "size · date" for assets ("2 KB · Oct 13, 2026"). Parts are separated by a spaced middle dot.
- Dates are "Oct 13, 2026" (content foundation), never the mocks' "10/13/26" or an ISO timestamp; sizes carry a unit ("2 KB"), never the raw "2048" (D-10).
- Unread counts are numbers only; the word "unread" is hidden text from `unreadLabel`.
- Translatable inputs: `unreadLabel`; `title` and `meta` are data or page strings the consumer passes. Data values: subjects, names, file names, dates, sizes.
- Long strings wrap; a French meta about 30 % longer ("Avis · 13 oct. 2026") stays on one line at 320 px and a long title wraps to a second line without moving the badge.

## Performance

- Change detection: `OnPush`, signal inputs; the control kind (`a` or `button`), tile classes and badge are `computed`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the reserved left border and the fixed-size leading visual mean selecting a row or loading its avatar shifts nothing; the row's height is set by its text and visual, both present on first render.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK, no router dependency (the consumer resolves `href`). Composes [avatar](avatar.md) and [badge](badge.md) through its slots and renders the badge markup itself for `unread`.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-list-item title="Courtyard gathering" meta="Can I bring a table?" [unread]="2">` with a `coop-avatar` in the leading slot, when it renders, then the host has `role="listitem"` and holds `.list-item` containing an `aria-hidden` avatar reading "C", `.list-item-title > button[type="button"]` reading "Courtyard gathering", `.list-item-meta` reading "Can I bring a table?" and `.badge.badge-info` reading "2". (L2-REQ-036)
- **AC-2** Given `href="/messages/1"`, when the row renders, then the title control is `<a href="/messages/1">Courtyard gathering</a>` and no `<button>` is rendered. (L2-REQ-036)
- **AC-3** Given the public conversation row with `meta="Shall we meet at the courtyard?"` and a trailing `<span class="list-item-meta">Oct 13, 2026</span>`, when it renders, then the meta shows the last message body under the title and the time sits at the row's end before the unread badge. (L2-REQ-037)
- **AC-4** Given `[unread]="2"`, when the row renders, then the badge's accessible text is "2 unread" while only "2" is visible, and given `[unread]="0"` or `null` no badge is rendered. (L2-REQ-038)
- **AC-5** Given the profile rows "Mira Fern" / "Member" and "Mira Fern" / "Board Member" with `selected` and a trailing success badge "Active" on the first, when they render, then the first row has `aria-current="true"` and the badge, the second has neither, and both titles are buttons. (L2-REQ-019)
- **AC-6** Given `icon="campaign" iconTone="success"` with `meta="Notice · Oct 13, 2026"`, when the row renders, then an `aria-hidden` `.icon-tile.icon-tile-success` holding the "campaign" glyph precedes the text and the meta reads "Notice · Oct 13, 2026". (L2-REQ-035)
- **AC-7** Given `icon="insert_drive_file"` with `title="Courtyard plan.pdf"` and `meta="2 KB · Oct 13, 2026"`, when the row renders, then a neutral `.icon-tile` precedes the text and the meta reads "2 KB · Oct 13, 2026", not "2048 · 10/13/26". (L2-REQ-041)

### States

- **AC-8** Given the pointer over the "Courtyard gathering" row, when it is hovered, then the row fill changes to `--color-bg-subtle` over `--duration-base` and the cursor is a pointer across the whole row. (L2-REQ-036)
- **AC-9** Given `selected`, when the row renders, then `.list-item` has `aria-current="true"`, a `--border-width-thick` `--color-accent` left border and a `--color-accent-subtle` fill, and the text of an unselected sibling starts at the same x position because its left border is reserved. (L2-REQ-036)

### Keyboard and focus

- **AC-10** Given a list of three conversation rows, when <kbd>Tab</kbd> is pressed from before the list, then focus visits each title control once, in order, and no other part of a row is a tab stop. (L2-REQ-036)
- **AC-11** Given focus on the "Courtyard gathering" button, when <kbd>Enter</kbd> or <kbd>Space</kbd> is pressed, then `activated` emits exactly once. (L2-REQ-036)
- **AC-12** Given the "Courtyard plan.pdf" row, when its meta text is clicked, then `activated` emits once and focus is on the title button. (L2-REQ-041)
- **AC-13** Given focus on a title control, when it receives keyboard focus, then a `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is visible and unclipped, on the selected row as well. (L2-REQ-036)

### Screen readers

- **AC-14** Given `<div role="list" aria-label="Conversations">` with three rows, the first selected, when a screen reader enters the list, then it announces "Conversations, list, 3 items" and the first row as "Courtyard gathering, button, current" followed by "Can I bring a table?" and "2 unread". (L2-REQ-036)
- **AC-15** Given the profile switcher rows, when a screen reader reads the "Board Member" row, then it announces "Mira Fern, button" and the meta "Board Member", so the two profiles of the same person are told apart. (L2-REQ-019)

### Theming

- **AC-16** Given any row, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-036)

### Responsive

- **AC-17** Given the asset row "September maintenance report for the courtyard gate.pdf" at 320 px, when measured, then the title wraps onto further lines inside the row, the icon tile stays 3rem wide, and the page has no horizontal scroll. (L2-REQ-041)
- **AC-18** Given the "Courtyard gathering" row at 320 px with an avatar and an unread badge, when measured, then the row is at least 60 px tall, the badge is fully visible at the row's end, and the whole row width activates the control by touch. (L2-REQ-038)

### Motion

- **AC-19** Given `prefers-reduced-motion: reduce`, when a row is hovered, then its fill changes with a 0.01 ms transition and nothing animates. (L2-REQ-036)

### Performance

- **AC-20** Given a list of fifty conversation rows, when one row's `unread` changes, then only that row re-renders (`OnPush` with signal inputs) and the others are untouched. (L2-REQ-038)

## Implementation notes

- Folder `frontend/projects/components/src/lib/list-item/`: `list-item.component.ts`, `list-item.component.html`, `list-item.component.css`, `list-item-icon-tone.ts` (type alias); export from `public-api.ts`.
- Host bindings: `role="listitem"`; `(click)` on the host runs `activate()` when the event target is not inside a different interactive element, which calls `click()` on the inner control so both forms behave the same (D-6).
- One `<ng-template>` holds the title text; the template renders either the `<a>` or the `<button>` branch and projects into it. Slots: `<ng-content select="[slot=leading]">` and `<ng-content select="[slot=trailing]">`, each declared once.
- Component CSS adds `.list-item-text { flex: 1 1 auto; min-width: 0; }`, the control reset (`font: inherit; color: inherit; background: none; border: 0; padding: 0; text-align: left; cursor: pointer`), `.list-item-title { overflow-wrap: anywhere; }` and `.list-item-unread-label` (an inline-block 1 px square, `overflow: hidden`, `clip-path: inset(50%)`). These belong in `components.css` next to `.list-item` (D-11); the rendering page carries them as specimen-only styles until then.
- No CDK primitive. Composes [avatar](avatar.md) and [badge](badge.md) via slots; the page composes it into `role="list"` containers.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Where does the list semantics live?* The host element is the `listitem` and the consumer supplies the `role="list"` container with a name. A `<ul>`/`<li>` cannot be used because the Angular host would sit between them, and a listitem on the inner `div` would be separated from the list by the host; putting the role on the host keeps the list to listitem relationship direct.
- **D-5** *Link or button?* `<a href>` when the row navigates (`href` set), `<button type="button">` when it changes the view in place; the design system requires a native control in place of the mocks' `div role="link"` with no key handler. `href` is a resolved URL so the component has no router dependency.
- **D-6** *What happens when the row is clicked outside the control?* The row forwards the click to its control, so the whole 60 px row is the target while focus and the accessible name stay on the native control (design-system focus rule). Clicks inside a different control in the trailing slot are not forwarded.
- **D-7** *Does the title truncate?* No, it wraps. The design-system content section says titles truncate with an ellipsis, but `components.css` sets no truncation and AGENTS.md requires reflow without loss of content at 400 % zoom; a truncated subject would hide the only identifying text of the row. `overflow-wrap: anywhere` prevents a long file name from overflowing. The design-system content line should be updated to match.
- **D-8** *Who renders the unread badge?* The component, from `unread`, so every unread badge carries the hidden "unread" text the design system requires; a projected badge could forget it. Other trailing content (time, "Active") is projected.
- **D-9** *Is the selected marker reserved on every row?* Yes, `components.css` already gives every `.list-item` a transparent 3px left border, so selecting a row shifts nothing; the mocks' shift is drift.
- **D-10** *How are dates, sizes and profile types shown?* "Oct 13, 2026", "2 KB" and "Board Member", formatted by the consumer per the content foundation; the mocks' "10/13/26", ISO timestamps, "2048" and "BoardMember" are drift the design system lists.
- **D-11** *Which classes does the component add beyond the design system?* `.list-item-text` (the DS used an inline `flex: 1; min-width: 0` style) and `.list-item-unread-label`, plus the control reset and title wrapping rules. They go into `components.css` with the first slice so the mocks, the design system and the library share one stylesheet.
- **D-12** *Does the profile switcher row show an avatar?* No. The mocks show text-only profile rows and the design-system profile example has no avatar; the leading slot stays empty and the type in the meta tells the profiles apart.
