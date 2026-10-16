# Empty state

| Field | Value |
|---|---|
| Selector | `coop-empty-state` |
| Library path | `frontend/projects/components/src/lib/empty-state/` |
| Status | planned |
| Traces to | L2-REQ-030, L2-REQ-035, L2-REQ-036, L2-REQ-041 |
| Design system | [`empty-state.html`](../../design-system/components/empty-state.html) |
| Source mocks | [`pages/public-maintenance/empty`](../../mocks/pages/public-maintenance/empty.html), [`pages/public-maintenance/no-results`](../../mocks/pages/public-maintenance/no-results.html), [`pages/admin-maintenance/empty`](../../mocks/pages/admin-maintenance/empty.html), [`pages/public-documents/empty`](../../mocks/pages/public-documents/empty.html), [`pages/admin-documents/no-results`](../../mocks/pages/admin-documents/no-results.html), [`pages/admin-assets/empty`](../../mocks/pages/admin-assets/empty.html), [`pages/public-messaging/empty`](../../mocks/pages/public-messaging/empty.html), [`pages/admin-messaging/empty`](../../mocks/pages/admin-messaging/empty.html), [`pages/admin-dashboard/empty`](../../mocks/pages/admin-dashboard/empty.html), [`pages/public-dashboard/empty`](../../mocks/pages/public-dashboard/empty.html) |
| Rendering | [`empty-state.html`](empty-state.html) |

## Purpose and scope

An empty state tells a member or a staff member that a list has nothing to show: no maintenance requests, no documents, no conversations, no assets, or nothing matching the filter they chose. It is a centred icon above one plain sentence, filling the area where the list would have been. Inside a dashboard card it is the sentence alone.

Use something else instead when:

- a request failed: show an [alert](alert.md) with what went wrong, not an empty state (feedback pattern);
- the list is still loading: [spinner](spinner.md);
- a count is zero: the [metric card](metric-card.md) shows 0 rather than an empty state.

Out of scope:

- The entry action ("New Request", "Upload Asset"). The mocks keep it in the page header or toolbar beside the list, never inside the empty state, so the component has no action slot (D-4).
- Deciding which sentence to show. The page chooses "No documents found", "No conversations yet" or "No recent requests" per the content foundation (D-11).
- Announcing the change from loading to empty. The list container owns the live region (D-8).
- Grid spanning. When the empty state replaces a card grid the page makes it span every column.

## Usage

Every `.empty-state` in `docs/mocks` is one of the configurations below; the admin lists wrap it in a card, the member app and dashboards do not.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/public-maintenance/empty`, `pages/public-maintenance/no-results` | `icon="build"` | "No maintenance requests found" | empty, no results (filter "Done") | canvas |
| `pages/admin-maintenance/empty`, `pages/admin-maintenance/no-results` | `icon="inbox"`, `card` | "No maintenance requests found" | empty, no results (filter "Completed") | canvas (card) |
| `pages/public-documents/empty`, `pages/public-documents/no-results` | `icon="description"` | "No documents found" | empty, no results (filter "Reports") | canvas |
| `pages/admin-documents/empty`, `pages/admin-documents/no-results` | `icon="description"`, `card` | "No documents found" | empty, no results | canvas (card) |
| `pages/admin-assets/empty`, `pages/admin-assets/no-results` | `icon="cloud_upload"`, `card` | "No assets uploaded yet" | empty, no results | canvas (card) |
| `pages/public-messaging/empty` | `icon="chat_bubble_outline"` | "No conversations yet" | empty | canvas |
| `pages/admin-messaging/empty`, `pages/admin-messaging/no-results` list panel | `icon="chat_bubble_outline"` | "No conversations yet" | empty, no results | surface (list panel) |
| `pages/admin-messaging/default`, `pages/admin-messaging/empty`, `dialogs/admin-new-conversation/default` chat panel | `icon="chat_bubble_outline"` | "Select a conversation to start chatting" | no conversation selected | surface (chat panel) |
| `pages/admin-dashboard/empty` "Recent Maintenance Requests", "Recent Notices" | no icon | "No recent requests", "No recent notices" | empty section | inside a card |
| `pages/public-dashboard/empty`, `pages/public-dashboard/partial` "Recent Requests" | no icon | "No recent requests" | empty section | inside a card |
| `pages/public-landing/empty` "Public Notices" | no icon | "No public notices at this time" | empty section | canvas band |

Every row is buildable with the API below: an optional icon, an optional card surface and one projected sentence. The admin users list shows its empty text, "No users found", as a table row; that is [table](table.md), with the "Showing 0-0 of 0 users" summary from [pagination](pagination.md).

## Anatomy

1. **Block** — `.empty-state`: centred text, `--space-12` vertical and `--space-5` horizontal padding, `--color-fg-muted`. With `card` it also has `.card` (surface fill, edge and radius).
2. **Icon (optional)** — `.material-icons` with `aria-hidden="true"`, `--icon-size` 3rem, displayed as a block, centred, `--space-2` below.
3. **Message** — one `<p>` in `--text-body`, margin 0, holding the projected sentence.

Host: `coop-empty-state` is `display: block` and carries no classes of its own; the classes go on the inner `.empty-state` div.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `icon` | `string \| null` | `null` | no | Material Icons ligature name. Null renders no icon (dashboard sections). |
| `card` | `boolean` | `false` | no | Adds `.card` to the block for the admin list pages, where the empty state stands on the canvas. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The empty state has no controls (D-4). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | text, one sentence | Projected into the `<p>`. No markup, no second paragraph, no controls (D-6). |

Translation: the sentence is projected by the consumer, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| With icon | `.empty-state` + `.material-icons` | Full-page lists: requests, documents, assets, conversations, the chat panel. |
| Text only | `.empty-state` | Inside a dashboard card or a landing section: "No recent requests". |
| On a card | `.empty-state.card` | Admin list pages, where the block stands on the canvas (`card`). |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | from content (about 160 px with icon, 96 px without) | `--space-12` by `--space-5` | `--text-body` |

The block takes the width of its container; the sentence wraps and is centred.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Shown | the list is empty or nothing matches | Icon and sentence, or sentence alone | The sentence is read as content; the list container's live region announces it (D-8) |
| Removed | content arrives | The list or grid takes its place | — |

There are no interactive, hover, focus or disabled states: the block is static and never focusable (design-system page). Empty, no results and a failed fetch look the same in the mocks; the feedback pattern requires a failed fetch to show an [alert](alert.md) instead (D-10).

## Markup

```html
<!-- rendered: with icon -->
<div class="empty-state">
  <span class="material-icons" aria-hidden="true">description</span>
  <p>No documents found</p>
</div>
```

```html
<!-- rendered: on a card (admin lists) -->
<div class="empty-state card">
  <span class="material-icons" aria-hidden="true">inbox</span>
  <p>No maintenance requests found</p>
</div>
```

```html
<!-- rendered: text only, inside a dashboard card -->
<div class="empty-state"><p>No recent requests</p></div>
```

```html
<!-- consumer -->
<coop-empty-state icon="description">No documents found</coop-empty-state>
<coop-empty-state icon="inbox" card>No maintenance requests found</coop-empty-state>
<coop-empty-state icon="chat_bubble_outline">Select a conversation to start chatting</coop-empty-state>
<coop-empty-state>No recent requests</coop-empty-state>
```

The classes above are part of the contract: the e2e page objects locate the block by `.empty-state` and read its `p`.

## Design

- Padding `--space-12` top and bottom, `--space-5` left and right; `text-align: center`; colour `--color-fg-muted`.
- Icon: `--icon-size` 3rem (48 px), `display: block`, `margin: 0 auto --space-2`, inherits the muted colour.
- Message: `--text-body` (`--font-size-md`, `--line-height-normal`), margin 0.
- With `card`: `--color-bg-surface` fill, `--border-width-hairline` `--color-border-default` edge, `--radius-lg` (the `.card` rules; the empty-state padding wins over the card's `--space-5`).
- Motion: none. Layer: none.

Component tokens: none. The block reads semantic tokens directly in `components.css`.

| Token | Aliases | Overridden by |
|---|---|---|
| `--color-fg-muted` | `--palette-gray-600` | `prefers-contrast: more` raises it to `--color-fg-default` (tokens.css) |
| `--space-12` | 3rem | — (one padding for every screen; the mocks' 24, 40 and 48 px are drift) |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Icon and message | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Card fill (`card`) | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Card edge (`card`) | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Message on a card or panel |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Message on the page |

The icon is decorative and exempt from 1.4.11. Under `forced-colors: active` the card edge becomes `CanvasText` (tokens.css); the component adds no colour of its own.

## Responsive behaviour

- No breakpoint rules apply (design-system page). The block is centred in whatever width the list area has and the sentence wraps.
- In card grids (documents, assets) the page stretches the block across every column; inside a two-pane messaging layout it fills the panel.
- At 320 px "No maintenance requests found" wraps onto two lines, the icon stays 3rem, nothing scrolls horizontally or clips, and at 400 % zoom the block reflows with the page (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: none; the block is not interactive.

## Accessibility

### Role and pattern

Plain text in a block: no role and no WAI-ARIA widget pattern (design-system page). The icon is `aria-hidden="true"`. The list container that swaps the spinner, the list and the empty state is `aria-live="polite"` so the sentence is announced when results change by search or filter (design-system requirement; the page sets it, D-8).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Never stops on the empty state; it has no controls and no `tabindex`. |

### Focus

None. Focus stays on the filter or search control that caused the change.

### Labelling

- The sentence is the accessible content; it names what is empty ("No documents found"), never just "Empty".
- No `aria-label`, `role="img"` or heading is added.

### Announcements

None by the component. The page's `aria-live="polite"` list container announces the sentence once when it appears.

### Motion

None. Nothing animates, so `prefers-reduced-motion` changes nothing.

## Content and internationalisation

- Formulas (content foundation): "No {things} found" for lists ("No documents found", "No maintenance requests found"); "No {things} yet" for things the person creates ("No conversations yet", "No assets uploaded yet"); "No recent {things}" on dashboards ("No recent requests", "No recent notices"); a placeholder instruction for a panel awaiting a choice ("Select a conversation to start chatting").
- Sentence case, no full stop for a single short line ("No public notices at this time" per the recommended wording), no "Oops" or apology, no call to action.
- A search or filter with no match reuses the list's sentence; no separate "no matches" wording exists in the mocks.
- Translatable inputs: none; the sentence is projected. Data values: none.
- A French sentence about 30 % longer ("Aucune demande d'entretien trouvée") wraps onto two lines at 320 px without clipping.

## Performance

- Change detection: `OnPush`, signal inputs; the template is two conditional nodes.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the block's height is fixed by its padding, icon and one or two lines of text; it appears only after the fetch resolves, in the place the spinner held.
- Weight: imports `@angular/core` only; no CDK.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-empty-state icon="description">No documents found</coop-empty-state>` on the documents page, when it renders, then the DOM holds `<div class="empty-state"><span class="material-icons" aria-hidden="true">description</span><p>No documents found</p></div>`, centred, with `--space-12` vertical and `--space-5` horizontal padding in `--color-fg-muted`. (L2-REQ-035)
- **AC-2** Given `<coop-empty-state>No recent requests</coop-empty-state>` inside the "Recent Requests" card, when it renders, then there is no `.material-icons` element and the block is `<div class="empty-state"><p>No recent requests</p></div>`. (L2-REQ-030)
- **AC-3** Given `card` with `icon="inbox"` and "No maintenance requests found" on the admin maintenance page, when it renders, then the block has `.empty-state.card`, a `--color-bg-surface` fill, a `--color-border-default` edge and `--radius-lg` corners. (L2-REQ-030)
- **AC-4** Given `icon="cloud_upload"` and "No assets uploaded yet" on the admin assets page, when it renders, then the icon is 3rem (`--icon-size`), displayed as a block, centred, with `--space-2` below it. (L2-REQ-041)

### States

- **AC-5** Given the documents list filtered to "Reports" returns nothing, when the list renders, then the same component shows "No documents found" in place of the grid. (L2-REQ-035)
- **AC-6** Given Mira Fern has no conversations, when the messaging page renders, then the empty state shows `chat_bubble_outline` and "No conversations yet". (L2-REQ-036)
- **AC-7** Given the admin messaging page with no conversation selected, when the chat panel renders, then it shows the empty state "Select a conversation to start chatting". (L2-REQ-036)
- **AC-8** Given Mira Fern's requests arrive after the list was empty, when the list renders, then the empty state is removed from the DOM and the request cards take its place. (L2-REQ-030)

### Keyboard and focus

- **AC-9** Given <kbd>Tab</kbd> is pressed through the documents page while the empty state is shown, when focus moves, then it never lands on the empty state and stays on the page's controls. (L2-REQ-035)

### Screen readers

- **AC-10** Given the "No documents found" block, when read by assistive technology, then the text is exactly "No documents found", no role is exposed and the icon is not announced. (L2-REQ-035)
- **AC-11** Given the documents list container has `aria-live="polite"` and the "Reports" filter empties it, when the empty state appears, then "No documents found" is announced once and focus does not move. (L2-REQ-035)

### Theming

- **AC-12** Given any variant, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-035)

### Responsive

- **AC-13** Given "No maintenance requests found" with its icon at 320 px, when measured, then the sentence wraps onto two centred lines, the icon stays 3rem and nothing scrolls horizontally. (L2-REQ-030)

### Performance

- **AC-14** Given the empty state inside a page whose filter chips change, when a sibling re-renders, then the empty state does not (`OnPush` with signal inputs). (L2-REQ-035)

## Implementation notes

- Folder `frontend/projects/components/src/lib/empty-state/`: `empty-state.component.ts`, `empty-state.component.html`, `empty-state.component.css`; export from `public-api.ts`.
- The template is `<div class="empty-state" [class.card]="card()">@if (icon()) {<span class="material-icons" aria-hidden="true">{{ icon() }}</span>}<p><ng-content></ng-content></p></div>`; the stylesheet is empty (everything comes from `components.css`).
- No CDK primitive. Composes nothing; [card](card.md) sections and list pages project it. The page sets `aria-live="polite"` on the list container.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Is there an action slot?* No. The content foundation says the entry button sits "next to" the empty state, and in every mock it is in the page header or toolbar above the list, never inside the block; the design-system page states "no action button". The page keeps its button where it is.
- **D-5** *Is there a title?* No. No mock has one and the design-system page excludes it; one sentence is the whole message.
- **D-6** *Is the message an input or a slot?* A slot, projected into the `<p>`. Every usage is one plain sentence; projection lets the page use its translation pipe without a string input, and the rule "one sentence, no markup" keeps the block uniform.
- **D-7** *How do the admin lists get their card surface?* A `card` boolean that adds `.card`. The admin maintenance, documents and assets mocks render `.empty-state.card` on the canvas; the member app and the dashboards do not.
- **D-8** *Who announces the empty state?* The list container, which the page marks `aria-live="polite"` (design-system accessibility requirement). A role on the block itself would announce nothing when the block is inserted together with its region.
- **D-9** *Which icons replace the member app's inline SVGs?* `build` for requests, `description` for documents, `chat_bubble_outline` for conversations, `cloud_upload` for assets, `inbox` for the admin request list, as the feedback pattern and the admin mocks already use; the design system standardises on Material Icons.
- **D-10** *Does a failed fetch show an empty state?* No. The mocks do, and the feedback pattern records it as a gap; a failure shows an [alert](alert.md). The component is only for "nothing exists" and "nothing matches".
- **D-11** *Who chooses the sentence?* The page, following the content foundation formulas; the dashboard's bare "No recent requests" div and the landing page's `.empty-text` paragraph both become this component with the recommended wording ("No public notices at this time", no full stop).
