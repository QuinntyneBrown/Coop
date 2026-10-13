# Badge

| Field | Value |
|---|---|
| Selector | `coop-badge` |
| Library path | `frontend/projects/components/src/lib/badge/` |
| Status | planned |
| Traces to | L2-REQ-025, L2-REQ-032, L2-REQ-038, L2-REQ-044, L2-REQ-062 |
| Design system | [`badge.html`](../../design-system/components/badge.html) |
| Source mocks | [`pages/admin-maintenance/default`](../../mocks/pages/admin-maintenance/default.html), [`pages/public-maintenance/default`](../../mocks/pages/public-maintenance/default.html), [`dialogs/public-maintenance-detail/default`](../../mocks/dialogs/public-maintenance-detail/default.html), [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-users/default`](../../mocks/pages/admin-users/default.html), [`pages/admin-profiles/default`](../../mocks/pages/admin-profiles/default.html), [`pages/admin-documents/default`](../../mocks/pages/admin-documents/default.html), [`pages/admin-invitations/default`](../../mocks/pages/admin-invitations/default.html), [`pages/public-messaging/default`](../../mocks/pages/public-messaging/default.html), [`pages/admin-messaging/default`](../../mocks/pages/admin-messaging/default.html) |
| Rendering | [`badge.html`](badge.html) |

## Purpose and scope

A badge is a small read-only pill that states a status, priority or count in one word or number: the status of a maintenance request ("New", "Received", "Started", "Completed"), of a document ("Draft", "Published"), of a user or profile ("Active"), of an invitation ("Active", "Expired", "Used"), the priority of a request ("Low", "Medium", "High"), and the unread count of a conversation ("2"). Six tones carry the meaning; the text always carries it too, so colour is never the only signal.

Use something else instead when:

- the marker is the unread count on the top-bar bell: [icon button](icon-button.md) renders its own `.notification-badge` corner marker;
- the control filters a list and can be pressed: [filter chips](filter-chips.md);
- the message is a sentence about an outcome ("Theme saved successfully"): [alert](alert.md);
- the value is a number with a label on the dashboard: [metric card](metric-card.md).

Out of scope:

- Deciding which tone a status gets. The mapping table under *Variants and sizes* is the contract; each feature's view model applies it in plain TypeScript and passes a `tone` (D-4).
- Announcing a status change. The badge is not a live region; the page's status region announces outcomes ([alert](alert.md)).
- Where the badge sits. The [table](table.md) cell, [list item](list-item.md) trailing slot, [card](card.md) header and the maintenance detail's `.detail-meta` row place it.

## Usage

Every `.badge`, `.status-badge`, `.priority-badge`, `.active-badge` and `.unread-badge` in `docs/mocks` (157 uses on 57 screens) is one of the configurations below. The mocks' four extra classes are this component with a tone (D-5); the bell's `.notification-badge` belongs to the icon button.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-maintenance/*` request cards and `detail-*` panels, `dialogs/admin-maintenance-create/*` | tone by status | "New" (warning), "Received" (info), "Started" (info), "Completed" (success) | default | card |
| `pages/public-maintenance/*`, `dialogs/public-maintenance-create/*`, `dialogs/public-maintenance-detail/*` (`.status-badge.new|started|done`) | tone by status | "New", "Received", "Started", "Completed" with the same mapping (the mock draws "New" green; D-5) | default | card |
| same public screens (`.priority-badge.low|medium|high`) | tone by priority | "Low" (info), "Medium" (warning), "High" (danger) | default | card |
| `pages/admin-dashboard/*` recent requests (`.status-badge`) | tone by status | "New", "Started", "Completed" | default | card |
| `pages/admin-users/*` Status column | `tone="success"` | "Active" | default | card (table) |
| `pages/admin-profiles/*`, `pages/admin-profile/*`, `notifications/admin-profile-saved/success`, `notifications/admin-profiles-saved/success` (`.active-badge`) | `tone="success"` | "Active" on the current profile card | default | card |
| `pages/admin-documents/*` and the document dialogs, card header | `tone="success"` / `tone="warning"` | "Published" / "Draft" | default | card |
| `pages/admin-invitations/*`, `dialogs/admin-invitation-create/*`, `dialogs/admin-invitation-created/*`, Status column | success / danger / gray | "Active" / "Expired" / "Used" | default | card (table) |
| `pages/public-messaging/*`, `pages/admin-messaging/*`, `dialogs/admin-new-conversation/default` conversation list (`.unread-badge`) | `tone="info"`, `srText="unread"` | "2" | default | surface (list item) |

Every row is buildable with the API below: one size, six tones, projected text and a visually hidden suffix for counts.

## Anatomy

1. **Container** — `.badge`. Inline-flex pill: `--space-0-5` vertical and `--space-3` horizontal padding, `--radius-full`, tinted fill, `white-space: nowrap`.
2. **Label** — the projected text, `--text-caption` at `--font-weight-medium`. One Title Case word or a count. It is the whole accessible text unless a suffix follows.
3. **Hidden suffix (optional)** — `<span class="badge-sr">` holding `srText`, visually hidden with the same clip technique as `.table caption`, so a count reads as "2 unread" (D-7).

Host: `coop-badge` is `display: inline-flex` and carries no classes of its own; `.badge` and its tone class go on the inner `<span>`. The host is inline so the badge sits in a table cell, a `.detail-meta` row or a list item's trailing slot without a wrapper.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `'neutral' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'gray'` | `'neutral'` | no | Maps to `.badge-{tone}`; neutral adds no modifier (bare `.badge`). The tone is chosen by meaning per the mapping table, never by taste. |
| `srText` | `string \| null` | `null` | when the text is a count | Rendered after the visible text in a visually hidden span, preceded by a space: "2" + "unread" reads "2 unread". Not used for status words, which read as themselves. |

All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The badge is read-only and never interactive; it has no events. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | text | One Title Case word ("Completed", "Draft") or a count ("2"). No icons, no second word, no markup; the badge never wraps its label. |

Translation: the label is projected by the consumer and `srText` is an input, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Neutral | — (bare `.badge`) | The default when a value has no mapped meaning. No mock uses it on its own; it exists so an unmapped value still renders readably (D-8). |
| Success | `.badge-success` | A finished or good state: "Completed", "Published", "Active" (user, profile and invitation). |
| Info | `.badge-info` | A state in progress or a neutral fact: "Received", "Started", "Low" priority, the unread count. |
| Warning | `.badge-warning` | A state that wants attention: "New", "Draft", "Medium" priority. |
| Danger | `.badge-danger` | A failed or urgent state: "Expired", "High" priority. |
| Gray | `.badge-gray` | A spent state: "Used" invitation. |

Mapping from the product's values (the contract each view model implements, D-4):

| Value | Where | Tone |
|---|---|---|
| New | maintenance request status | warning |
| Received | maintenance request status | info |
| Started | maintenance request status | info |
| Completed | maintenance request status | success |
| Low / Medium / High | maintenance request priority | info / warning / danger |
| Draft / Published | document status | warning / success |
| Active | user status, current profile, invitation status | success |
| Expired | invitation status | danger |
| Used | invitation status | gray |
| count | unread messages in a conversation | info, with `srText="unread"` |

L2-REQ-062 names the Neutral variant "gray tones"; the design system splits that into a neutral (`--color-bg-subtle`) fill and a gray (`--color-bg-subtle-hover`) fill, both grey, and uses gray for "Used". Both satisfy AC5 (D-8).

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| Single | — | about 1.375rem (line height of `--text-caption` plus `--space-0-5` twice) | `--space-0-5` by `--space-3` | `--text-caption` at `--font-weight-medium` |

The design-system page sets one size and says not to add sizes. Width comes from the text plus padding.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Tone fill and text | Plain text, no role |
| Replaced | the value changes | The consumer re-renders with the next tone and word ("New" → "Received"); the old badge is replaced in place | Not announced (D-9) |

The badge has no hover, focus, active, disabled, busy or selected state: it is not a control. The design-system page shows the default state only.

## Markup

```html
<!-- rendered: status words -->
<span class="badge badge-warning">New</span>
<span class="badge badge-info">Received</span>
<span class="badge badge-info">Started</span>
<span class="badge badge-success">Completed</span>
```

```html
<!-- rendered: count with hidden suffix -->
<span class="badge badge-info">2<span class="badge-sr"> unread</span></span>
```

```html
<!-- rendered: neutral -->
<span class="badge">Member</span>
```

Success, info, warning, danger and gray differ only by the modifier class.

```html
<!-- consumer -->
<coop-badge [tone]="statusTone(request.status)">{{ request.status }}</coop-badge>
<coop-badge tone="danger">High</coop-badge>
<coop-badge tone="success">Published</coop-badge>
<coop-badge tone="info" srText="unread">{{ conversation.unread }}</coop-badge>
```

The classes above are part of the contract: the e2e page objects read a badge's text inside `.badge` and the tone class to check a status.

## Design

- Padding `--space-0-5` vertical, `--space-3` horizontal; `display: inline-flex` with `align-items: center`.
- Type `--text-caption` (regular 12 px) with `font-weight` raised to `--font-weight-medium`. No text transform; the word is written in Title Case by the consumer.
- Shape `--radius-full`; no border.
- `white-space: nowrap`: the label never breaks; a tight row wraps the whole badge to the next line.
- Hidden suffix `.badge-sr`: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%)`, the same recipe `components.css` uses for `.table caption` (D-7).
- Motion: none. A tone change swaps classes without transition.
- Layer: none; the badge sits in the flow of its cell, row or header.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| None | — | The block reads semantic tokens directly (`--color-success-bg`, `--color-info-bg`, `--color-warning-bg`, `--color-danger-bg`, `--color-bg-subtle`, `--color-bg-subtle-hover` and their foregrounds); surfaces do not re-skin it (D-10). |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Neutral fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Neutral text | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Success fill | `--color-success-bg` | `--palette-green-100` | `--palette-green-100` |
| Success text | `--color-success-fg` | `--palette-green-800` | `--palette-green-800` |
| Info fill | `--color-info-bg` | `--palette-blue-100` | `--palette-blue-100` |
| Info text | `--color-info-fg` | `--palette-blue-800` | `--palette-blue-800` |
| Warning fill | `--color-warning-bg` | `--palette-amber-100` | `--palette-amber-100` |
| Warning text | `--color-warning-fg` | `--palette-amber-700` | `--palette-amber-700` |
| Danger fill | `--color-danger-bg` | `--palette-red-100` | `--palette-red-100` |
| Danger text | `--color-danger-fg` | `--palette-red-800` | `--palette-red-800` |
| Gray fill | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-200` |
| Gray text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Neutral text |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | Success text |
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | Info text |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Warning text |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Danger text |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | Gray text |

The 12 px label is normal text, so 4.5:1 applies to every tone (L2-REQ-062 AC6). The fill's edge against its surface is decorative and exempt from 1.4.11 because the word carries the meaning. Under `forced-colors: active` the fills flatten to `Canvas` and the text to `CanvasText`; the word still carries the state, so nothing is lost.

## Responsive behaviour

- The mocks define no media rule for badges; the pill is the same at every width (design-system page).
- The label never wraps or truncates; a row that is too narrow wraps the whole badge to the next line. In the public maintenance detail's `.detail-meta` row, "New" and "High" fit on one line at 320 px.
- In a table cell the badge stays on one line and the table card scrolls inside itself when the viewport is narrower than the table ([table](table.md)); the page never scrolls horizontally.
- At 320 px nothing clips, and at 400 % zoom the text scales with the page (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: not a target; the badge is never interactive.

## Accessibility

### Role and pattern

Plain inline text in a `<span>`; no role and no WAI-ARIA widget pattern. The word is the meaning (WCAG 1.4.1 Use of Color); the tone only reinforces it.

### Keyboard

| Key | Action |
|---|---|
| Not applicable | The badge takes no focus and handles no keys. |

### Focus

None. The badge is never in the tab order and draws no ring.

### Labelling

- The projected text is the accessible text; status words read as themselves ("Completed").
- A count carries `srText` so it reads with its meaning: "2 unread" (list-item page). The suffix is visually hidden, not `aria-label`, so the text is also selectable and visible to find-in-page.
- The badge is placed after the item's name in reading order ("Kitchen tap leak" then "New"); in a table the column header ("Status") gives it context.

### Announcements

None. A status change replaces the badge silently; outcomes are announced by the page's status region ([alert](alert.md)) (D-9).

### Motion

None. No property transitions; `prefers-reduced-motion` changes nothing.

## Content and internationalisation

- One Title Case word: "New", "Received", "Started", "Completed", "Draft", "Published", "Active", "Expired", "Used", "Low", "Medium", "High". The same word and tone for the same state on every screen (D-5).
- Counts are digits only ("2"); the unit lives in `srText` ("unread"). No count inside a status badge.
- Translatable inputs: `srText`; the projected word is the consumer's. Data values: the count.
- A French word about 30 % longer ("Terminée", "Reçue", "Publié") widens the pill and stays on one line; nothing truncates. Scripts without case render as given; the component applies no transform.

## Performance

- Change detection: `OnPush`, signal inputs; the class list is one `computed` from `tone`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: height is fixed by the caption line height and padding, so a tone change never changes height; a word change changes width only within its row.
- Weight: imports `@angular/core` only; no CDK, no common pipes.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-badge tone="warning">New</coop-badge>` on the request card "Kitchen tap leak", when it renders, then the DOM holds `<span class="badge badge-warning">New</span>` with a `--color-warning-bg` fill, `--color-warning-fg` text at a contrast of at least 4.5:1 and `--radius-full` corners. (L2-REQ-062)
- **AC-2** Given `tone="success"` and the text "Completed", when it renders, then it has `.badge.badge-success`, a `--color-success-bg` fill and `--color-success-fg` text. (L2-REQ-062)
- **AC-3** Given `tone="danger"` and the text "Expired", when it renders, then it has `.badge.badge-danger`, a `--color-danger-bg` fill and `--color-danger-fg` text. (L2-REQ-062)
- **AC-4** Given `tone="info"` and the text "Started", when it renders, then it has `.badge.badge-info`, a `--color-info-bg` fill and `--color-info-fg` text. (L2-REQ-062)
- **AC-5** Given `tone="gray"` and the text "Used", when it renders, then it has `.badge.badge-gray`, a `--color-bg-subtle-hover` fill and `--color-fg-default` text. (L2-REQ-062)
- **AC-6** Given a badge with no `tone`, when it renders, then it has the bare `.badge` class with a `--color-bg-subtle` fill and `--color-fg-muted` text. (L2-REQ-062)
- **AC-7** Given any badge, when measured, then its padding is `--space-0-5` by `--space-3`, its font is `--text-caption` at `--font-weight-medium`, and its label is on one line. (L2-REQ-062)

### Status mapping

- **AC-8** Given the four requests "Kitchen tap leak" (New), "Hallway light" (Received), "Courtyard gate" (Started) and "Window latch" (Completed), when the admin maintenance list renders, then their badges are `.badge-warning` "New", `.badge-info` "Received", `.badge-info` "Started" and `.badge-success` "Completed". (L2-REQ-025)
- **AC-9** Given "Kitchen tap leak" shows `.badge-warning` "New", when the request is received, then the badge is replaced in place by `.badge-info` "Received" with no other class and no live announcement. (L2-REQ-025)
- **AC-10** Given the public maintenance list, whose mock draws "New" in green, when it renders with this component, then "New" is `.badge-warning` exactly as on the admin list. (L2-REQ-025)
- **AC-11** Given the priorities "High" on "Kitchen tap leak", "Medium" on "Hallway light" and "Low" on "Courtyard gate", when the public list renders, then they are `.badge-danger`, `.badge-warning` and `.badge-info` and each shows its word. (L2-REQ-062)
- **AC-12** Given the published notice "Autumn courtyard gathering" and the draft "September maintenance report", when the documents page renders, then their badges are `.badge-success` "Published" and `.badge-warning` "Draft". (L2-REQ-032)
- **AC-13** Given the invitations `fictional-invite-0` (valid), `fictional-invite-1` (expired) and `fictional-invite-2` (used), when the invitations table renders, then their Status cells are `.badge-success` "Active", `.badge-danger` "Expired" and `.badge-gray` "Used". (L2-REQ-044)

### Count

- **AC-14** Given the conversation "Courtyard gathering" with two unread messages and `<coop-badge tone="info" srText="unread">2</coop-badge>`, when it renders, then the visible text is "2", the accessible text is "2 unread", and the suffix is in a `.badge-sr` span that is 1 px square and clipped. (L2-REQ-038)
- **AC-15** Given that badge, when a third message arrives and the projected text becomes "3", then the text updates in place, the classes are unchanged and nothing is announced. (L2-REQ-038)

### Screen readers

- **AC-16** Given the users table, when the Status cell for mira.fern is read by assistive technology, then "Active" is read as plain text under the "Status" header, with no role, state or button. (L2-REQ-062)

### Theming

- **AC-17** Given any tone, when the page sets `data-theme="dark"`, then the badge renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-062)

### Responsive

- **AC-18** Given the public maintenance detail for "Kitchen tap leak" at 320 px, when `.detail-meta` is measured, then "New" and "High" sit on one line, neither label wraps or clips, and the page does not scroll horizontally. (L2-REQ-025)
- **AC-19** Given the French label "Terminée" in place of "Completed" at 320 px, when it renders, then the pill widens to fit and the word stays on one line. (L2-REQ-062)

### Performance

- **AC-20** Given the admin maintenance list with twenty badges, when one request's status changes, then only that badge re-renders (`OnPush` with signal inputs). (L2-REQ-025)

## Implementation notes

- Folder `frontend/projects/components/src/lib/badge/`: `badge.component.ts`, `badge.component.html`, `badge.component.css`, `badge-tone.ts` (type alias); export from `public-api.ts`.
- The template is one `<span class="badge" [class]="toneClass()"><ng-content></ng-content>@if (srText()) {<span class="badge-sr"> {{ srText() }}</span>}</span>`; `toneClass` returns `''` for neutral.
- `.badge-sr` lives in `badge.component.css`; the design system has no shared visually-hidden utility (D-7).
- A `statusTone(status)` style helper belongs beside each feature (maintenance, documents, invitations), not in the library; the mapping table above is what it implements (D-4).
- No CDK primitive; composes nothing. [Table](table.md), [list item](list-item.md), [card](card.md) and the maintenance detail panel compose it.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Does the badge take a status or a tone?* A tone. Which tone a maintenance status, document status or invitation state gets is a rule of that feature, and AGENTS.md keeps view-model logic in plain TypeScript beside the feature rather than in shared visual components. The mapping table in this CRD is the contract those helpers implement, so every screen agrees.
- **D-5** *What becomes of `.status-badge`, `.priority-badge`, `.active-badge` and `.unread-badge`?* All are `.badge` with a tone, as the design-system page's mapping says: `.status-badge.new` (green in the mock) becomes warning so "New" has one tone everywhere; priority "low" (indigo in the mock, a colour with no token) becomes info; `.active-badge` (11 px) becomes a 12 px success badge; `.unread-badge` (a 20 px green circle) becomes the info count badge the list-item page renders.
- **D-6** *Is the unread count a badge at all?* Yes, in the conversation list. The badge page says counts are "not mapped" and belong to the navigation and list-item components, but the list-item page renders the count as `<span class="badge badge-info">2</span>` and names this component for its trailing slot. The two pages disagree; the CRD follows the list-item page because it is the composing component, and keeps the bell's corner marker with the icon button. The badge page's "Do not put counts in a status badge" still holds: a count badge carries a count only.
- **D-7** *How does a count read with its meaning?* Through `srText`, rendered as a visually hidden suffix (the list-item page asks for "2 unread", not a bare "2"). The design system has no shared visually-hidden class, so the component owns `.badge-sr`, using the clip recipe `components.css` already applies to `.table caption`. A suffix, not `aria-label`, keeps the text selectable and findable.
- **D-8** *Is the neutral tone L2-REQ-062's "Neutral"?* Either grey fill satisfies AC5. The design system defines both a bare `.badge` (`--color-bg-subtle`) and `.badge-gray` (`--color-bg-subtle-hover`); "Used" takes gray per the mapping, and neutral is the default so an unmapped value still renders. Role names are not badges: the users table and the sidebar footer show "Member" as plain text (table page), so no role usage is specified.
- **D-9** *Is a status change announced?* No. The design-system page says the badge is not announced as a live change and status changes by replacement; the page's status region reports the outcome of the action that changed it.
- **D-10** *Does the badge declare component tokens?* No. The block reads semantic tone pairs directly and no surface re-skins a badge; declaring aliases would add tokens the design system does not define.
- **D-11** *Does the component change the word's case?* No. The mocks capitalise statuses with CSS in one place; the content foundation asks for the word to be written in Title Case instead, so the component renders the text as given.
