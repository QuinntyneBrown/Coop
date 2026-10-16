# Pagination

| Field | Value |
|---|---|
| Selector | `coop-pagination` |
| Library path | `frontend/projects/components/src/lib/pagination/` |
| Status | planned |
| Traces to | L2-REQ-057 |
| Design system | [`pagination.html`](../../design-system/components/pagination.html) |
| Source mocks | [`pages/admin-users/default`](../../mocks/pages/admin-users/default.html), [`pages/admin-users/page-2`](../../mocks/pages/admin-users/page-2.html), [`pages/admin-users/empty`](../../mocks/pages/admin-users/empty.html), [`pages/admin-users/no-results`](../../mocks/pages/admin-users/no-results.html), [`dialogs/admin-user-create/default`](../../mocks/dialogs/admin-user-create/default.html), [`dialogs/admin-user-edit/default`](../../mocks/dialogs/admin-user-edit/default.html), [`dialogs/admin-user-delete/default`](../../mocks/dialogs/admin-user-delete/default.html) |
| Rendering | [`pagination.html`](pagination.html) |

## Purpose and scope

Pagination sits under a paged table and lets an admin move between pages of a collection: a summary on the left ("Showing 1-2 of 4 users") and previous, page-number and next buttons on the right. The admin users list shows two users per page (L2-REQ-057: page size and page index). The current page is filled with the accent colour; the previous button is disabled on the first page and the next button on the last.

Use something else instead when:

- the list is filtered rather than paged: [filter chips](filter-chips.md) or [search bar](search-bar.md);
- the control is a single action: [button](button.md).

Out of scope:

- Fetching the page. The page owns the data: it listens to `pageChange`, requests `/page/{pageSize}/{index}` and renders the table rows ([table](table.md)).
- The table's own empty and no-results states ([empty state](empty-state.md)). The summary still renders beside them.
- Page-size selection. No mock offers one; `pageSize` is fixed by the page.

## Usage

Every `.pagination` in `docs/mocks` (8 uses on 8 screens, all the admin users list, three of them behind a dialog) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-users/default`; `dialogs/admin-user-create`, `admin-user-edit`, `admin-user-delete` behind the overlay | `page` 1, `pageSize` 2, `total` 4, `itemLabel` "users" | "Showing 1-2 of 4 users"; pages 1, 2 | previous disabled, page 1 current | table card |
| `pages/admin-users/page-2` | `page` 2, `pageSize` 2, `total` 4 | "Showing 3-4 of 4 users" | next disabled, page 2 current | table card |
| `pages/admin-users/empty` | `page` 1, `pageSize` 2, `total` 0 | "Showing 0-0 of 0 users" (D-7); no controls (D-6) | summary only | table card |
| `pages/admin-users/no-results` | `page` 1, `pageSize` 2, `total` 0 after the search filtered the page | "Showing 0-0 of 0 users"; no controls | summary only | table card |

Every row is buildable with the API below: a page index, a page size, a total and the noun for the summary.

## Anatomy

1. **Container** — `.pagination`. Flex row, space between, `--space-3` by `--space-5` padding, `--text-body-sm` in `--color-fg-muted`; wraps when the summary and controls do not fit (D-8).
2. **Summary** — `<span aria-live="polite">`: "Showing 1-2 of 4 users". The range is computed from `page`, `pageSize` and `total`.
3. **Navigation** — `<nav aria-label="Pagination">` wrapping the controls, rendered only when there is more than one page (D-6).
4. **Controls** — `.page-controls`. Flex row of native buttons with `--space-1` gap.
5. **Previous and next** — buttons with `aria-label` "Previous page" / "Next page" and a Material chevron (`chevron_left`, `chevron_right`) with `aria-hidden="true"`; native `disabled` at the ends.
6. **Page button** — a button per shown page, at least 2rem square, `--radius-sm`, `--color-border-strong` edge, visible number, `aria-label` "Page 2".
7. **Current page** — `aria-current="page"`: `--color-accent` fill and edge, `--color-fg-on-accent` label.

Host: `coop-pagination` is `display: block` and carries no classes; the `.pagination` container and everything inside it are rendered by the component.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `page` | `number` | `1` | no | The current page, 1-based (D-5). Clamped to `1 … pageCount`. |
| `pageSize` | `number` | — | yes | Items per page; 2 on the admin users list. Must be at least 1. |
| `total` | `number` | — | yes | Total items in the collection; 0 or more. `pageCount = max(1, ceil(total / pageSize))`. |
| `itemLabel` | `string` | — | yes | The noun in the summary, as the page wants it shown: "users". The component does not inflect it; a page that wants "1 user" passes the singular itself (D-9). |
| `summaryLabel` | `string` | `'Showing {first}-{last} of {total} {items}'` | no | Summary template; `{first}`, `{last}`, `{total}` and `{items}` are replaced. The default is the mocks' exact wording with an ASCII hyphen. |
| `navLabel` | `string` | `'Pagination'` | no | `aria-label` of the `<nav>`. |
| `previousLabel` | `string` | `'Previous page'` | no | `aria-label` of the previous button. |
| `nextLabel` | `string` | `'Next page'` | no | `aria-label` of the next button. |
| `pageLabel` | `string` | `'Page {n}'` | no | `aria-label` template of a page button; `{n}` is replaced by the number. |
| `testId` | `string \| null` | `null` | no | With `testId="users-pagination"` the container gets `data-testid="users-pagination"` and the inner elements `users-pagination-info`, `users-pagination-prev`, `users-pagination-page` (each page button) and `users-pagination-next`, matching the e2e page object (D-10). |

Booleans: none. All inputs are signal inputs. The English defaults are overridable through the inputs, so a translated app passes its own strings (design-system content rule; there is no L2 requirement for translation).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `pageChange` | `number` (the requested page, 1-based) | Previous, next or a page button other than the current one is activated. Not emitted for the current page button, for a disabled chevron, or when `page` changes from outside. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Every string is an input; the control has no projected content. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Standard | — | The only variant. First and last pages differ only in which chevron is disabled; a single page or an empty collection shows the summary alone (D-6). |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | buttons `min-height: 2rem`, `min-width: 2rem` | `0 --space-3` | `--text-body-sm` |

The container fills the width of the table card; the controls take their natural width.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (page button) | — | `--color-bg-surface` fill, `--color-border-strong` edge, `--color-fg-default` number | Role button, name "Page 2" |
| Hover | `:hover` on an enabled, non-current button | Fill `--color-bg-subtle` | — |
| Focus | `:focus-visible` | Shared ring `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` | — |
| Active | `:active` | Same as hover; the page changes on `click` | — |
| Current | `aria-current="page"` | `--color-accent` fill and edge, `--color-fg-on-accent` number; hover changes nothing | Current = page; exactly one button |
| Disabled chevron | `disabled` | Opacity 0.5, `cursor: not-allowed` | Not focusable; exposed as disabled |
| Summary only | `pageCount` is 1 | No `<nav>`; the summary alone | The live region still reads the range |
| Busy | — | None of its own; the page's table shows the spinner while the next page loads (D-11) | — |

## Markup

```html
<!-- rendered: first page of four users, two per page -->
<div class="pagination" data-testid="users-pagination">
  <span aria-live="polite" data-testid="users-pagination-info">Showing 1-2 of 4 users</span>
  <nav aria-label="Pagination">
    <div class="page-controls">
      <button type="button" aria-label="Previous page" disabled data-testid="users-pagination-prev"><span class="material-icons icon-md" aria-hidden="true">chevron_left</span></button>
      <button type="button" aria-label="Page 1" aria-current="page" data-testid="users-pagination-page">1</button>
      <button type="button" aria-label="Page 2" data-testid="users-pagination-page">2</button>
      <button type="button" aria-label="Next page" data-testid="users-pagination-next"><span class="material-icons icon-md" aria-hidden="true">chevron_right</span></button>
    </div>
  </nav>
</div>
```

```html
<!-- rendered: last page -->
<div class="pagination">
  <span aria-live="polite">Showing 3-4 of 4 users</span>
  <nav aria-label="Pagination"><div class="page-controls">
    <button type="button" aria-label="Previous page"><span class="material-icons icon-md" aria-hidden="true">chevron_left</span></button>
    <button type="button" aria-label="Page 1">1</button>
    <button type="button" aria-label="Page 2" aria-current="page">2</button>
    <button type="button" aria-label="Next page" disabled><span class="material-icons icon-md" aria-hidden="true">chevron_right</span></button>
  </div></nav>
</div>
```

```html
<!-- rendered: empty collection -->
<div class="pagination"><span aria-live="polite">Showing 0-0 of 0 users</span></div>
```

Hover, focus and active add no markup. With more than five pages the page buttons are a window of five (D-12); the chevrons are always present when there is more than one page.

```html
<!-- consumer -->
<coop-pagination [page]="page()" [pageSize]="2" [total]="total()" itemLabel="users" testId="users-pagination" (pageChange)="page.set($event)"></coop-pagination>
```

The classes, `aria-current`, `disabled`, the summary wording and the test ids are part of the contract: the e2e users page object locates `users-pagination-info`, `-prev`, `-next` and `-page`, and the tests assert the summary matches `Showing \d+-\d+ of \d+ users`.

## Design

- Container: padding `--space-3` `--space-5`, `justify-content: space-between`, `align-items: center`, `flex-wrap: wrap`, row gap `--space-2`, and `margin-left: auto` on the `<nav>` so the controls stay right-aligned when they wrap under the summary (D-8); font `--text-body-sm`, colour `--color-fg-muted`.
- Controls: flex, gap `--space-1`.
- Button: `min-width` and `min-height` 2rem, padding `0 --space-3`, border `--border-width-hairline` solid, radius `--radius-sm`, font `--text-body-sm`, `cursor: pointer`. The chevron is `.material-icons.icon-md` (1.25rem) so the button stays 2rem square.
- No transition is specified for pagination; fills change instantly.
- Layer: none; it sits at the bottom of the table card, inside the card's rounded corners.

Component tokens: none. `.pagination` and `.page-controls button` consume semantic tokens directly in `components.css`.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Summary text | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Button fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Button edge | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-500` |
| Button number | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Hover fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Current fill and edge | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Current number | `--color-fg-on-accent` | `--palette-white` | `--palette-white` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Summary on the table card |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Page number |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Page number, hover |
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Current page number |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Button edge (1.4.11) |
| `--color-accent` | `--color-bg-surface` | 3:1 | Current page edge |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the card |

Disabled chevrons at 0.5 opacity are exempt from contrast (WCAG 1.4.3) and carry `disabled` for assistive technology. Under `forced-colors: active` edges and the ring become system colours (tokens.css); the current page keeps its `aria-current` and gets a `--border-width-thick` `CanvasText` edge under that media query (D-13).

## Responsive behaviour

- No media rule targets the pagination (design-system page). The table card's `overflow-x: auto` scrolls the table, not the pagination.
- The container wraps (D-8): the four controls need about 164 px (two 44 px chevrons, two 32 px numbers, three `--space-1` gaps) and "Showing 1-2 of 4 users" about 140 px, so inside the table card they share one row only from about 400 px; on phones (320 and 360 px) the summary stays on the first line and the controls move under it, right-aligned, instead of pushing the card wider.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom the summary and every button stay reachable and operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: every button is at least 32 × 32 px, above the 24 px `--target-min`, with a `--space-1` gap; the page keeps to seven controls at most (five pages plus chevrons, D-12) so the row stays under 260 px (accessibility foundation).

## Accessibility

### Role and pattern

A `<nav aria-label="Pagination">` landmark containing native `<button>` elements, with `aria-current="page"` on the current page. The buttons do not navigate to a URL (the page swaps table rows in place), so they are buttons rather than links (design-system page). The mocks' bare «/» glyphs, missing landmark and missing live region are replaced by labelled chevrons, the landmark and the polite summary.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through previous, each page button and next in DOM order. Disabled chevrons are skipped. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates the focused button: emits `pageChange` for previous, next or another page; does nothing on the current page button. |

### Focus

Focus lands on the native buttons, never on the host. The shared ring (`--focus-ring-width` solid `--color-focus-ring`, offset `--focus-ring-offset`) shows on `:focus-visible` and must not be clipped by the table card. After `page` changes, focus stays on the button that was activated; if that button has become disabled (next on reaching the last page, previous on reaching the first), the component moves focus to the current page button so focus is not lost (D-14). When `page` changes from outside, focus does not move.

### Labelling

- Previous and next are named by `aria-label` ("Previous page", "Next page"); the chevron is `aria-hidden="true"`.
- A page button is named "Page 2" through `aria-label`; its visible text "2" is contained in the name (WCAG 2.5.3).
- Exactly one button has `aria-current="page"`.
- The summary is a polite live region so the new range ("Showing 3-4 of 4 users") is announced after a page change.

### Announcements

The summary (`aria-live="polite"`) announces the new range once per page change; the table's own loading status is the page's ([spinner](spinner.md)).

### Motion

None; nothing animates, so `prefers-reduced-motion` changes nothing.

## Content and internationalisation

- Summary: "Showing {first}-{last} of {total} {items}" with an ASCII hyphen, exactly as the mocks: "Showing 1-2 of 4 users", "Showing 3-4 of 4 users". `first = (page - 1) × pageSize + 1` and `last = min(page × pageSize, total)`; when `total` is 0 both are 0: "Showing 0-0 of 0 users" (D-7).
- Names: "Previous page", "Next page", "Page 1". Visible page text is the bare number.
- Translatable inputs: `itemLabel`, `summaryLabel`, `navLabel`, `previousLabel`, `nextLabel`, `pageLabel`. Data values: `page`, `pageSize`, `total`.
- Numbers are bare digits; no thousands separator is applied (counts in the product are small and the content foundation shows bare counts).
- A French summary ("Affichage de 1-2 sur 4 utilisateurs", about 30 % longer) wraps the controls onto the second line on phones and shares a row at 768 px.

## Performance

- Change detection: `OnPush`, signal inputs; `pageCount`, the range and the page window are three `computed` values.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the container height is fixed by its padding and the 2rem buttons; the summary keeps the same length as pages change (the digit count rarely changes), and the controls only appear or disappear when `pageCount` crosses 1.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK, no router dependency.

## Acceptance criteria

### Rendering

- **AC-1** Given `page` 1, `pageSize` 2, `total` 4 and `itemLabel="users"`, when it renders, then the DOM holds `.pagination` with a `span[aria-live="polite"]` reading exactly "Showing 1-2 of 4 users" and a `nav[aria-label="Pagination"]` containing `.page-controls`. (L2-REQ-057)
- **AC-2** Given the same inputs, when it renders, then the controls are, in order, a disabled previous button named "Previous page", a button "Page 1" with `aria-current="page"`, a button "Page 2" and an enabled next button named "Next page". (L2-REQ-057)
- **AC-3** Given `page` 2, `pageSize` 2, `total` 4, when it renders, then the summary reads "Showing 3-4 of 4 users", "Page 2" has `aria-current="page"`, previous is enabled and next is disabled. (L2-REQ-057)
- **AC-4** Given the current page button, when it renders, then its fill and edge are `--color-accent` and its number `--color-fg-on-accent`, while the other page button has a `--color-bg-surface` fill, a `--color-border-strong` edge and a `--color-fg-default` number. (L2-REQ-057)
- **AC-5** Given `testId="users-pagination"`, when it renders, then the container has `data-testid="users-pagination"`, the summary `users-pagination-info`, the previous button `users-pagination-prev`, each page button `users-pagination-page` and the next button `users-pagination-next`. (L2-REQ-057)
- **AC-6** Given `total` 0, when it renders, then the summary reads "Showing 0-0 of 0 users" and no `<nav>` or button is rendered. (L2-REQ-057)
- **AC-7** Given `pageSize` 2 and `total` 20 with `page` 7, when it renders, then the page buttons are 5, 6, 7, 8 and 9 with "Page 7" current, and both chevrons are enabled. (L2-REQ-057)

### States

- **AC-8** Given the enabled "Page 2" button, when it is hovered, then its fill becomes `--color-bg-subtle`; and given the current "Page 1" button, when it is hovered, then nothing changes. (L2-REQ-057)
- **AC-9** Given the disabled previous button on page 1, when it is hovered or activated, then nothing changes and `pageChange` does not emit; its opacity is 0.5 and the cursor is `not-allowed`. (L2-REQ-057)
- **AC-10** Given page 1 of 2, when the next button is activated, then `pageChange` emits `2` once and nothing else changes until the page updates `page`. (L2-REQ-057)
- **AC-11** Given page 1 of 2, when the "Page 1" button is activated, then `pageChange` does not emit. (L2-REQ-057)
- **AC-12** Given `page` is set to `2` from the page, when change detection runs, then "Page 2" becomes current, the summary reads "Showing 3-4 of 4 users" and `pageChange` does not emit. (L2-REQ-057)

### Keyboard and focus

- **AC-13** Given focus is before the pagination on page 1 of 2, when <kbd>Tab</kbd> is pressed repeatedly, then focus visits "Page 1", "Page 2" and "Next page", skipping the disabled previous button, each showing the `--color-focus-ring` ring. (L2-REQ-057)
- **AC-14** Given focus is on the next button on page 1 of 2, when <kbd>Enter</kbd> is pressed and the page sets `page` to 2, then the next button becomes disabled and focus moves to the "Page 2" button. (L2-REQ-057)
- **AC-15** Given focus is on the "Page 2" button on page 1 of 3, when <kbd>Space</kbd> is pressed and the page sets `page` to 2, then focus stays on the "Page 2" button, now current. (L2-REQ-057)

### Screen readers

- **AC-16** Given the pagination on page 1 of 2, when a screen reader reads the controls, then it announces the landmark "Pagination, navigation", "Previous page, button, dimmed", "Page 1, button, current page", "Page 2, button" and "Next page, button". (L2-REQ-057)
- **AC-17** Given the page moves from 1 to 2, when the summary updates, then assistive technology announces "Showing 3-4 of 4 users" once without moving focus. (L2-REQ-057)

### Theming

- **AC-18** Given any pagination, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-057)

### Responsive

- **AC-19** Given "Showing 1-2 of 4 users" with four buttons inside a table card at 320 px, when measured, then the controls wrap under the summary, every button is at least 32 × 32 px, and the card does not scroll horizontally. (L2-REQ-057)
- **AC-20** Given the same pagination at 768 px, when measured, then the summary and the controls share one row, the controls at the right edge. (L2-REQ-057)
- **AC-21** Given the pagination at 320 px and 400 % zoom, when the page reflows, then every button remains visible and operable by touch. (L2-REQ-057)

### Performance

- **AC-22** Given the users page with the table and pagination, when a table row's input changes, then the pagination does not re-render (`OnPush` with signal inputs), and a `page` change re-renders only the summary text and the buttons whose state changed. (L2-REQ-057)

## Implementation notes

- Folder `frontend/projects/components/src/lib/pagination/`: `pagination.component.ts|html|css`, `page-window.ts` (the pure function that returns the five-page window); export from `public-api.ts`.
- `pageCount = max(1, ceil(total / pageSize))`; `page` is clamped to `1 … pageCount` in a `computed` so an out-of-range input never renders two current pages or none.
- The focus rule (AC-14) runs in an `effect` on `page`: if `document.activeElement` is a now-disabled chevron inside the component, call `focus()` on the current page button.
- Test ids are rendered from the `testId` input with the suffixes `-info`, `-prev`, `-page` and `-next` (D-10).
- The `.pagination` rule in `components.css` gains `flex-wrap: wrap` and a `--space-2` row gap, and `.pagination nav` gains `margin-left: auto`, in the first implementation slice (D-8); until then the component's own stylesheet sets them.
- No CDK primitive; composes the Material Icons chevrons only. The admin users page composes it under its [table](table.md).
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Buttons or links?* Buttons. The users page swaps table rows without changing the URL, which the design-system page names as the condition for buttons; the e2e tests click them and read the summary on the same page.
- **D-5** *Is `page` 0-based like the API's `{index}` or 1-based like the display?* 1-based. The visible numbers, the names "Page 2" and the e2e helper `goToPage(pageNumber)` all count from 1; the page subtracts one when it calls `/page/{pageSize}/{index}`.
- **D-6** *What shows when there is only one page?* The summary alone, with no `<nav>`. The design-system content rule says to hide the control and show the summary when there is one page; a disabled previous, a lone current page and a disabled next, as the empty mock draws, offer nothing to do.
- **D-7** *What does the empty summary say?* "Showing 0-0 of 0 users". The mocks compute "Showing 1-0 of 0 users", a range that starts after it ends; clamping `first` to `total` keeps the formula, keeps the e2e pattern `Showing \d+-\d+ of \d+ users` matching and reads correctly.
- **D-8** *Does the container wrap on narrow screens?* Yes: the controls drop under the summary and stay right-aligned. `components.css` lays the row out with space between and no wrap, which the design-system page itself flags as untested beyond two pages, and its claim that two pages fit beside the summary at 320 px does not hold once the chevrons carry a labelled 20 px icon with the 32 px minimum; wrapping meets the 320 px reflow rule without shrinking the buttons.
- **D-9** *Who pluralises the noun?* The page. `itemLabel` is rendered as given ("users"); the component has no plural rules and a translated app would need its own, so the page passes the form it wants for the current total.
- **D-10** *How do e2e test ids reach the inner elements?* Through a `testId` input that the component suffixes with `-info`, `-prev`, `-page` and `-next`. The existing users page object locates those five ids, and the inner elements are rendered by the component, so a host attribute cannot reach them.
- **D-11** *Is there a busy state while the next page loads?* No. The users list shows its spinner in the table; the mocks render the pagination unchanged during loading, and a disabled control row would steal focus from the button that was just pressed.
- **D-12** *How many page buttons with many pages?* A window of five centred on the current page, clamped to the ends, with no ellipsis and no first/last jump. The mocks show two pages and the design-system page says a longer row is unspecified; five 32 px buttons plus two chevrons keep the row under 260 px at 320 px, and the chevrons reach every page.
- **D-13** *How is the current page shown under forced colours?* With a `--border-width-thick` `CanvasText` edge and `aria-current`. Forced colours remove the accent fill, so a shape cue is needed.
- **D-14** *Where does focus go when the activated chevron becomes disabled?* To the current page button. Native `disabled` drops focus to the body; the design-system page requires focus to stay on the control or move somewhere meaningful, and the current page button is the nearest control that describes where the admin now is.
