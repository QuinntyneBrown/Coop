# Tabs

| Field | Value |
|---|---|
| Selector | `coop-tabs`, `coop-tab` |
| Library path | `frontend/projects/components/src/lib/tabs/` |
| Status | planned |
| Traces to | L2-REQ-028, L2-REQ-045, L2-REQ-046 |
| Design system | [`tabs.html`](../../design-system/components/tabs.html) |
| Source mocks | [`pages/admin-maintenance/detail-new`](../../mocks/pages/admin-maintenance/detail-new.html), [`pages/admin-maintenance/comments`](../../mocks/pages/admin-maintenance/comments.html), [`pages/admin-maintenance/comments-empty`](../../mocks/pages/admin-maintenance/comments-empty.html), [`pages/admin-settings/default`](../../mocks/pages/admin-settings/default.html), [`pages/admin-settings/content`](../../mocks/pages/admin-settings/content.html), [`pages/admin-settings/account`](../../mocks/pages/admin-settings/account.html) |
| Rendering | [`tabs.html`](tabs.html) |

## Purpose and scope

Tabs switch between two to four sibling views of one thing on the same page: the "Details" and "Comments" views of a maintenance request, and the "Theme", "Content" and "Account" sections of admin settings. One tab is selected at a time and is filled with the accent colour; the panel below shows only the selected view. The component follows the WAI-ARIA Tabs pattern with automatic activation, so arrow keys move between views without leaving the tab list.

Use something else instead when:

- the control narrows a list by category and stays pressed: [filter chips](filter-chips.md);
- the control moves to another area of the app: [sidebar](sidebar.md) or [bottom tab bar](bottom-tab-bar.md);
- the control triggers an action: [button](button.md).

Out of scope:

- The content of each panel. The maintenance detail body, the comment list and composer (L2-REQ-028) and the settings theme form (L2-REQ-045) are the page's; the component only shows or hides the panel they are projected into.
- The status badge and heading in the maintenance detail header. The page projects them through `[slot=header]`; the component does not read the request's status.
- Routing. Selecting a tab never changes the URL; a tab that must load a new URL is navigation and uses a link with `aria-current="page"` (design-system rule), not this component.

## Usage

Every `.tab-btn` in `docs/mocks` (12 uses on 6 screens) and every settings `.tab` (9 uses on 3 screens) is one of the configurations below. The mocks load the other view as a separate page; the app swaps the panel in place, which is the tablist form the design system specifies.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-maintenance/detail-new`, `detail-received`, `detail-started`, `detail-completed` detail panel | two tabs, label "Request views", "Details" selected | header slot: "Kitchen tap leak" + status badge; panels: detail body, comments | selected, default | card |
| `pages/admin-maintenance/comments`, `comments-empty` detail panel | two tabs, "Comments" selected | panel: Tavi Moss's comment and the "Add a comment..." composer; empty: no comments yet | selected, default | card |
| `pages/admin-settings/default`, `content`, `account` settings page | three tabs, label "Settings sections", one of "Theme" / "Content" / "Account" selected | panels: "Theme Customization" form, "Content Management", "Account Settings" | selected, default | canvas |

Every row is buildable with the API below: two or three text-only tabs, one selected, an optional header between the list and the panels.

## Anatomy

1. **Tab list** — `.detail-tabs`, `role="tablist"`, `aria-label` from `label`. Flex row, `--space-1` gap, `--space-2` padding below, hairline rule `--color-border-default`, `--space-4` margin below.
2. **Tab** — `.tab-btn`, native `<button type="button" role="tab">`. Padding `--space-2` by `--space-4`, radius `--radius-sm`, label `--text-body-sm`, transparent fill, `--color-fg-muted` label. Carries `aria-selected`, `aria-controls`, `id` and the roving `tabindex`.
3. **Selected tab** — `aria-selected="true"`: `--color-accent` fill, `--color-fg-on-accent` label, `tabindex="0"`.
4. **Header (optional)** — the consumer's `[slot=header]` content, rendered between the list and the panels (the maintenance `.detail-header`).
5. **Panel** — one `<div role="tabpanel" tabindex="0">` per tab, `id` and `aria-labelledby` paired with its tab; every panel but the selected one has the `hidden` attribute.

Host: `coop-tabs` is `display: block` and carries no classes; the list, header and panels are rendered inside it. `coop-tab` is declarative: its host element renders nothing (`display: none`) and holds the tab's label, value and panel template, which `coop-tabs` renders.

## API

### Inputs

`coop-tabs`:

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | `aria-label` of the tab list: "Request views", "Settings sections". |
| `selected` | `string \| null` | `null` | no | The `value` of the selected tab. `null` selects the first tab (D-6). A value that matches no tab also falls back to the first tab. |
| `id` | `string \| null` | `null` | no | Prefix for the generated ids. With `id="request"` the tabs are `request-tab-details` and the panels `request-panel-details`; with no `id` they are `tab-details` and `panel-details` (the design-system markup). A page with two tab sets must set `id` on at least one. |

`coop-tab`:

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `string` | — | yes | Identifies the tab (`details`, `comments`, `theme`); used in the generated ids and in `selected`. Unique within the set. |
| `label` | `string` | — | yes | The visible tab text and accessible name: "Details", "Comments", "Theme". A count goes in the text ("Comments (3)"), never in a separate input (D-9). |
| `testId` | `string \| null` | `null` | no | Rendered as `data-testid` on the tab button (`settings-tab-theme`, `maintenance-tab-comments`), because the button is rendered by `coop-tabs`, not by the consumer's element (D-8). |

Booleans: none. All inputs are signal inputs.

### Outputs

`coop-tabs`:

| Output | Payload | Emitted when |
|---|---|---|
| `selectedChange` | `string` (the newly selected `value`) | A different tab is selected by pointer, <kbd>Enter</kbd>, <kbd>Space</kbd>, an arrow key, <kbd>Home</kbd> or <kbd>End</kbd>. Not emitted when the selected tab is activated again or when `selected` changes from outside. |

`coop-tab` has no outputs.

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `coop-tab` default | any content | The panel for that tab. Captured once as a template and rendered by `coop-tabs` inside the panel element; it stays in the DOM while hidden (D-7). |
| `coop-tabs` `[slot=header]` | any content | Rendered once between the tab list and the panels. Used for the maintenance `.detail-header` (title and status badge). Empty for the settings page. |

Translation: `label` on both elements carries every visible string; the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Segmented | — (`.tab-btn` in `.detail-tabs`) | The only variant: two to four short text tabs, the selected one filled. No underline, icon or closable tab is implemented (design-system page). |

The settings page's `.tab`/`.tabs` look (bordered, 10 px radius) is replaced by this variant (D-4).

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | 2.25rem (36 px: `--text-body-sm` line plus `--space-2` top and bottom) | `--space-2` by `--space-4` | `--text-body-sm` |

Width comes from the label plus padding; the list never stretches tabs. Two to four tabs sit on one row; the list does not wrap or scroll (D-10).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | `aria-selected="false"` | Transparent fill, `--color-fg-muted` label | Role tab, name = label, not selected, `tabindex="-1"` |
| Hover | `:hover` on an unselected tab | Fill `--color-bg-subtle`; a selected tab does not change | — |
| Focus | `:focus-visible` | Shared ring `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset`, visible on the selected fill too | — |
| Active (pressed) | `:active` | Same as hover; selection changes on `click` | — |
| Selected | `aria-selected="true"` | `--color-accent` fill, `--color-fg-on-accent` label | Selected = true, `tabindex="0"`; its panel is shown |
| Panel hidden | `hidden` on the panel | Not rendered | Removed from the accessibility tree and tab order |
| Disabled | — | Not implemented (D-11) | — |

## Markup

```html
<!-- rendered: maintenance detail, "Details" selected -->
<div class="detail-tabs" role="tablist" aria-label="Request views">
  <button class="tab-btn" type="button" role="tab" id="tab-details" aria-selected="true" aria-controls="panel-details" tabindex="0" data-testid="maintenance-tab-details">Details</button>
  <button class="tab-btn" type="button" role="tab" id="tab-comments" aria-selected="false" aria-controls="panel-comments" tabindex="-1" data-testid="maintenance-tab-comments">Comments</button>
</div>
<div class="detail-header"><h2>Kitchen tap leak</h2><span class="badge badge-warning">New</span></div>
<div role="tabpanel" id="panel-details" aria-labelledby="tab-details" tabindex="0">…detail body…</div>
<div role="tabpanel" id="panel-comments" aria-labelledby="tab-comments" tabindex="0" hidden>…comments…</div>
```

```html
<!-- rendered: settings, "Content" selected, id="settings" -->
<div class="detail-tabs" role="tablist" aria-label="Settings sections">
  <button class="tab-btn" type="button" role="tab" id="settings-tab-theme" aria-selected="false" aria-controls="settings-panel-theme" tabindex="-1" data-testid="settings-tab-theme">Theme</button>
  <button class="tab-btn" type="button" role="tab" id="settings-tab-content" aria-selected="true" aria-controls="settings-panel-content" tabindex="0" data-testid="settings-tab-content">Content</button>
  <button class="tab-btn" type="button" role="tab" id="settings-tab-account" aria-selected="false" aria-controls="settings-panel-account" tabindex="-1" data-testid="settings-tab-account">Account</button>
</div>
<div role="tabpanel" id="settings-panel-theme" aria-labelledby="settings-tab-theme" tabindex="0" hidden>…</div>
<div role="tabpanel" id="settings-panel-content" aria-labelledby="settings-tab-content" tabindex="0">…</div>
<div role="tabpanel" id="settings-panel-account" aria-labelledby="settings-tab-account" tabindex="0" hidden>…</div>
```

Hover, focus and active add no markup. Selection moves `aria-selected="true"`, `tabindex="0"` and the absence of `hidden` to another pair.

```html
<!-- consumer -->
<coop-tabs label="Request views" [selected]="view()" (selectedChange)="view.set($event)">
  <div slot="header" class="detail-header"><h2>{{ request.title }}</h2><coop-badge tone="warning">New</coop-badge></div>
  <coop-tab value="details" label="Details" testId="maintenance-tab-details">…detail body…</coop-tab>
  <coop-tab value="comments" label="Comments" testId="maintenance-tab-comments">…comment list and composer…</coop-tab>
</coop-tabs>

<coop-tabs id="settings" label="Settings sections" [selected]="section()" (selectedChange)="section.set($event)">
  <coop-tab value="theme" label="Theme" testId="settings-tab-theme">…theme form…</coop-tab>
  <coop-tab value="content" label="Content" testId="settings-tab-content">…</coop-tab>
  <coop-tab value="account" label="Account" testId="settings-tab-account">…</coop-tab>
</coop-tabs>
```

The classes, roles and attributes above are part of the contract: the e2e page objects locate tabs by `data-testid` and the tests assert `aria-selected`.

## Design

- Tab list: flex row, gap `--space-1`, padding-bottom `--space-2`, border-bottom `--border-width-hairline` solid `--color-border-default`, margin-bottom `--space-4`.
- Tab: padding `--space-2` `--space-4`, border 0, radius `--radius-sm`, font `--text-body-sm`, `cursor: pointer`. Height is 36 px from the line height plus padding; no explicit height.
- Colour changes are instant: the design-system page specifies no transition for tabs, and the component adds none.
- Panels: no padding or border of their own; the consumer's content sets the rhythm. `tabindex="0"` makes a panel with no focusable content reachable.
- Layer: none; the list sits in the flow of its card or page.

Component tokens: none. `.tab-btn` and `.detail-tabs` consume semantic tokens directly in `components.css`, so a surface cannot re-skin a tab; that is intended (one look in both apps).

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Selected fill | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Selected label | `--color-fg-on-accent` | `--palette-white` | `--palette-white` |
| Label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Hover fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| List rule | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Card surface behind the list | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Label on a card |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Label on the settings page |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Hovered label |
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Selected label |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a card |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |

The list rule is decorative and exempt from 1.4.11; the selected fill, not colour alone, marks the selection, and `aria-selected` carries it for assistive technology. Under `forced-colors: active` the ring becomes `Highlight` and the rule `CanvasText` (tokens.css); the selected fill is lost, so the component adds a system-colour outline to the selected tab (`[aria-selected="true"] { outline: 1px solid CanvasText }` under that media query) and relies on `aria-selected` for the state (D-12).

## Responsive behaviour

- No media rule changes tabs (design-system page). The list is the same at every width.
- The maintenance page stacks its two panes at 768 px and below (`.content-area` becomes one column, responsive foundation); the tab list then spans the detail card's full width. The settings page has no rule for its tabs.
- Two or three short labels fit on one row at 320 px: "Details" + "Comments" is about 190 px and "Theme" + "Content" + "Account" about 250 px including padding and gaps. Labels never wrap or truncate; the content rule keeps them to one word.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom every tab stays reachable and operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: each tab is 36 px tall and at least 60 px wide, above the 24 px `--target-min`, with a `--space-1` gap (accessibility foundation).

## Accessibility

### Role and pattern

[WAI-ARIA APG Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) with automatic activation: `role="tablist"` with `aria-label`; native `<button role="tab">` children with `aria-selected`, `aria-controls` and a roving `tabindex`; `role="tabpanel"` with `aria-labelledby` for each panel. The mocks render plain buttons with an `.active` class; the roles and states are a design-system requirement.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | From before the list, moves focus to the selected tab (the only tab with `tabindex="0"`); from the selected tab, moves to the selected panel (`tabindex="0"`) or its first focusable child in DOM order. |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | The reverse. |
| <kbd>→</kbd> | Moves focus to the next tab, wrapping from the last to the first, and selects it. |
| <kbd>←</kbd> | Moves focus to the previous tab, wrapping from the first to the last, and selects it. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Moves focus to the first / last tab and selects it. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates the focused tab (native button click). Already-selected tabs stay selected and emit nothing. |

### Focus

Focus lands on the native tab button, never on the host. The shared ring (`--focus-ring-width` solid `--color-focus-ring`, offset `--focus-ring-offset`) shows on `:focus-visible` on both unselected and selected tabs and must not be clipped by the card's rounded corners. Selecting a tab keeps focus on that tab; it never moves into the panel by itself. When `selected` changes from outside while a tab is focused, focus stays where it is.

### Labelling

- Each tab's accessible name is its `label` text.
- The tab list is named by `label` ("Request views"), so a screen reader announces "Request views, tab list" on entry.
- `aria-selected="true"` on exactly one tab; `aria-controls` on every tab points at an existing panel id.
- Each panel is named by its tab through `aria-labelledby`, so entering the comments panel announces "Comments, tab panel".

### Announcements

None. Selection is conveyed by `aria-selected` and by focus moving with the arrow keys; the panel content that appears is read on demand. The comments panel's own status messages belong to the page ([alert](alert.md)).

### Motion

Nothing animates; fills change instantly. `prefers-reduced-motion` changes nothing because there is no transition to shorten.

## Content and internationalisation

- Labels are one Title Case noun naming the view: "Details", "Comments", "Theme", "Content", "Account". Keep the first tab as the default view and the order stable.
- A count, when a page needs one, goes in the label text as "Comments (3)"; no mock shows one.
- Translatable inputs: `label` on `coop-tabs` and on each `coop-tab`. Data values: none.
- Long labels do not wrap; a French label about 30 % longer ("Commentaires", "Paramètres du compte") still fits in a 320 px list with two tabs, and a three-tab list stays under 300 px with one-word labels. Two-word labels are a content error, not a layout case.

## Performance

- Change detection: `OnPush`, signal inputs; the tab list is rendered from `contentChildren(CoopTabComponent)` and the selected index from one `computed`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the list has a fixed height from its padding; panels are all in the DOM, so switching never waits for a render and never shifts the list.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK (the roving tabindex and arrow handling are a few lines in the component).

## Acceptance criteria

### Rendering

- **AC-1** Given the maintenance detail with tabs "Details" and "Comments" and `selected="details"`, when it renders, then the DOM holds a `.detail-tabs[role="tablist"][aria-label="Request views"]` with two `.tab-btn[role="tab"]` buttons, the first with `aria-selected="true"`, `tabindex="0"` and `aria-controls="panel-details"`, the second with `aria-selected="false"` and `tabindex="-1"`. (L2-REQ-028)
- **AC-2** Given the "Details" tab is selected, when it renders, then its fill is `--color-accent` and its label `--color-fg-on-accent`, while the "Comments" tab has a transparent fill and a `--color-fg-muted` label. (L2-REQ-028)
- **AC-3** Given `selected="comments"`, when it renders, then the panel `#panel-comments[role="tabpanel"][aria-labelledby="tab-comments"]` has no `hidden` attribute and `#panel-details` has `hidden`, so the comment list and the "Add a comment..." composer are the only panel content visible. (L2-REQ-028)
- **AC-4** Given the settings page with tabs "Theme", "Content" and "Account" and `id="settings"`, when it renders, then the tab buttons have ids `settings-tab-theme`, `settings-tab-content` and `settings-tab-account`, each `aria-controls` names the matching `settings-panel-*`, and the "Theme" panel is the one shown. (L2-REQ-045)
- **AC-5** Given `<coop-tab value="theme" label="Theme" testId="settings-tab-theme">`, when it renders, then the tab button carries `data-testid="settings-tab-theme"`. (L2-REQ-045)
- **AC-6** Given the maintenance detail with a `[slot=header]` holding "Kitchen tap leak" and its status badge, when it renders, then the header appears after the tab list and before both panels in DOM order. (L2-REQ-028)

### States

- **AC-7** Given the unselected "Comments" tab, when it is hovered, then its fill becomes `--color-bg-subtle`; and given the selected "Details" tab, when it is hovered, then nothing changes. (L2-REQ-028)
- **AC-8** Given the "Content" tab, when it is activated by click, then it gets `aria-selected="true"` and `tabindex="0"`, "Theme" gets `aria-selected="false"` and `tabindex="-1"`, the "Content Management" panel loses `hidden`, the "Theme" panel gains it, and `selectedChange` emits `"content"` once. (L2-REQ-046)
- **AC-9** Given the "Content" tab is already selected, when it is activated again, then nothing changes and `selectedChange` does not emit. (L2-REQ-046)
- **AC-10** Given `selected` is set to `"account"` from the page, when change detection runs, then the "Account" tab and panel become selected and `selectedChange` does not emit. (L2-REQ-046)
- **AC-11** Given `selected` is `null`, when the settings tabs render, then the first tab, "Theme", is selected. (L2-REQ-045)

### Keyboard and focus

- **AC-12** Given focus is before the request tab list and "Comments" is selected, when <kbd>Tab</kbd> is pressed, then focus lands on the "Comments" tab, and a second <kbd>Tab</kbd> moves into the comments panel rather than onto the "Details" tab. (L2-REQ-028)
- **AC-13** Given focus is on the "Details" tab, when <kbd>→</kbd> is pressed, then focus moves to "Comments", it becomes selected, the comments panel is shown and `selectedChange` emits `"comments"`; and when <kbd>→</kbd> is pressed again, then focus wraps to "Details". (L2-REQ-028)
- **AC-14** Given focus is on the "Content" tab, when <kbd>Home</kbd> is pressed, then "Theme" is focused and selected; and when <kbd>End</kbd> is pressed, then "Account" is focused and selected. (L2-REQ-046)
- **AC-15** Given focus is on the "Comments" tab, when <kbd>Enter</kbd> or <kbd>Space</kbd> is pressed, then it is selected and focus stays on the tab, not in the panel. (L2-REQ-028)
- **AC-16** Given the selected "Theme" tab, when it receives keyboard focus, then a `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is visible around the accent fill and is not clipped by the card. (L2-REQ-045)

### Screen readers

- **AC-17** Given the request tabs, when a screen reader enters the list, then it announces "Request views, tab list" and the "Details" tab as "Details, tab, selected, 1 of 2". (L2-REQ-028)
- **AC-18** Given the comments panel is shown, when a screen reader reads it, then its role is tab panel and its name is "Comments". (L2-REQ-028)
- **AC-19** Given the "Theme" panel is hidden, when queried by assistive technology, then neither it nor the "Save Theme" button inside it is exposed or focusable. (L2-REQ-045)

### Theming

- **AC-20** Given any tab set, when the page sets `data-theme="dark"`, then the tabs render with the same light tokens because no dark theme is defined, and no hard-coded colour appears in their styles. (L2-REQ-046)

### Responsive

- **AC-21** Given the request tabs inside the detail card at 320 px, when measured, then both tabs sit on one row, each is at least 36 px tall, no label wraps and the page does not scroll horizontally. (L2-REQ-028)
- **AC-22** Given the three settings tabs at 320 px and 400 % zoom, when the page reflows, then all three stay on one row within the viewport and remain operable by touch and keyboard. (L2-REQ-046)

### Performance

- **AC-23** Given the settings page with its three panels, when the theme form inside the "Theme" panel changes, then the tab list does not re-render (`OnPush` with signal inputs), and selecting another tab re-renders only the list's attributes and the panels' `hidden` state. (L2-REQ-045)

## Implementation notes

- Folder `frontend/projects/components/src/lib/tabs/`: `tabs.component.ts|html|css`, `tab.component.ts|html|css` (template holds one `<ng-template>` capturing the projected panel content), `tab-selection.ts` (type alias for the `selectedChange` payload); export both from `public-api.ts`.
- `coop-tabs` queries `contentChildren(TabComponent)`, renders one button per child in the `.detail-tabs` list and one `role="tabpanel"` per child with `ngTemplateOutlet`; a `keydown` listener on the list handles the arrow, Home and End keys and calls `focus()` on the target button before updating `selected`.
- The host sets `display: block`; `coop-tab` sets `display: none` on its host.
- Ids are built from `id` + `-tab-` / `-panel-` + `value`, or `tab-` / `panel-` + `value` when `id` is null.
- No CDK primitive; composes nothing. The maintenance detail page and the settings page compose it; [badge](badge.md) sits in its header slot.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Do the settings tabs keep their own `.tab`/`.tabs` look?* No. The settings mock draws bordered 10 px-radius buttons that no other screen uses and that the design system does not document; the component renders the one documented look (`.tab-btn` in `.detail-tabs`) for both pages, and the e2e page object, which uses `data-testid`, is unaffected.
- **D-5** *Where does the maintenance detail header go?* In a `[slot=header]` rendered between the tab list and the panels. The mock places the title and status badge under the tabs and above the body on both views; one slot keeps that order without duplicating the header in each panel.
- **D-6** *Which tab is selected when `selected` is null or unknown?* The first. The content rule says the first tab is the default view, and a tab list must always have one selected tab for the roving tabindex to work.
- **D-7** *Are hidden panels removed from the DOM?* No; they get the `hidden` attribute. `aria-controls` must point at an existing element on every tab, and keeping the comments composer in the DOM preserves a half-typed comment when the admin glances at Details.
- **D-8** *How do e2e test ids reach the tab buttons?* Through a `testId` input on `coop-tab`. The existing page objects locate `settings-tab-theme` and friends by `data-testid`, and the button is rendered by `coop-tabs`, so an attribute on the consumer's `<coop-tab>` element would land on an empty host.
- **D-9** *Is there a count input?* No. The content rule puts counts in the label text ("Comments (3)") and no mock shows one; a `label` string covers it.
- **D-10** *What if labels do not fit?* They must. The design-system page rules out wrapping and scrolling and limits sets to four one-word tabs; the CRD keeps that and treats a two-word label as a content error.
- **D-11** *Is there a disabled tab?* No. No mock or design-system state shows one, and a disabled tab would need extra roving-tabindex rules.
- **D-12** *How is selection shown under forced colours?* With a `CanvasText` outline on the selected tab. Forced colours drop the accent fill, leaving `aria-selected` as the only cue; one outline rule keeps the selection visible without inventing colours.
