# Description list

| Field | Value |
|---|---|
| Selector | `coop-description-list` |
| Library path | `frontend/projects/components/src/lib/description-list/` |
| Status | planned |
| Traces to | L2-REQ-014, L2-REQ-021, L2-REQ-022, L2-REQ-023, L2-REQ-024, L2-REQ-040, L2-REQ-041 |
| Design system | [`description-list.html`](../../design-system/components/description-list.html) |
| Source mocks | [`pages/public-profile/default`](../../mocks/pages/public-profile/default.html), [`pages/public-profile/empty`](../../mocks/pages/public-profile/empty.html), [`dialogs/public-profile-switcher/default`](../../mocks/dialogs/public-profile-switcher/default.html), [`dialogs/admin-asset-detail/default`](../../mocks/dialogs/admin-asset-detail/default.html), [`pages/admin-maintenance/detail-new`](../../mocks/pages/admin-maintenance/detail-new.html), [`pages/admin-maintenance/detail-completed`](../../mocks/pages/admin-maintenance/detail-completed.html), [`dialogs/public-maintenance-detail/default`](../../mocks/dialogs/public-maintenance-detail/default.html) |
| Rendering | [`description-list.html`](description-list.html) |

## Purpose and scope

A description list shows the facts about one record as label and value pairs, read once in order: the member's profile (username, email, phone, unit), an asset's details (name, type, size, dimensions, created) and a maintenance request's details (status, priority, submitted, received, started, completed, address, phone, unattended entry). A muted label sits left, a medium-weight value right, a hairline between rows, inside a [card](card.md) or a [dialog](dialog.md) whose heading names the record.

Use something else instead when:

- the same facts are compared across many records: [table](table.md);
- the values are being edited: [form field](form-field.md) in a dialog;
- the record's status alone is shown beside a title: [badge](badge.md).

Out of scope:

- Formatting. Dates ("Oct 13, 2026, 8:00 AM"), sizes ("2 KB"), dimensions ("1200 × 800 px") and addresses arrive as strings from the consumer (D-8).
- Which rows a record has. The consumer decides the rows and their order; a request that has not been received has no "Received" row (D-7).
- Editing, links and actions. No usage has a link or button inside a value; the card's buttons ("Edit", "Change Password") are the page's.

## Usage

Every label-and-value group in `docs/mocks` (the `.info-row` on 2 profile states, 1 notification and the switcher dialog, the asset-detail paragraphs, and the maintenance detail meta and info grid on 4 admin states and 2 public dialog states) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/public-profile/*`, `notifications/public-profile-saved`, `dialogs/public-profile-switcher` | items Username, Email, Phone, Unit, Member since | "mira.fern", "mira@example.invalid", "555-0101", "101", "Oct 13, 2026"; missing phone or unit → "Not provided" (the mocks' blank, "Not set", "Not assigned") | default, missing values (`empty`) | card, dialog |
| `dialogs/admin-asset-detail/default` | items Name, Type, Size, Dimensions (images only), Created | "Courtyard plan.pdf", "application/pdf", "2 KB", "1200 × 800 px", "Oct 13, 2026, 8:00 AM" (the mock shows "2048" and seconds) | default | dialog |
| `pages/admin-maintenance/detail-*`, `dialogs/public-maintenance-detail/*` | items Status (badge), Priority, Submitted, Received, Started, Completed, Completed by, Address, Phone, Unattended entry | badges "New" (warning), "Received" (gray), "Started" (info), "Completed" (success); "High"; "Oct 13, 2026, 8:00 AM"; "Tavi Moss"; "101 Fictional Court, unit 101"; "555-0101"; "No" | default per status | card, dialog |

Every row is buildable with the API below: an ordered list of items, each a label with a text value, a missing value or a badge value.

## Anatomy

1. **List** — `dl.info-list`. A native `<dl>` with no browser margins.
2. **Row** — `div.info-row`. One `dt` and its `dd`; flex, label and value pushed apart by `--space-4`, `--space-3` vertical padding, hairline below (none on the last row).
3. **Label** — `dt.info-label`. `--text-body-sm` in `--color-fg-muted`; does not shrink (D-9).
4. **Value** — `dd.info-value`. `--text-label`, right-aligned, breaks anywhere when long; or the `missingLabel` text; or a `.badge` with the tone from the item.

Host: `coop-description-list` is `display: block` and carries no classes; it renders the `<dl>` and every row itself from `items` (D-4).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `items` | `readonly DescriptionItem[]` | — | yes | One row per item, in order. `DescriptionItem` is `{ label: string; value: string \| null; badge?: 'success' \| 'info' \| 'warning' \| 'danger' \| 'gray' }`. |
| `missingLabel` | `string` | `'Not provided'` | no | Shown in the value cell when `value` is `null`. |
| `labelledBy` | `string \| null` | `null` | no | Id of the heading that names the list, set as `aria-labelledby` only when several lists share a page. |

All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The list is static content. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Rows are rendered from `items`; projected children would break the `dl` content model (D-4). |

Translation: labels, values and `missingLabel` are the consumer's strings; the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Text value | — | Every fact that is a string: names, emails, dates, sizes. |
| Missing value | value `null` | A fact the record does not hold yet: a phone or unit not provided. |
| Badge value | `badge` tone set | A status or priority word: "New", "Received", "Started", "Completed". |

One size: row padding `--space-3`, label `--text-body-sm`, value `--text-label`. Rows are at least 45 px tall; the list is as wide as its card or dialog.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Muted label, medium value, hairline rows | `dl` of terms and descriptions |
| Missing value | `value: null` | The `missingLabel` text in the value cell | Read as the description: "Phone, Not provided" |
| Badge value | `badge` set | `.badge.badge-{tone}` in the value cell | The badge text is the description |

The design-system page states the list has no hover, selected, editable, loading or focus state; the rows never take focus.

## Markup

```html
<!-- rendered: profile, with a missing value -->
<coop-description-list>
  <dl class="info-list">
    <div class="info-row"><dt class="info-label">Username</dt><dd class="info-value">mira.fern</dd></div>
    <div class="info-row"><dt class="info-label">Email</dt><dd class="info-value">mira@example.invalid</dd></div>
    <div class="info-row"><dt class="info-label">Phone</dt><dd class="info-value">Not provided</dd></div>
    <div class="info-row"><dt class="info-label">Unit</dt><dd class="info-value">101</dd></div>
    <div class="info-row"><dt class="info-label">Member since</dt><dd class="info-value">Oct 13, 2026</dd></div>
  </dl>
</coop-description-list>
```

```html
<!-- rendered: maintenance request with a badge value -->
<dl class="info-list">
  <div class="info-row"><dt class="info-label">Status</dt><dd class="info-value"><span class="badge badge-gray">Received</span></dd></div>
  <div class="info-row"><dt class="info-label">Submitted</dt><dd class="info-value">Oct 13, 2026, 8:00 AM</dd></div>
  <div class="info-row"><dt class="info-label">Received</dt><dd class="info-value">Oct 14, 2026, 9:30 AM</dd></div>
  <div class="info-row"><dt class="info-label">Address</dt><dd class="info-value">101 Fictional Court, unit 101</dd></div>
</dl>
```

The asset detail differs only by its labels and values. `aria-labelledby` is added to the `dl` only when `labelledBy` is set.

```html
<!-- consumer -->
<coop-description-list [items]="[
  { label: 'Username', value: profile.username },
  { label: 'Email', value: profile.email },
  { label: 'Phone', value: profile.phone },
  { label: 'Unit', value: profile.unit },
  { label: 'Member since', value: memberSince() }
]" />
<coop-description-list [items]="requestItems()" labelledBy="request-title" />
```

The classes and elements above are part of the contract: the e2e page objects locate a value by its `dt` text (`.info-row:has(dt:text('Email')) dd`).

## Design

- Row padding `--space-3` block, none inline (the card or dialog provides the side padding); gap `--space-4` between label and value.
- Label `--text-body-sm` in `--color-fg-muted`; value `--text-label` in `--color-fg-default`, `text-align: right`, `overflow-wrap: anywhere`.
- The label does not shrink (`flex: 0 0 auto`, at most 50 % of the row) and the value takes the rest, so a long email wraps inside the value's half and the label stays whole on one line (D-9).
- Divider `--border-width-hairline` solid `--color-border-default`; none after the last row.
- Badge values use the [badge](badge.md) markup inside the `dd`; the row's height does not change.
- No motion, no elevation, no layer; the list sits in the flow of its card or dialog.

Component tokens: none. The list consumes semantic tokens directly (there is no `--info-*` group in components.css).

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Value | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Divider | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Surface (card, dialog) | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Warning badge value | `--color-warning-bg`, `--color-warning-fg` | `--palette-amber-100`, `--palette-amber-700` | `--palette-amber-100`, `--palette-amber-700` |
| Info badge value | `--color-info-bg`, `--color-info-fg` | `--palette-blue-100`, `--palette-blue-800` | `--palette-blue-100`, `--palette-blue-800` |
| Success badge value | `--color-success-bg`, `--color-success-fg` | `--palette-green-100`, `--palette-green-800` | `--palette-green-100`, `--palette-green-800` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Label |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Value |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | "New" badge value |
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | "Received" and "Started" badge values |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | "Completed" badge value |

The divider is decorative and exempt from 1.4.11. Under `prefers-contrast: more` tokens.css raises the label to `--color-fg-default`; under `forced-colors: active` the divider becomes `CanvasText`. The component adds no colour of its own.

## Responsive behaviour

- The mocks and the design system define no media rule: label and value share one line with a `--space-4` gap at every width, and the list fills its card or dialog.
- At 320 px the longest value in the mocks ("mira@example.invalid", "101 Fictional Court, unit 101", "Oct 13, 2026, 8:00 AM") wraps inside the value's half, right-aligned, with `overflow-wrap: anywhere`; the label keeps one line; the page never scrolls sideways (D-9). Rows do not stack label over value.
- At 400 % zoom every row remains readable in order and nothing clips (AGENTS.md reflow rule, WCAG 1.4.10).
- Targets: not applicable; the list is not interactive.

## Accessibility

### Role and pattern

A native `<dl>` of `<dt>` terms and `<dd>` descriptions, each pair grouped in a `<div>` (valid HTML; the group carries the divider). No ARIA role is added; `role="term"` and `role="definition"` are not used (design-system page). The mocks' `div.info-row` with two `span`s is replaced so the label-to-value relationship is exposed.

### Keyboard

| Key | Action |
|---|---|
| None | The list contains no focusable element; it is read in document order. |

### Focus

The rows never take focus. No value is a link or button in any usage, so no ring is drawn inside the list.

### Labelling

- Each `dd` is described by its `dt`; no `aria-label` is needed.
- The card or dialog heading ("Profile", "Asset Details", "Kitchen tap leak") names the list by proximity; `labelledBy` sets `aria-labelledby` only when several lists share a page.
- A missing value is the text "Not provided", so a screen reader never hears a label followed by silence.
- A badge value is announced as its text ("Received"); status is never conveyed by colour alone.

### Announcements

None. A change of status is announced by the page's [alert](alert.md), not by the list.

### Motion

None.

## Content and internationalisation

- Labels are short nouns in Title Case without a colon: "Username", "Email", "Phone", "Unit", "Member since", "Name", "Type", "Size", "Dimensions", "Created", "Status", "Priority", "Submitted", "Received", "Started", "Completed", "Completed by", "Address", "Unattended entry".
- Values are plain text in one format per kind: dates "Oct 13, 2026" and date-times "Oct 13, 2026, 8:00 AM" without seconds; sizes with a unit, "2 KB"; dimensions "1200 × 800 px"; the address "101 Fictional Court, unit 101"; yes/no facts "Yes" / "No" (content foundation; D-8).
- Order rows by importance: identity first (Username, Name), then contact (Email, Phone, Unit), then status and dates.
- A missing value says "Not provided" (D-6); a row that does not apply is omitted (D-7).
- Translatable inputs: `missingLabel`, and the labels the consumer passes. Data values: names, emails, phones, dates, sizes, addresses.
- A French label about 30 % longer ("Nom d'utilisateur", "Entrée sans surveillance") stays on one line within its 50 % share at 320 px; the value wraps beside it.

## Performance

- Change detection: `OnPush`, signal inputs; rows are rendered with `@for (item of items(); track item.label)`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: every row renders with its label and value (or "Not provided") in the same pass, so a loaded record changes nothing after first paint; badge values are the same height as text values.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK. Renders [badge](badge.md) markup for badge values; composes nothing else.

## Acceptance criteria

### Rendering

- **AC-1** Given `items` Username "mira.fern", Email "mira@example.invalid", Phone "555-0101", Unit "101", when it renders, then the DOM holds `dl.info-list` with four `div.info-row` children, each `dt.info-label` followed by `dd.info-value` with those texts in that order. (L2-REQ-014)
- **AC-2** Given the Phone item with `value: null`, when it renders, then its `dd` reads "Not provided" and the row is not omitted. (L2-REQ-014)
- **AC-3** Given the asset detail items Name "Courtyard plan.pdf", Type "application/pdf", Size "2 KB", Created "Oct 13, 2026, 8:00 AM", when it renders, then the four rows show exactly those strings and no row shows "2048" or seconds. (L2-REQ-040)
- **AC-4** Given an image asset with Dimensions "1200 × 800 px" and a document asset with no Dimensions item, when each renders, then the image list has five rows and the document list four. (L2-REQ-041)
- **AC-5** Given a new request's items Status badge "New" (warning), Priority "High", Submitted "Oct 13, 2026, 8:00 AM", Address "101 Fictional Court, unit 101", Phone "555-0101", Unattended entry "No", when it renders, then the Status `dd` holds `.badge.badge-warning` reading "New" and the other values are plain text. (L2-REQ-021)
- **AC-6** Given a received request, when it renders, then the Status `dd` holds `.badge.badge-info` reading "Received" and a "Received" row shows "Oct 14, 2026, 9:30 AM". (L2-REQ-022)
- **AC-7** Given a started request, when it renders, then the Status badge reads "Started" and a "Started" row shows "Oct 15, 2026, 8:00 AM" after the "Received" row. (L2-REQ-023)
- **AC-8** Given a completed request, when it renders, then the Status `dd` holds `.badge.badge-success` reading "Completed", a "Completed" row shows "Oct 16, 2026, 4:00 PM" and a "Completed by" row shows "Tavi Moss". (L2-REQ-024)

### Screen readers

- **AC-9** Given the profile list, when a screen reader reads the Email row, then it announces the term "Email" with the description "mira@example.invalid", and the Phone row as "Phone, Not provided". (L2-REQ-014)

### Theming

- **AC-10** Given any list, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-014)

### Responsive

- **AC-11** Given the profile list inside a card at 320 px, when measured, then "Email" stays on one line, "mira@example.invalid" wraps inside the value's half and stays right-aligned, and the page has no horizontal scroll. (L2-REQ-014)
- **AC-12** Given the request list at 320 px, when measured, then "Address" and "101 Fictional Court, unit 101" share a row, the value wrapping onto two lines, and no row stacks its label above its value. (L2-REQ-021)

### Performance

- **AC-13** Given a profile list, when an unrelated input on the page changes, then the list does not re-render (`OnPush` with signal inputs), and changing one item's value re-renders only that row. (L2-REQ-014)

## Implementation notes

- Folder `frontend/projects/components/src/lib/description-list/`: `description-list.component.ts`, `description-list.component.html`, `description-list.component.css`, `description-item.ts` (interface `DescriptionItem`), `description-badge-tone.ts` (type alias); export from `public-api.ts`.
- Template: `<dl class="info-list" [attr.aria-labelledby]="labelledBy()">@for (item of items(); track item.label) { <div class="info-row"><dt class="info-label">{{ item.label }}</dt><dd class="info-value">@if (item.badge) { <span class="badge badge-{{ item.badge }}">{{ item.value }}</span> } @else { {{ item.value ?? missingLabel() }} }</dd></div> }</dl>`.
- Component CSS adds `.info-label { flex: 0 0 auto; max-width: 50%; }` (D-9); it belongs in `components.css` next to `.info-row`, and the rendering page carries it as a specimen-only style until then.
- No CDK primitive. Renders [badge](badge.md) markup; composed by the profile card, the asset detail [dialog](dialog.md) and the maintenance detail panel.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Items input or projected row components?* An `items` input. A `<dl>` may contain only `dt`, `dd` and `div` groups; a projected `coop-description-item` host element between the `dl` and its rows would break that content model and the term-to-description relationship the design system requires. Rendering the rows from data keeps the DOM exactly as the design system specifies.
- **D-5** *Are links or buttons allowed in a value?* No. No usage has one; the design-system mention of a link value is hypothetical. Badge values are supported because the maintenance detail shows the status as a badge.
- **D-6** *What does a missing value show?* "Not provided", from `missingLabel`. The design system requires it; the mocks' blank, "Not set" and "Not assigned" are drift.
- **D-7** *Does a request that has not been received show a "Received" row?* No. The consumer passes only the rows that apply; the Status badge already tells the stage, and "Received, Not provided" would read as a missing fact rather than a stage not reached.
- **D-8** *Who formats dates, sizes and dimensions?* The consumer, following the content foundation: "Oct 13, 2026, 8:00 AM" without seconds, "2 KB", "1200 × 800 px". The component shows the strings it is given and never calls a formatter, so one place in each feature owns the format.
- **D-9** *How do label and value share a 320 px row?* They stay on one line: the label does not shrink and takes at most half the row; the value takes the rest, right-aligned, and breaks anywhere. The design system keeps one line at every width and names `overflow-wrap: anywhere` as the requirement; stacking would change the look on every screen to fix the one long email.
