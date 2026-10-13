# Spinner

| Field | Value |
|---|---|
| Selector | `coop-spinner` |
| Library path | `frontend/projects/components/src/lib/spinner/` |
| Status | planned |
| Traces to | L2-REQ-030, L2-REQ-035, L2-REQ-036 |
| Design system | [`spinner.html`](../../design-system/components/spinner.html) |
| Source mocks | [`pages/public-documents/loading`](../../mocks/pages/public-documents/loading.html), [`pages/public-maintenance/loading`](../../mocks/pages/public-maintenance/loading.html), [`pages/public-messaging/loading`](../../mocks/pages/public-messaging/loading.html), [`pages/admin-documents/loading`](../../mocks/pages/admin-documents/loading.html), [`pages/admin-maintenance/loading`](../../mocks/pages/admin-maintenance/loading.html), [`pages/admin-messaging/loading`](../../mocks/pages/admin-messaging/loading.html) |
| Rendering | [`spinner.html`](spinner.html) |

## Purpose and scope

The spinner shows that a list is on its way: a centred ring that rotates while the documents, maintenance requests or conversations are fetched, then gives way to the list or the [empty state](empty-state.md). It is announced as a status so a screen-reader user hears "Loading…" without losing their place. It is the product's only loading indicator: there are no skeleton screens, progress bars or in-button spinners (D-8).

Use something else instead when:

- a form is submitting: the [button](button.md) busy state;
- the fetch failed: an [alert](alert.md);
- the list is empty: [empty state](empty-state.md).

Out of scope:

- Deciding when to show it. The page shows the spinner while its fetch is pending and removes it on completion or failure.
- Dashboard, dialog and onboarding loading. The mocks show no indicator there (feedback pattern), so none is specified.

## Usage

Every `.loading` in `docs/mocks` is one of the configurations below. The admin pages use a rotating `sync` icon; the design system replaces it with the same ring (D-7).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/public-documents/loading`, `pages/admin-documents/loading` | default (`label` "Loading…") | hidden "Loading…" | spinning, above the page title and filters | canvas |
| `pages/public-maintenance/loading`, `pages/admin-maintenance/loading` | default | hidden "Loading…" | spinning | canvas |
| `pages/public-messaging/loading`, `pages/admin-messaging/loading` | default | hidden "Loading…" | spinning | canvas |

Every row is buildable with the API below: one optional label.

## Anatomy

1. **Loading area** — `.loading`: a flex row that centres its content, `--space-12` padding on every side, `role="status"`.
2. **Ring** — `.spinner`: a 2rem circle, `--border-width-thick` track in `--color-border-default` with the top arc in `--color-accent`, `--radius-full`, rotating once per `--duration-spin`; `aria-hidden="true"`.
3. **Hidden label** — `.visually-hidden` span holding the `label` text, read by assistive technology (D-5).

Host: `coop-spinner` is `display: block` and carries no classes of its own; the classes and the role go on the inner elements.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | `'Loading…'` | no | The hidden status text. A translated or more specific value ("Loading conversations") replaces it when two areas load at once (D-4). |

All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The spinner is not interactive and has no lifecycle of its own. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The label is an input so the status text is always present (D-4). |

Translation: `label` is an input; its default is the only English string the component holds, kept so a spinner is never silent (D-4; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| One variant | `.loading` > `.spinner` | Every list loading state in both apps. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | 2rem ring; the area is 2rem + 2 × `--space-12` (8rem) tall | `--space-12` | none visible |

The area takes the width of its container; the ring is centred.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Spinning | present in the DOM | Ring rotates once per `--duration-spin` (1 s, linear, infinite) | Announced politely as "Loading…" once |
| Reduced motion | `prefers-reduced-motion: reduce` | Ring rotates once per 2 s (tokens.css) | Same |

The spinner has no hover, focus, active, disabled or paused state (design-system page). It is removed from the DOM when data arrives or the fetch fails.

## Markup

```html
<!-- rendered -->
<div class="loading" role="status">
  <div class="spinner" aria-hidden="true"></div>
  <span class="visually-hidden">Loading…</span>
</div>
```

```html
<!-- consumer -->
@if (loading()) { <coop-spinner></coop-spinner> } @else if (requests().length) { … } @else { <coop-empty-state icon="build">No maintenance requests found</coop-empty-state> }
<coop-spinner label="Loading conversations"></coop-spinner>
```

The classes and the role above are part of the contract: the e2e page objects wait for `.loading` to disappear.

## Design

- Area: `display: flex`, `justify-content: center`, padding `--space-12`.
- Ring: 2rem by 2rem; `--border-width-thick` solid `--color-border-default` with `border-top-color: --color-accent`; `--radius-full`; `animation: coop-spin --duration-spin linear infinite` (`components.css`).
- Hidden label: the `.visually-hidden` clip pattern (1 px, clipped, no wrap), shipped in the component stylesheet because `components.css` does not define it (D-5).
- Motion: `transform: rotate()` only, so the animation runs on the compositor. Layer: none; the area sits in the flow where the list will be.

Component tokens: none. The block reads semantic tokens directly in `components.css`.

| Token | Aliases | Overridden by |
|---|---|---|
| `--duration-spin` | 1s | `prefers-reduced-motion: reduce` sets it to 2s (tokens.css) |
| `--color-accent` | `--palette-green-700` | — |
| `--color-border-default` | `--palette-gray-200` | `prefers-contrast: more` raises it to `--color-border-strong` (tokens.css) |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Arc | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Track | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-accent` | `--color-bg-canvas` | 3:1 | Arc on the page (non-text graphic) |
| `--color-accent` | `--color-bg-surface` | 3:1 | Arc inside a panel or card |

The track is decorative. Under `forced-colors: active` the track becomes `CanvasText` (tokens.css); the arc keeps `--color-accent`, which the browser maps to a system colour; the component adds no colour of its own.

## Responsive behaviour

- No breakpoint rules apply (design-system page). The ring stays 2rem and centres horizontally in the area at every width.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom the area reflows with the page (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: none; the spinner is not interactive.

## Accessibility

### Role and pattern

The `.loading` area has `role="status"` (an implicit polite live region) and holds the visually hidden label; the ring is `aria-hidden="true"`. WAI-ARIA has no spinner widget; the status live region is the nearest pattern ([WAI-ARIA APG, status and alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)). The role is on the area, not on the ring (D-10).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Never stops on the spinner; it is not focusable. |

### Focus

None. The component never moves focus; the user keeps their place while the list loads.

### Labelling

- The hidden text is the status message: "Loading…" by default, or the `label` given.
- No `aria-label` on the ring, no `aria-busy` on the area (the page may set `aria-busy="true"` on the list region it is replacing).

### Announcements

The status region exists in the DOM with its text when the spinner is inserted, so screen readers announce "Loading…" once, politely, without interrupting.

### Motion

The ring rotates continuously (`--duration-spin`, 1 s). Under `prefers-reduced-motion: reduce` tokens.css slows the token to 2 s: the ring still turns, because it is a status indicator rather than decoration, but at a quarter of the speed (D-6).

## Content and internationalisation

- The hidden text is one word or a short phrase: "Loading…" (with the ellipsis character, as the content foundation recommends for busy text), "Loading documents".
- No visible text, percentage or caption (design-system page).
- Translatable inputs: `label`. Data values: none.
- Hidden text length never affects layout.

## Performance

- Change detection: `OnPush`, one signal input.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the area is always 8rem tall (2rem ring plus `--space-12` above and below), so nothing above or below it shifts when the spinner is replaced by a list of the same or greater height; the animation changes only `transform`.
- Weight: imports `@angular/core` only; no CDK, no animation module.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-spinner>` on the documents page while the documents are fetched, when it renders, then the DOM holds `<div class="loading" role="status"><div class="spinner" aria-hidden="true"></div><span class="visually-hidden">Loading…</span></div>`. (L2-REQ-035)
- **AC-2** Given the spinner on the maintenance page, when it renders, then the ring is 2rem, its stroke is `--border-width-thick`, its track `--color-border-default`, its arc `--color-accent`, and it completes one rotation per `--duration-spin`. (L2-REQ-030)
- **AC-3** Given `label="Loading conversations"` on the messaging page, when it renders, then the hidden text is "Loading conversations" and nothing visible changes. (L2-REQ-036)

### States

- **AC-4** Given Mira Fern's requests arrive, when the page updates, then the `.loading` area is removed from the DOM and the request list or the empty state takes its place without the page header moving. (L2-REQ-030)

### Keyboard and focus

- **AC-5** Given focus on the "Reports" filter when the documents reload, when the spinner appears and disappears, then focus stays on the filter and <kbd>Tab</kbd> never lands on the spinner. (L2-REQ-035)

### Screen readers

- **AC-6** Given the spinner appears, when read by assistive technology, then "Loading…" is announced once, politely, the ring is not announced and no role other than status is exposed. (L2-REQ-035)

### Theming

- **AC-7** Given the spinner, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-035)

### Responsive

- **AC-8** Given the spinner at 320 px, when measured, then the ring is centred in the area, the area spans the content width and nothing scrolls horizontally. (L2-REQ-030)

### Motion

- **AC-9** Given `prefers-reduced-motion: reduce`, when the conversations load, then the ring still rotates, once per 2 s, and remains visible with its hidden label. (L2-REQ-036)

### Performance

- **AC-10** Given the spinner is shown, when the page's other signals change, then the spinner does not re-render (`OnPush`) and its animation touches only `transform`. (L2-REQ-035)

## Implementation notes

- Folder `frontend/projects/components/src/lib/spinner/`: `spinner.component.ts`, `spinner.component.html`, `spinner.component.css`; export from `public-api.ts`.
- The stylesheet holds only the `.visually-hidden` rule (D-5); the ring and the area come from `components.css`.
- No CDK primitive. Composes nothing; list pages render it in place of the list.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Is the label an input with a default, or a slot?* An input defaulting to "Loading…". A spinner without text is silent (the mocks' gap); a default guarantees the announcement, and the consumer overrides it for translation or specificity. The ellipsis character follows the content foundation's recommended busy wording.
- **D-5** *Where does `.visually-hidden` come from?* The component ships it. `components.css` does not define the utility (the design-system documentation chrome does), so the component stylesheet carries the standard clip pattern.
- **D-6** *Reduced motion: stop or slow?* Slow to 2 s. tokens.css and the spinner page set `--duration-spin` to 2 s under `prefers-reduced-motion`; the feedback pattern says the rotation stops. The token is the source of truth, and a slow turn keeps the "still working" signal; the pattern page should be corrected.
- **D-7** *One ring or also the admin `sync` icon?* One ring everywhere. The design-system page resolves the two mock implementations (0.6 s ring, 1 s icon) to the ring at `--duration-spin`.
- **D-8** *Skeletons, progress bars or in-button spinners?* None. The mocks README keeps the implemented spinners and rejects skeletons; the button's busy state is a label swap; the asset upload progress bar is a gap, not a component.
- **D-9** *Is `.loading` part of the component?* Yes. Every mock pairs the ring with the `.loading` area, and the role belongs on the area; a bare ring would need a wrapper on every page.
- **D-10** *Role on the area or on the ring?* On the area, with the ring `aria-hidden`. The spinner page specifies this; the feedback pattern's `role="status" aria-label` on the ring itself is the older form and names an element that carries no text.
