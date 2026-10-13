# Metric card

| Field | Value |
|---|---|
| Selector | `coop-metric-card` |
| Library path | `frontend/projects/components/src/lib/metric-card/` |
| Status | planned |
| Traces to | L2-REQ-030, L2-REQ-035, L2-REQ-038, L2-REQ-054 |
| Design system | [`metric-card.html`](../../design-system/components/metric-card.html) |
| Source mocks | [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-dashboard/empty`](../../mocks/pages/admin-dashboard/empty.html), [`pages/public-dashboard/default`](../../mocks/pages/public-dashboard/default.html), [`pages/public-dashboard/empty`](../../mocks/pages/public-dashboard/empty.html), [`pages/public-dashboard/partial`](../../mocks/pages/public-dashboard/partial.html) |
| Rendering | [`metric-card.html`](metric-card.html) |

## Purpose and scope

A metric card puts one number first: a count, its label and an accent icon tile, so a member or a staff member sees at a glance how many open requests, unread messages, documents or active members there are. Four sit in a row at the top of the admin dashboard and three at the top of the member dashboard. It is a summary, not a control: no mock links a metric card to anything (D-4).

Use something else instead when:

- the surface holds text, a form or a list: [card](card.md);
- the number is a status or a count inside a row: [badge](badge.md), [list item](list-item.md);
- the number belongs to a table column: [table](table.md).

Out of scope:

- The grid the cards sit in (`.metric-cards` on the admin dashboard, `.metric-grid` on the member dashboard). The page owns it; this CRD requires the card to work at every column count from one to four (D-9).
- Fetching and computing the counts. The dashboard passes a number; while it loads the page passes 0, as the mocks do (D-8).
- Any trend, unit or link. The mocks show none (design-system content rule).

## Usage

Every `.metric-card` in `docs/mocks` is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-dashboard/default`, `notifications/admin-dashboard-unread/info` | `count`, `label`, `icon` × 4 in `.metric-cards` | `build` 3 "Open Requests"; `chat` 2 "Unread Messages"; `description` 3 "Documents"; `people` 4 "Active Members" | default | canvas |
| `pages/admin-dashboard/empty` | same × 4 | counts of 0 | default | canvas |
| `pages/admin-dashboard/partial` | same × 4 | mixed counts, some sections empty | default | canvas |
| `pages/public-dashboard/default` | `count`, `label`, `icon` × 3 in `.metric-grid` | `build` 4 "Requests"; `chat` 1 "Messages"; `people` 3 "Members" | default | canvas |
| `pages/public-dashboard/empty`, `pages/public-dashboard/partial` | same × 3 | counts of 0 (empty) or mixed (partial) | default | canvas |

Every row is buildable with the API below: three required inputs and nothing else.

## Anatomy

1. **Card** — `.card.metric-card`: the [card](card.md) surface (`--color-bg-surface`, `--border-width-hairline` `--color-border-default` edge, `--space-5` padding) with `--radius-lg` corners and the resting `--shadow-1`.
2. **Row** — `.metric-card-inner`: a centred flex row, gap `--space-4`.
3. **Icon tile** — `.metric-icon`: a 3rem square, `--radius-md`, `--color-accent-subtle` fill, holding one `.material-icons` span (`aria-hidden="true"`) in `--color-fg-accent`. It never shrinks (D-10).
4. **Text column** — `.metric-info`: count above label.
5. **Count** — `.metric-count`: `--text-h1` with tabular numerals.
6. **Label** — `.metric-label`: `--text-body-sm` in `--color-fg-muted`.

Host: `coop-metric-card` is `display: block` and carries no classes of its own; it fills its grid cell. All classes go on the inner elements.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `count` | `number` | — | yes | A whole number, rendered as given with no grouping or abbreviation (D-7). 0 renders "0". |
| `label` | `string` | — | yes | Short plural noun phrase in Title Case ("Open Requests"). Rendered after the count. |
| `icon` | `string` | — | yes | Material Icons ligature name rendered in the tile (`build`, `chat`, `description`, `people`). |

All inputs are signal inputs; the required ones use `input.required()`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The card is not interactive (D-4). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Everything is an input so the reading order is fixed (D-5). |

Translation: `label` is an input, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation). `count` is data.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| One variant | `.card.metric-card` | Every dashboard count. The tile is always the accent tile (D-6). |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | from content (about 88 px) | `--space-5` | `--text-h1` count, `--text-body-sm` label |

The card takes the width of its grid cell; the icon tile is 3rem.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Count and label beside the accent tile | Read as "3 Open Requests" |
| Zero | `count` = 0 | "0" in the same style; the card keeps its shape | Read as "0 Open Requests" |

There is no hover, focus, active, disabled, loading or error state: the card is static (design-system page). The dashboard passes 0 until data arrives and shows an [alert](alert.md) if the fetch fails (D-8).

## Markup

```html
<!-- rendered -->
<div class="card metric-card">
  <div class="metric-card-inner">
    <div class="metric-icon"><span class="material-icons" aria-hidden="true">build</span></div>
    <div class="metric-info">
      <span class="metric-count">3</span>
      <span class="metric-label">Open Requests</span>
    </div>
  </div>
</div>
```

```html
<!-- rendered: the admin dashboard row (the grid is the page's) -->
<div class="metric-cards">
  <coop-metric-card …></coop-metric-card> ×4
</div>
```

```html
<!-- consumer -->
<coop-metric-card [count]="openRequests()" label="Open Requests" icon="build"></coop-metric-card>
<coop-metric-card [count]="unreadMessages()" label="Unread Messages" icon="chat"></coop-metric-card>
<coop-metric-card [count]="documents()" label="Documents" icon="description"></coop-metric-card>
<coop-metric-card [count]="activeMembers()" label="Active Members" icon="people"></coop-metric-card>
```

The classes above are part of the contract: the e2e page objects locate the cards by `.metric-card`, `.metric-count` and `.metric-label`.

## Design

- Surface from `.card`: padding `--space-5`, `--border-width-hairline` solid `--color-border-default`, fill `--color-bg-surface`; `.metric-card` adds `--radius-lg` and `--shadow-1`.
- Row: flex, `align-items: center`, gap `--space-4`.
- Tile: 3rem by 3rem, `--radius-md`, fill `--color-accent-subtle`, icon `--icon-size` 1.5rem in `--color-fg-accent`, `flex-shrink: 0` (D-10).
- Count: `--text-h1` (semibold, `--font-size-2xl`, `--line-height-tight`), `font-variant-numeric: tabular-nums`, `--color-fg-default`.
- Label: `--text-body-sm`, `--color-fg-muted`. The text column has `min-width: 0` so a long label wraps instead of overflowing (D-10).
- Motion: none. Layer: none.

Component tokens: none. The block reads semantic tokens directly in `components.css`.

| Token | Aliases | Overridden by |
|---|---|---|
| `--shadow-1` | the metric card's resting shadow | — |
| `--color-accent-subtle` | `--palette-green-50` | — (one tile tint for every card, D-6) |
| `--color-fg-accent` | `--palette-green-700` | — |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Count | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Tile fill | `--color-accent-subtle` | `--palette-green-50` | `--palette-green-50` |
| Icon | `--color-fg-accent` | `--palette-green-700` | `--palette-green-700` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Count on card |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Label on card |
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Icon on tile |

The card edge is decorative and exempt from 1.4.11. Under `forced-colors: active` the edge becomes `CanvasText` (tokens.css); the component adds no colour of its own.

## Responsive behaviour

- The card is fluid and has no breakpoint of its own; it fills its grid cell at every width.
- Admin dashboard: `.metric-cards` (components.css) is four columns with a `--space-4` gap above `--layout-breakpoint-md` and one column at 768 px and below.
- Member dashboard: the page's `.metric-grid` is one column below `--layout-breakpoint-sm` and three columns at 640 px and above (responsive foundation); this rule is page CSS, not in components.css (D-9).
- The label wraps onto a second line when the cell is narrow ("Unread Messages" at 320 px in a two-column test grid); the count stays on one line and the tile keeps 3rem.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom the row reflows to one column (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: none; the card is not interactive.

## Accessibility

### Role and pattern

Static text in a group of `div` elements: no role and no WAI-ARIA widget pattern (design-system page). The icon is `aria-hidden="true"` so the card reads as "3 Open Requests".

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Never stops on a metric card; it is not focusable. |

### Focus

None. The component sets no `tabindex`.

### Labelling

- The count and label are text and are read in DOM order, count first (D-5).
- No `aria-label`, `aria-labelledby` or `role="img"` is set on the card or the icon; naming the icon would make screen readers say "build 3 Open Requests".

### Announcements

None. Counts change only on page load or refresh; the page does not announce them.

### Motion

None. Nothing transitions or animates, so `prefers-reduced-motion` changes nothing.

## Content and internationalisation

- The label is a short plural noun phrase in Title Case, as in the mocks: "Open Requests", "Unread Messages", "Documents", "Active Members" (admin); "Requests", "Messages", "Members" (member app). Keep the same casing on both dashboards (content foundation).
- The count is a whole number with no abbreviation, unit or trend; show 0 rather than hiding the card.
- Translatable inputs: `label`. Data values: `count`.
- A French label about 30 % longer ("Demandes ouvertes", "Messages non lus") wraps onto two lines beside the tile; the count does not move.

## Performance

- Change detection: `OnPush`, signal inputs; the template binds the three inputs directly.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the card's height comes from the 3rem tile and two lines of text, so a count changing from 0 to 12 never changes the height; tabular numerals keep the count's width stable per digit.
- Weight: imports `@angular/core` only; no CDK, no pipes.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-metric-card [count]="3" label="Open Requests" icon="build">` on the admin dashboard, when it renders, then the DOM holds `<div class="card metric-card"><div class="metric-card-inner"><div class="metric-icon"><span class="material-icons" aria-hidden="true">build</span></div><div class="metric-info"><span class="metric-count">3</span><span class="metric-label">Open Requests</span></div></div></div>` with `--radius-lg` corners and the `--shadow-1` shadow. (L2-REQ-054)
- **AC-2** Given `count` 0 with the label "Unread Messages", when it renders, then "0" is shown in `--text-h1` and the card keeps the same height as a card showing "2". (L2-REQ-038)
- **AC-3** Given `label="Documents"`, `icon="description"` and `count` 3, when it renders, then the tile is 3rem square with a `--color-accent-subtle` fill, `--radius-md` corners and the icon in `--color-fg-accent`. (L2-REQ-035)
- **AC-4** Given the member dashboard passes Mira Fern's own request count 4 with `label="Requests"`, when it renders, then the count reads "4" in `--text-h1` with tabular numerals and the label "Requests" in `--text-body-sm` `--color-fg-muted` below it. (L2-REQ-030)
- **AC-5** Given the four admin cards inside `.metric-cards` at 1280 px, when measured, then they form one row of four equal columns separated by `--space-4`. (L2-REQ-054)

### States

- **AC-6** Given a metric card, when it is hovered or clicked, then nothing changes: no edge, shadow or cursor change, and no event leaves the component. (L2-REQ-054)

### Keyboard and focus

- **AC-7** Given <kbd>Tab</kbd> is pressed repeatedly through the admin dashboard, when focus moves, then it never lands on a metric card or its children. (L2-REQ-054)

### Screen readers

- **AC-8** Given the "Open Requests" card, when read by assistive technology, then the text is "3 Open Requests" in that order, no role is exposed and the icon is not announced. (L2-REQ-054)
- **AC-9** Given the "Unread Messages" card with `count` 2, when read by assistive technology, then the text is "2 Unread Messages". (L2-REQ-038)

### Theming

- **AC-10** Given the card, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-054)

### Responsive

- **AC-11** Given the four admin cards inside `.metric-cards` at 768 px and at 320 px, when measured, then the grid is one column and each card spans the full width. (L2-REQ-054)
- **AC-12** Given the "Unread Messages" card in a cell about 150 px wide, when measured, then the label wraps onto two lines, the tile stays 3rem and nothing scrolls horizontally. (L2-REQ-038)
- **AC-13** Given the three member cards in the page's `.metric-grid`, when the viewport is 640 px or wider, then they form three equal columns, and below 640 px one column. (L2-REQ-030)

### Motion

- **AC-14** Given `prefers-reduced-motion: reduce` or not, when the dashboard renders, then no part of the card animates or transitions. (L2-REQ-054)

### Performance

- **AC-15** Given the four cards, when one `count` input changes, then only that card re-renders (`OnPush` with signal inputs) and the row's height does not change. (L2-REQ-054)

## Implementation notes

- Folder `frontend/projects/components/src/lib/metric-card/`: `metric-card.component.ts`, `metric-card.component.html`, `metric-card.component.css`; export from `public-api.ts`.
- The stylesheet adds `flex-shrink: 0` to `.metric-icon` and `min-width: 0` to `.metric-info` (D-10); everything else comes from `components.css`.
- No CDK primitive. Composes the [card](card.md) surface classes (`.card`) but not the `coop-card` component: the metric card has no title, slots or states to share.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Is the card a link to its section?* No. No mock links a metric card (the admin tiles and the dashboard "View all" links do that), and the design-system page documents it as a summary, not a control. A link can be added later as an `href` input without changing the existing API.
- **D-5** *Count then label, or label then count?* Count first. The design-system page sets value first so the pair reads "3 Open Requests"; the admin mock agrees and the member mock reverses it ("Requests 4"). The member dashboard adopts the count-first order; the mock's order is drift.
- **D-6** *One accent tile or a tint per card?* One accent tile. The mocks tint each tile differently and differently on each dashboard, and two of the tinted icons fail 4.5:1; the design-system page resolves to the accent tile.
- **D-7** *How is the count formatted?* As a plain whole number, no grouping: the content foundation shows counts as bare numbers beside a label and the product's counts are small. Grouping would be an `Intl.NumberFormat` pipe in the consumer if ever needed.
- **D-8** *Is there a loading or error state?* No. The design-system page shows none; the dashboards pass 0 until the counts arrive (as the empty and partial mocks render) and report a failed fetch with an [alert](alert.md).
- **D-9** *Who owns the grids?* The page. `.metric-cards` (four to one column at 768 px) is in `components.css`; the member dashboard's `.metric-grid` (one to three columns at 640 px) is page CSS the design system did not extract. The card must work in both and in a one-column reflow at 320 px.
- **D-10** *Can the tile shrink?* No. `components.css` omits the mocks' `flex-shrink: 0` on `.metric-icon`; the component restores it and gives `.metric-info` `min-width: 0` so long labels wrap instead of squeezing the tile.
- **D-11** *Which icon set?* Material Icons by name, through `icon`. The member mock uses inline SVG; the design system standardises on Material Icons ligatures.
