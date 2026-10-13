# Search bar

| Field | Value |
|---|---|
| Selector | `coop-search-bar` |
| Library path | `frontend/projects/components/src/lib/search-bar/` |
| Status | planned |
| Traces to | L2-REQ-035, L2-REQ-036, L2-REQ-041, L2-REQ-057, L2-REQ-065 |
| Design system | [`search-bar.html`](../../design-system/components/search-bar.html) |
| Source mocks | [`pages/admin-assets/default`](../../mocks/pages/admin-assets/default.html), [`pages/admin-assets/no-results`](../../mocks/pages/admin-assets/no-results.html), [`pages/admin-users/default`](../../mocks/pages/admin-users/default.html), [`pages/admin-users/no-results`](../../mocks/pages/admin-users/no-results.html), [`pages/admin-documents/bylaws`](../../mocks/pages/admin-documents/bylaws.html), [`pages/admin-documents/no-results`](../../mocks/pages/admin-documents/no-results.html), [`pages/admin-messaging/default`](../../mocks/pages/admin-messaging/default.html), [`pages/admin-messaging/no-results`](../../mocks/pages/admin-messaging/no-results.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html) |
| Rendering | [`search-bar.html`](search-bar.html) |

## Purpose and scope

A search bar is a single-line text field with a leading magnifier that filters the content of the current view as the person types: the users, documents, assets and conversations lists in the admin app, and the search slot in the admin top bar. It has no submit button and no clear button; the list below it reacts to every keystroke and shows its own empty state when nothing matches ("No documents found").

Use something else instead when:

- the value is saved with a form and needs a label above it: [form field](form-field.md);
- the choice is one of a few fixed categories (All, Notices, Bylaws, Reports): [filter chips](filter-chips.md);
- the input composes a message or comment: that bare input belongs to the messaging and maintenance-detail screens.

Out of scope:

- Filtering itself: which fields are matched, whether the query goes to the server, debouncing, and resetting to the first page. The page owns the list and handles `valueChange`.
- The no-results presentation ([empty state](empty-state.md)) and the result count announcement ([pagination](pagination.md) "Showing 1–2 of 5 users").
- The row the bar sits in: `.page-actions` beside the "Add User" button, `.conv-toolbar`, or the [top bar](top-bar.md). Those containers set the bar's width.

## Usage

Every search input in `docs/mocks` is one of the configurations below: 31 `.search-bar` containers (the admin top bar on every admin screen and the dashboard header) and 33 bare `.search-input` / `.conv-search-input` inputs on the list pages. The design system folds the bare inputs into the form field; this CRD renders them as search bars (D-4).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| every admin page with the top bar (`pages/admin-users/*`, `admin-assets/*`, `admin-documents/*`, `admin-roles/*`, `admin-settings/*`, `admin-invitations/*`, dialogs on them) | `label="Search"`, `placeholder="Search..."` | no value | default | top bar (surface) |
| `pages/admin-dashboard/*` header | `label="Search"`, `placeholder="Search..."` | no value | default | surface |
| `pages/admin-users/*` page actions | `label="Search users"`, `placeholder="Search users..."` | no value; no-results list below | default, no results | canvas |
| `pages/admin-documents/*` beside the type filter chips | `label="Search documents"`, `placeholder="Search documents..."` | no value; "No documents found" below | default, no results | canvas |
| `pages/admin-assets/*` page actions | `label="Search assets"`, `placeholder="Search assets..."` | no value; no-results list below | default, no results | canvas |
| `pages/admin-messaging/*` conversation toolbar | `label="Search conversations"`, `placeholder="Search conversations..."` | no value; no-results list below | default, no results | surface |
| design-system states only | `label="Search"` | value "lease" | focus, with text | surface |

Every row is buildable with the API below: a placeholder, an accessible name, a two-way value and the width of whatever container holds it.

## Anatomy

1. **Container** — `.search-bar`, `role="search"`. Flex row, gap `--space-2`, padding `--space-2` `--space-3`, hairline `--color-border-strong` border, `--radius-md`, `--color-bg-surface` fill. Takes the shared focus ring on `:focus-within`.
2. **Icon** — `<span class="material-icons" aria-hidden="true">search</span>`, `--icon-size` 1.125rem, `--color-fg-muted`, never shrinks.
3. **Input** — `<input type="text">`, borderless and transparent, `flex: 1`, `min-width: 0`, `--text-body-sm`, `--color-fg-default`; placeholder in `--color-fg-subtle`; named by `aria-label`.

Host: `coop-search-bar` is `display: block` with `min-width: 0` so it shrinks inside a flex row; the width is the container's. It carries no classes; `.search-bar` and the attributes go on the inner elements.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The accessible name of the input (`aria-label`) and of the search landmark (`aria-label` on `.search-bar`): "Search", "Search users". Says what is searched when a page has more than one bar. |
| `placeholder` | `string` | — | yes | Placeholder text ending in three dots: "Search users...". A hint only, never the name. |
| `value` | `string` (model) | `''` | no | Two-way (`[(value)]`). Reflects the input's value; the page sets it to restore a query and clears it to reset the list. |
| `id` | `string \| null` | `null` | no | The input's id; `coop-search-{n}` when null. |

All inputs are signal inputs; `value` is a `model()`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `valueChange` | `string` | On every native `input` event, with the whole current value, so the list filters as the person types. Not emitted when the page sets `value`. No debounce (D-6). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The icon is fixed and the copy arrives through inputs. |

Translation: `label` and `placeholder` are inputs, so the component holds no copy (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| single | — | One look everywhere: the top bar and the list pages. The bare `.search-input` look in the mocks is not a variant (D-4). |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| single | — | about 2.5rem (`--space-2` padding around a `--text-body-sm` line and the 1.125rem icon) | `--space-2` `--space-3` | `--text-body-sm` |

Width comes from the container: the top bar gives it a fixed share, the `.page-actions` row and the `.conv-toolbar` let it fill the space left of the button, and at phone widths those rows wrap and the bar takes the full width (D-7).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Bordered container, muted magnifier, placeholder text | Landmark "search" named by `label`; input named by `label` |
| Hover | `:hover` | No change; the text cursor shows over the input | — |
| Focus | `:focus-within` on the container | Shared ring: `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` around the whole bar; the input's own outline is suppressed | — |
| With text | `value` non-empty | Typed text in `--color-fg-default`; the placeholder is hidden | Value reported natively |
| No results | the page's list is empty for the value | The bar does not change; the list shows its empty state | The page announces the count |

There is no disabled, busy or error state: no mock needs one and the bar never submits (D-8).

## Markup

```html
<!-- rendered: default -->
<coop-search-bar>
  <div class="search-bar" role="search" aria-label="Search users">
    <span class="material-icons" aria-hidden="true">search</span>
    <input id="coop-search-1" type="text" placeholder="Search users..." aria-label="Search users">
  </div>
</coop-search-bar>
```

```html
<!-- rendered: with text -->
<coop-search-bar>
  <div class="search-bar" role="search" aria-label="Search documents">
    <span class="material-icons" aria-hidden="true">search</span>
    <input id="coop-search-2" type="text" placeholder="Search documents..." aria-label="Search documents" value="bylaw">
  </div>
</coop-search-bar>
```

Focus adds nothing to the DOM; the ring comes from `:focus-within`.

```html
<!-- consumer -->
<coop-search-bar label="Search users" placeholder="Search users..." [(value)]="query"></coop-search-bar>
<coop-search-bar label="Search documents" placeholder="Search documents..." (valueChange)="filterDocuments($event)"></coop-search-bar>
```

The classes and attributes above are part of the contract: the e2e page objects locate the bar by `.search-bar`, `role="search"` and the input's accessible name.

## Design

- Container padding `--space-2` `--space-3`, gap `--space-2`, border `--border-width-hairline` solid `--color-border-strong`, radius `--radius-md`, fill `--color-bg-surface`.
- Icon `--icon-size` 1.125rem (`.material-icons` with the block's override), `--color-fg-muted`, `flex-shrink: 0`.
- Input `--text-body-sm`, `--color-fg-default`, `flex: 1 1 0`, `min-width: 0`, no border, transparent background, no own outline.
- Focus ring on the container at `:focus-within`; must not be clipped by the top bar's overflow.
- Motion: none.
- Layer: none; inside the sticky top bar it inherits `--z-sticky` from the bar.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--icon-size` | 1.125rem inside `.search-bar` | — (the block's only override of a shared knob) |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Container fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Container border | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-500` |
| Icon | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Typed text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Placeholder | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-500` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Typed text |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Placeholder |
| `--color-fg-muted` | `--color-bg-surface` | 3:1 | Magnifier (meaningful icon, 1.4.11) |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Container border on the top bar |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Container border on the page |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the top bar |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |

The mocks filled the container with the canvas grey and a decorative border; the design system uses the surface fill with a strong border so the boundary reaches 3:1. Under `forced-colors: active` the border becomes `CanvasText` and the ring `Highlight` from tokens.css; the component adds no colour of its own.

## Responsive behaviour

- The mocks define no media rule for the bar; its height and padding are the same at every width (design-system page).
- The bar fills its container: `min-width: 0` on both host and input lets it shrink in a flex row, and the mocks' fixed 200 px input width is dropped (design-system page).
- Below `--layout-breakpoint-md` (768 px) the `.page-actions` row that holds the bar and the "Add User" button, and the `.conv-toolbar` that holds it beside "New Conversation", wrap so the bar takes the full row (D-7); in the admin top bar it keeps the share the bar gives it.
- The placeholder "Search conversations..." fits on one line at 320 px inside a full-width bar; a longer value scrolls inside the input natively and never widens the bar.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom the bar stays reachable and operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: the container is about 40 px tall, above the 24 px `--target-min`; a tap anywhere inside it focuses the input.

## Accessibility

### Role and pattern

A native text input named "Search" inside a `role="search"` landmark ([WAI-ARIA search role](https://www.w3.org/TR/wai-aria-1.2/#search)); no other ARIA. The component renders the landmark on `.search-bar` itself (D-5).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus into and out of the input in DOM order. |
| Typing, <kbd>Backspace</kbd> | Edits the value; each change emits `valueChange` and the list filters. |
| <kbd>Enter</kbd> | Nothing; the bar is not in a form and has no submit. |
| <kbd>Esc</kbd> | Nothing; the value is not cleared (D-8). |

### Focus

Focus lands on the native input, never on the host or the container. The ring is drawn around the whole `.search-bar` on `:focus-within`, so the icon, border and input read as one focused control; the input's own `:focus-visible` outline is turned off because the container shows the ring. The ring must not be clipped by the top bar. Filtering never moves focus: the list re-renders below while the person keeps typing.

### Labelling

- The input's accessible name is `label` through `aria-label`: "Search" in the top bar, "Search users", "Search documents", "Search assets", "Search conversations" on the lists. The placeholder is only a hint.
- The landmark carries the same `aria-label`, so a page with the top-bar search and a list search exposes two distinctly named search landmarks.
- No `aria-describedby`; the bar has no hint or error.

### Announcements

None by the bar. The page announces the result count or the empty state through its own status region ([pagination](pagination.md), [empty state](empty-state.md)).

### Motion

None. Nothing transitions or animates, so `prefers-reduced-motion` changes nothing.

## Content and internationalisation

- Placeholders are "Search..." with three dots, or "Search {things}..." naming the list in lower case: "Search users...", "Search documents...", "Search assets...", "Search conversations...". Never an instruction ("Type to search").
- Accessible names are "Search" or "Search {things}" without the dots.
- No-results copy belongs to the list: "No documents found".
- Translatable inputs: `label`, `placeholder`. Data values: `value`, what the person typed.
- A French placeholder about 30 % longer ("Rechercher des conversations...") fits inside a full-width bar at 320 px; if the container is narrower the placeholder clips inside the input natively and the bar does not grow.

## Performance

- Change detection: `OnPush`, signal inputs, `value` as a `model`; the `input` handler calls `value.set` and nothing else.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the container height is fixed by its padding and line height, so typing never changes it; the page's list may change height below.
- Weight: imports `@angular/core` and `@angular/common` only; no `@angular/forms`, no CDK.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-search-bar label="Search users" placeholder="Search users...">`, when it renders, then the DOM holds `<div class="search-bar" role="search" aria-label="Search users">` containing a `.material-icons` span reading "search" with `aria-hidden="true"` and a text input with `placeholder="Search users..."` and `aria-label="Search users"`. (L2-REQ-065)
- **AC-2** Given the rendered bar, when measured, then the container has a `--color-border-strong` hairline border, `--radius-md` corners and a `--color-bg-surface` fill, and the icon is 1.125rem in `--color-fg-muted`. (L2-REQ-065)
- **AC-3** Given `label="Search documents"` and `placeholder="Search documents..."` on the documents page with the "Bylaws" filter active, when it renders beside the filter chips, then the placeholder reads "Search documents..." and the bar is the same look as the top-bar search. (L2-REQ-035)
- **AC-4** Given `label="Search conversations"` in the conversation toolbar, when it renders, then its accessible name is "Search conversations" and the placeholder reads "Search conversations...". (L2-REQ-036)

### States

- **AC-5** Given an empty users search, when the person types "m", "i", "r", "a", then `valueChange` emits "m", "mi", "mir" and "mira" in turn, without waiting, so the users list filters as they type and shows from its first page. (L2-REQ-057)
- **AC-6** Given the page sets `[value]="'kitchen'"` on the assets search, when it renders, then the input shows "kitchen", the placeholder is hidden and `valueChange` does not emit. (L2-REQ-041)
- **AC-7** Given the assets search holds "lease" and the list below is empty, when the person clears the text with <kbd>Backspace</kbd>, then `valueChange` emits "" and the bar itself shows no empty or error styling. (L2-REQ-041)

### Keyboard and focus

- **AC-8** Given the users search, when the person presses <kbd>Tab</kbd> onto it, then focus is on the native input and a `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is drawn around the whole `.search-bar`, not only the input. (L2-REQ-065)
- **AC-9** Given focus in the documents search with the text "by", when the person presses <kbd>Enter</kbd>, then nothing submits or navigates and the value stays "by". (L2-REQ-035)
- **AC-10** Given the person taps the magnifier icon on a touch device, when the tap lands, then the input receives focus. (L2-REQ-065)

### Screen readers

- **AC-11** Given the users page with the top-bar search and the users search, when the landmarks are listed, then two search landmarks are reported, named "Search" and "Search users". (L2-REQ-057)
- **AC-12** Given the top-bar search, when queried by assistive technology, then the input's role is textbox, its name is "Search" and the icon is not read. (L2-REQ-065)

### Theming

- **AC-13** Given any search bar, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-065)

### Responsive

- **AC-14** Given the users page at 320 px, when measured, then the search bar spans the full width of its wrapped actions row, its placeholder "Search users..." is fully visible and nothing scrolls horizontally. (L2-REQ-057)
- **AC-15** Given the conversation toolbar at 320 px with the "New Conversation" button, when measured, then the toolbar wraps, the bar spans the full row above the button with "Search conversations..." fully visible, nothing overflows the list panel, and the bar stays at least 40 px tall. (L2-REQ-036)
- **AC-16** Given the users search at 320 px and 400 % zoom, when the page reflows, then the bar remains reachable and operable and the ring is unclipped. (L2-REQ-057)

### Performance

- **AC-17** Given the users page with the search bar and a twenty-row list, when a list row's input changes, then the search bar does not re-render (`OnPush` with signal inputs), and typing re-renders only the bar. (L2-REQ-057)

## Implementation notes

- Folder `frontend/projects/components/src/lib/search-bar/`: `search-bar.component.ts`, `search-bar.component.html`, `search-bar.component.css`; export from `public-api.ts`.
- `value = model('')`; the template binds `[value]="value()"` and `(input)="value.set($event.target.value)"`; `label` and `placeholder` are `input.required<string>()`.
- Host styles: `:host { display: block; min-width: 0; }`. The `.search-bar` rules come from the shared foundation stylesheet; the component's own stylesheet holds only the host rule.
- The id counter is a module-level variable; a consumer-supplied `id` wins.
- No CDK primitive. Composes nothing; [top bar](top-bar.md) composes it, and the users, documents, assets and messaging pages place it in their action rows.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Are the list-page `.search-input` fields search bars or form fields?* Search bars. The design-system page folds them into the form field, but they have no visible label, which the form field requires, and the page's own do/don't rejects "a bare input with no container: no visible boundary or icon, so it does not read as search". One component with the magnifier serves the top bar and all four lists with their placeholders ("Search users...", "Search documents...", "Search assets...", "Search conversations...").
- **D-5** *Where does `role="search"` go?* On `.search-bar`, rendered by the component. The design system requires the landmark on the surrounding container; rendering it on the bar guarantees it on every page, and `aria-label` on the landmark keeps the top-bar and list searches distinguishable.
- **D-6** *Does the component debounce?* No. The forms pattern says a search applies as the person types; the page decides whether to wait before a server query. Debouncing inside the component would hide that choice from the page.
- **D-7** *What happens to the rows that hold the bar on phones?* The `.page-actions` row and the `.conv-toolbar` wrap and the bar takes the full width below `--layout-breakpoint-md`. The bar itself has no media rule; the admin page headers overflow on phones in the mocks (responsive foundation), and a bar squeezed beside a button at 320 px is only a few pixels wide, so the wrap is the smallest change that keeps it usable. The rows are the pages', so the rule is stated for them here and rendered in the frames.
- **D-8** *Is there a clear button or <kbd>Esc</kbd> handling?* No. The mocks have neither, the design-system page states both are not implemented, and `type="text"` is kept rather than `type="search"` so no browser adds its own clear control. The person deletes the text with <kbd>Backspace</kbd>; the page can clear `value`.
- **D-9** *Is there a disabled or busy state?* No. No mock disables a search bar, and the list below shows loading and empty states; adding a state no screen uses would be unverified behaviour.
