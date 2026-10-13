# Filter chips

| Field | Value |
|---|---|
| Selector | `coop-filter-chips`, `coop-filter-chip` |
| Library path | `frontend/projects/components/src/lib/filter-chips/` |
| Status | planned |
| Traces to | L2-REQ-025, L2-REQ-030, L2-REQ-035 |
| Design system | [`filter-chips.html`](../../design-system/components/filter-chips.html) |
| Source mocks | [`pages/admin-documents/default`](../../mocks/pages/admin-documents/default.html), [`pages/admin-documents/reports`](../../mocks/pages/admin-documents/reports.html), [`pages/admin-maintenance/default`](../../mocks/pages/admin-maintenance/default.html), [`pages/admin-maintenance/new`](../../mocks/pages/admin-maintenance/new.html), [`pages/public-maintenance/default`](../../mocks/pages/public-maintenance/default.html), [`pages/public-maintenance/done`](../../mocks/pages/public-maintenance/done.html), [`pages/public-documents/default`](../../mocks/pages/public-documents/default.html), [`pages/public-documents/notices`](../../mocks/pages/public-documents/notices.html) |
| Rendering | [`filter-chips.html`](filter-chips.html) |

## Purpose and scope

Filter chips are a row of pill-shaped toggle buttons that narrow a list by one category: a maintenance list by status ("All", "New", "Received", "Started", "Completed") or a document list by type ("All Documents", "Notices", "By-Laws", "Reports"). The group is single-select: exactly one chip is pressed at a time, the first ("All") by default, and pressing another moves the accent fill to it and tells the page which category to show.

Use something else instead when:

- the control switches between views of one record: [tabs](tabs.md);
- the control triggers an action: [button](button.md);
- the filter is free text: [search bar](search-bar.md).

Out of scope:

- Fetching or filtering the list. The page owns the data: it listens to `valueChange`, queries the matching endpoint (L2-REQ-030, L2-REQ-035) and renders the cards, the loading spinner or the empty state.
- Announcing the result. The page's list region announces "4 documents" or "No requests found" ([alert](alert.md), [empty state](empty-state.md)); the chips only expose `aria-pressed`.
- Combining several filters. A page with chips and a search box ([search bar](search-bar.md)) decides how they combine.

## Usage

Every `.filter-btn` (120 uses on 26 screens, admin) and `.filter-tab` (76 uses on 19 screens, public) in `docs/mocks` is one of the configurations below. The dialog screens show the same row behind the overlay. In the mocks each chip loads a separate state page; the app swaps the list in place.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-maintenance/default`, `new`, `received`, `started`, `done`, `loading`, `empty`, `no-results`, `detail-*`, `comments*`; `dialogs/admin-maintenance-create/*` | five chips, label "Filter requests by status" | "All", "New", "Received", "Started", "Completed"; one pressed | pressed, default; the row stays while the list loads or is empty | canvas |
| `pages/admin-documents/default`, `notices`, `bylaws`, `reports`, `loading`, `empty`, `no-results`; `dialogs/admin-document-*` | four chips, label "Filter documents by type" | "All Documents", "Notices", "By-Laws", "Reports"; one pressed | pressed, default | canvas |
| `pages/public-maintenance/default`, `new`, `started`, `done`, `loading`, `empty`, `no-results`; `dialogs/public-maintenance-*` | four chips, label "Filter requests by status" | "All", "New", "Started", "Done"; one pressed | pressed, default | canvas |
| `pages/public-documents/default`, `notices`, `bylaws`, `reports`, `loading`, `empty`, `no-results`; `dialogs/public-document-viewer` | four chips, label "Filter documents by type" | "All", "Notices", "By-Laws", "Reports"; one pressed | pressed, default | canvas |

Every row is buildable with the API below: four or five text-only chips in a labelled single-select group with one pressed value.

## Anatomy

1. **Group** — `.filter-tabs`, `role="group"`, `aria-label` from `label`. Flex row, `--space-2` gap, wrapping onto further rows when the chips do not fit (D-6).
2. **Chip** — `.filter-btn`, native `<button type="button" aria-pressed>`. Pill (`--radius-full`), `--border-width-hairline` `--color-border-strong` edge, `--space-2` by `--space-4` padding, `--text-body-sm` label, `--color-bg-surface` fill, `--color-fg-default` label, `white-space: nowrap`.
3. **Pressed chip** — `aria-pressed="true"`: `--color-accent` fill and edge, `--color-fg-on-accent` label.

Host: `coop-filter-chips` is `display: block` and renders the `.filter-tabs` group; `coop-filter-chip` is `display: contents` and renders its own `.filter-btn` button inside the group. Classes and attributes go on those native elements, never on the hosts.

## API

### Inputs

`coop-filter-chips`:

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | `aria-label` of the group: "Filter requests by status", "Filter documents by type". |
| `value` | `string \| null` | `null` | no | The `value` of the pressed chip. `null` or a value no chip has presses the first chip (D-7). |

`coop-filter-chip`:

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `string` | — | yes | Identifies the category (`all`, `new`, `received`, `started`, `completed`; `notices`, `bylaws`, `reports`). Unique within the group. |

Booleans: none. All inputs are signal inputs.

### Outputs

`coop-filter-chips`:

| Output | Payload | Emitted when |
|---|---|---|
| `valueChange` | `string` (the newly pressed `value`) | A chip other than the pressed one is activated by pointer, <kbd>Enter</kbd> or <kbd>Space</kbd>. Not emitted when the pressed chip is activated again (D-8) or when `value` changes from outside. |

`coop-filter-chip` has no outputs.

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `coop-filter-chip` default | text | The chip label and accessible name: "All Documents", "By-Laws". No icons or counts (design-system content rule). |
| `coop-filter-chips` default | `coop-filter-chip` elements only | Projected into the group in DOM order. |

Translation: the group `label` is an input and each chip label is projected text, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Pill | — (`.filter-btn`) | The only variant. The public mocks' `.filter-tab` (12 px corners, muted label) is unified on this look by the design system; the component renders `.filter-btn` in both apps (D-4). |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | 2.375rem (38 px: `--text-body-sm` line plus `--space-2` top and bottom plus the hairline edges) | `--space-2` by `--space-4` | `--text-body-sm` |

Width comes from the label plus padding; chips never shrink or truncate (`white-space: nowrap`).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | `aria-pressed="false"` | `--color-bg-surface` fill, `--color-border-strong` edge, `--color-fg-default` label | Role button, name = label, pressed = false |
| Hover | `:hover` on an unpressed chip | Edge becomes `--color-accent` over `--duration-base`; a pressed chip does not change | — |
| Focus | `:focus-visible` | Shared ring `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` | — |
| Active | `:active` | Same as hover; the press takes effect on `click` | — |
| Pressed | `aria-pressed="true"` | `--color-accent` fill and edge, `--color-fg-on-accent` label | Pressed = true; exactly one chip in the group |
| Disabled | — | Not implemented (D-9) | — |
| Loading | — | None of its own; the chips stay operable while the page's list loads (D-9) | — |

## Markup

```html
<!-- rendered: admin documents, "All Documents" pressed -->
<div class="filter-tabs" role="group" aria-label="Filter documents by type">
  <button class="filter-btn" type="button" aria-pressed="true">All Documents</button>
  <button class="filter-btn" type="button" aria-pressed="false">Notices</button>
  <button class="filter-btn" type="button" aria-pressed="false">By-Laws</button>
  <button class="filter-btn" type="button" aria-pressed="false">Reports</button>
</div>
```

```html
<!-- rendered: admin maintenance, "New" pressed -->
<div class="filter-tabs" role="group" aria-label="Filter requests by status">
  <button class="filter-btn" type="button" aria-pressed="false">All</button>
  <button class="filter-btn" type="button" aria-pressed="true">New</button>
  <button class="filter-btn" type="button" aria-pressed="false">Received</button>
  <button class="filter-btn" type="button" aria-pressed="false">Started</button>
  <button class="filter-btn" type="button" aria-pressed="false">Completed</button>
</div>
```

Hover, focus and active add no markup; pressing moves `aria-pressed="true"` to another button. The public rows differ only in their labels.

```html
<!-- consumer -->
<coop-filter-chips label="Filter documents by type" [value]="type()" (valueChange)="type.set($event)" data-testid="documents-filter-tabs">
  <coop-filter-chip value="all" data-testid="documents-filter-all">All Documents</coop-filter-chip>
  <coop-filter-chip value="notices" data-testid="documents-filter-notices">Notices</coop-filter-chip>
  <coop-filter-chip value="bylaws" data-testid="documents-filter-bylaws">By-Laws</coop-filter-chip>
  <coop-filter-chip value="reports" data-testid="documents-filter-reports">Reports</coop-filter-chip>
</coop-filter-chips>
```

Consumers put `data-testid` on the host elements; `coop-filter-chip` forwards it to its button so the existing page objects keep working (D-10). The classes, `role="group"` and `aria-pressed` are part of the contract.

## Design

- Group: flex row, gap `--space-2`, `flex-wrap: wrap` (D-6); the page below it adds its own `--space-5` margin.
- Chip: padding `--space-2` `--space-4`, border `--border-width-hairline` solid, radius `--radius-full`, font `--text-body-sm`, `cursor: pointer`, `white-space: nowrap`.
- Transitions: `border-color` and `background-color` over `--duration-base` with `--ease-standard`. Nothing moves.
- Layer: none; the row sits in the flow of the page above the list.

Component tokens: none. `.filter-btn` and `.filter-tabs` consume semantic tokens directly in `components.css`; the two apps share one look by design.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Chip fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Chip edge | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-500` |
| Chip label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Hover edge | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Pressed fill and edge | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Pressed label | `--color-fg-on-accent` | `--palette-white` | `--palette-white` |
| Page behind the row | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-50` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Chip label |
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Pressed label |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Chip edge against the page (1.4.11) |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Hovered and pressed edge against the page |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |

The pressed state is conveyed by the fill and by `aria-pressed`, not by colour alone. Under `forced-colors: active` the edge and ring become system colours (tokens.css); the pressed fill is lost, so the component draws the pressed chip with a thicker `--border-width-thick` `CanvasText` edge under that media query (D-11).

## Responsive behaviour

- No media rule changes the chips themselves (design-system page). The admin maintenance and documents pages change their surrounding toolbars at 768 px and below; the row is unaffected.
- The group wraps (D-6): at 320 px "All Documents · Notices · By-Laws · Reports" (about 415 px of chips) becomes two rows, and the five admin status chips (about 430 px) become two rows. Nothing scrolls sideways and no chip is hidden off-screen.
- The public rows "All · New · Started · Done" and "All · Notices · By-Laws · Reports" fit one row at 360 px and wrap at 320 px.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom every chip stays visible and operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: each chip is 38 px tall and at least 56 px wide, above the 24 px `--target-min`, with a `--space-2` gap in both directions (accessibility foundation).

## Accessibility

### Role and pattern

Native `<button type="button">` with `aria-pressed`: the [WAI-ARIA APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) in its toggle form, inside a `role="group"` named by `aria-label`. The mocks use an `.active` class with no state and no group label; both are design-system requirements. The group is not a radiogroup or tablist: each chip is its own tab stop and there are no arrow keys (D-12).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus through every chip in DOM order; each chip is a tab stop. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Presses the focused chip: it becomes `aria-pressed="true"`, the previously pressed chip becomes `"false"`, and `valueChange` emits. On the pressed chip, nothing happens. |

### Focus

Focus lands on the native chip button, never on a host. The shared ring (`--focus-ring-width` solid `--color-focus-ring`, offset `--focus-ring-offset`) shows on `:focus-visible` and must not be clipped by the page header. Pressing a chip keeps focus on it while the page replaces the list, so a keyboard user can move straight to the next chip. When `value` changes from outside, focus does not move.

### Labelling

- Each chip's accessible name is its projected text ("By-Laws").
- The group is named by `label` ("Filter documents by type"), so a screen reader announces the group on entry.
- `aria-pressed` is `"true"` on exactly one chip and `"false"` on every other; no chip omits the attribute.

### Announcements

None by the chips. The page's list region announces the result of the filter ("4 documents", "No requests found") in a polite live region (design-system requirement; [alert](alert.md)).

### Motion

Only `border-color` and `background-color` transition, over `--duration-base`. Under `prefers-reduced-motion: reduce` tokens.css shortens `--duration-base` to 0.01 ms; the component adds no animation.

## Content and internationalisation

- Labels are the category name in Title Case, one to three words: "All", "All Documents", "Notices", "By-Laws", "Reports", "New", "Received", "Started", "Completed". The first chip is the "All" chip and is pressed by default.
- The admin status chips match the status names in L2-REQ-025 ("New", "Received", "Started", "Completed"). The public mock shows "All", "New", "Started", "Done" with no "Received" chip; the component renders whatever labels the page projects and does not rename them (D-13).
- No counts or icons in a chip; none are implemented.
- Translatable inputs: `label`; chip labels are the consumer's projected text. Data values: none.
- Long labels do not wrap inside a chip; the group wraps instead, so a French row ("Tous les documents", "Avis", "Règlements", "Rapports", about 30 % longer) becomes two rows at 320 px without clipping.

## Performance

- Change detection: `OnPush`, signal inputs; the pressed state of each chip is one `computed` comparing its `value` to the group's.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: chip widths come from their labels and never change with state (the pressed fill replaces the edge colour, not the edge width), so pressing a chip shifts nothing; the wrapped row's height is fixed for a given width.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK.

## Acceptance criteria

### Rendering

- **AC-1** Given the admin documents chips with `value="all"`, when they render, then the DOM holds a `.filter-tabs[role="group"][aria-label="Filter documents by type"]` with four `.filter-btn` buttons labelled "All Documents", "Notices", "By-Laws" and "Reports", the first with `aria-pressed="true"` and the others with `aria-pressed="false"`. (L2-REQ-035)
- **AC-2** Given the "All Documents" chip is pressed, when it renders, then its fill and edge are `--color-accent` and its label `--color-fg-on-accent`, while "Notices" has a `--color-bg-surface` fill, a `--color-border-strong` edge and a `--color-fg-default` label with a contrast of at least 4.5:1. (L2-REQ-035)
- **AC-3** Given the admin maintenance chips, when they render, then the group is labelled "Filter requests by status" and holds the five chips "All", "New", "Received", "Started" and "Completed" in that order. (L2-REQ-025)
- **AC-4** Given the public maintenance chips "All", "New", "Started" and "Done", when they render, then each is a `.filter-btn` pill with the same edge, padding and label colour as the admin chips, and no `.filter-tab` class is emitted. (L2-REQ-030)
- **AC-5** Given `<coop-filter-chip value="reports" data-testid="documents-filter-reports">Reports</coop-filter-chip>`, when it renders, then the `.filter-btn` button carries `data-testid="documents-filter-reports"`. (L2-REQ-035)

### States

- **AC-6** Given the unpressed "Notices" chip, when it is hovered, then its edge becomes `--color-accent` over `--duration-base` and its fill and label do not change; and given the pressed "All Documents" chip, when it is hovered, then nothing changes. (L2-REQ-035)
- **AC-7** Given "All" is pressed in the admin maintenance group, when "New" is activated by click, then "New" gets `aria-pressed="true"`, "All" gets `aria-pressed="false"`, no other chip changes and `valueChange` emits `"new"` once. (L2-REQ-025)
- **AC-8** Given "Reports" is pressed, when it is activated again, then it stays pressed and `valueChange` does not emit. (L2-REQ-035)
- **AC-9** Given `value` is set to `"bylaws"` from the page, when change detection runs, then "By-Laws" becomes the pressed chip and `valueChange` does not emit. (L2-REQ-035)
- **AC-10** Given `value` is `null`, when the public maintenance chips render, then "All" is pressed. (L2-REQ-030)
- **AC-11** Given the page is loading the "Started" requests after that chip was pressed, when the chips are inspected, then every chip is still enabled and "Started" is still the only pressed chip. (L2-REQ-030)

### Keyboard and focus

- **AC-12** Given focus is before the documents group, when <kbd>Tab</kbd> is pressed four times, then focus visits "All Documents", "Notices", "By-Laws" and "Reports" in order, each showing the `--color-focus-ring` ring at `--focus-ring-offset`. (L2-REQ-035)
- **AC-13** Given focus is on the "Completed" chip, when <kbd>Space</kbd> is pressed, then "Completed" becomes pressed, `valueChange` emits `"completed"`, and focus stays on "Completed" while the list is replaced. (L2-REQ-025)
- **AC-14** Given focus is on the "Notices" chip, when <kbd>→</kbd> is pressed, then focus does not move and nothing is pressed, because the chips are independent toggle buttons. (L2-REQ-035)

### Screen readers

- **AC-15** Given the documents chips, when a screen reader enters the group, then it announces "Filter documents by type, group" and the first chip as "All Documents, toggle button, pressed". (L2-REQ-035)
- **AC-16** Given "New" has just been pressed, when a screen reader reads "All", then it is announced as "All, toggle button, not pressed". (L2-REQ-025)

### Theming

- **AC-17** Given any chip group, when the page sets `data-theme="dark"`, then the chips render with the same light tokens because no dark theme is defined, and no hard-coded colour appears in their styles. (L2-REQ-035)

### Responsive

- **AC-18** Given the four admin document chips at 320 px, when measured, then the group wraps onto two rows, every chip is fully visible, no label wraps or truncates, and the page does not scroll horizontally. (L2-REQ-035)
- **AC-19** Given the five admin status chips at 320 px and 400 % zoom, when the page reflows, then every chip remains visible and operable by touch, each at least 38 px tall with a `--space-2` gap. (L2-REQ-025)
- **AC-20** Given the four public document chips at 360 px, when measured, then they sit on one row inside the viewport. (L2-REQ-035)

### Motion

- **AC-21** Given `prefers-reduced-motion: reduce`, when "Notices" is pressed, then its fill and edge change with a 0.01 ms transition and nothing animates. (L2-REQ-035)

### Performance

- **AC-22** Given a page with the five status chips and a list of four requests, when a request card's input changes, then no chip re-renders (`OnPush` with signal inputs), and pressing a chip re-renders only the two chips whose `aria-pressed` changed. (L2-REQ-030)

## Implementation notes

- Folder `frontend/projects/components/src/lib/filter-chips/`: `filter-chips.component.ts|html|css`, `filter-chip.component.ts|html|css`; export both from `public-api.ts`.
- `coop-filter-chips` provides itself through DI; each `coop-filter-chip` injects the parent to read the pressed `value` and to call `select(value)` on click. The parent compares, updates its internal pressed signal and emits `valueChange` only when the value differs.
- `coop-filter-chip` sets `display: contents` on its host and copies the host's `data-testid` attribute onto its button in an `afterNextRender` hook (D-10).
- The `.filter-tabs` rule in `components.css` gains `flex-wrap: wrap` in the first implementation slice (D-6); until then the component's own stylesheet sets it.
- No CDK primitive; composes nothing. The maintenance and documents pages of both apps compose it.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Does the component emit `.filter-tab` for the public app?* No, `.filter-btn` everywhere. The design system keeps both class names only so the mocks' stylesheet still applies, and says new work uses `.filter-btn`; no e2e page object selects by either class.
- **D-5** *Which group semantics?* A `role="group"` with an `aria-label`, holding toggle buttons with `aria-pressed`, exactly one pressed. The design-system page names this as the requirement; a tablist would imply panels and arrow keys that the pages do not have, and a radiogroup would hide the "All" chip's button semantics.
- **D-6** *Does the row scroll sideways or wrap?* It wraps. The design system kept both behaviours from the mocks (admin wraps, public scrolls); AGENTS.md requires every screen to reflow at 320 px and 400 % zoom with no horizontal scrolling, and a scrolling row hides chips from the older members this product serves. `components.css` currently sets `overflow-x: auto` only; the rendering applies the wrap as a specimen-only style until the stylesheet catches up.
- **D-7** *Which chip is pressed when `value` is null or unknown?* The first. The content rule says the "All" chip comes first and is pressed by default, and a single-select group always has one pressed chip.
- **D-8** *Can the pressed chip be unpressed?* No. With an "All" chip the group always has a meaningful selection; pressing the pressed chip is a no-op and emits nothing, which also stops a double tap from reloading the list.
- **D-9** *Is there a disabled or loading chip?* No. No mock or design-system state shows one; the loading mocks render the row unchanged above the spinner, so the chips stay operable while the page loads.
- **D-10** *How do e2e test ids reach the chip buttons?* The chip copies the host's `data-testid` onto its button. The existing page objects use `documents-filter-tabs` on the group and `documents-filter-*` on the chips; copying keeps consumers' templates plain attributes rather than adding an input.
- **D-11** *How is the pressed chip shown under forced colours?* With a `--border-width-thick` `CanvasText` edge. Forced colours remove the accent fill, so the pressed chip needs a shape cue in addition to `aria-pressed`.
- **D-12** *Arrow keys between chips?* No. The design-system keyboard table lists Tab and Enter/Space only; each chip is a tab stop, and arrow keys belong to the composite patterns (tabs, radiogroup) this group is not.
- **D-13** *The public app shows "Done" and omits "Received" while L2-REQ-025 and the admin app use "Received" and "Completed"; does the component normalise them?* No. Chip labels are the page's content; the component renders what is projected. The public page copy needs an `engineering-requirements` and content decision outside this CRD.
