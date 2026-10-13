# Checkbox

| Field | Value |
|---|---|
| Selector | `coop-checkbox` |
| Library path | `frontend/projects/components/src/lib/checkbox/` |
| Status | planned |
| Traces to | L2-REQ-011, L2-REQ-061, L2-REQ-076, L2-REQ-077 |
| Design system | [`checkbox.html`](../../design-system/components/checkbox.html) |
| Source mocks | [`pages/admin-login/default`](../../mocks/pages/admin-login/default.html), [`pages/public-login/default`](../../mocks/pages/public-login/default.html), [`pages/admin-register/invalid`](../../mocks/pages/admin-register/invalid.html), [`pages/public-register/invalid`](../../mocks/pages/public-register/invalid.html), [`pages/admin-roles/default`](../../mocks/pages/admin-roles/default.html), [`pages/admin-roles/member`](../../mocks/pages/admin-roles/member.html) |
| Rendering | [`checkbox.html`](checkbox.html) |

## Purpose and scope

A checkbox records one independent yes or no choice. The product uses it in two forms: a labelled checkbox, where the text beside the box is the name and clicking either toggles it ("Remember me" on sign in, "I agree to the Terms and Conditions" on register), and a privilege toggle, a bare box in a cell of the roles privileges table whose name comes from its row and column. Both are the native `<input type="checkbox">` tinted with the accent colour; the component owns the input so it can wire the label, the error text and the form integration in one place.

Use something else instead when:

- the value is text, a date or a choice from a list: [form field](form-field.md);
- the control filters a list and stays pressed: [filter chips](filter-chips.md);
- several options are mutually exclusive: a `select` inside a [form field](form-field.md) (the product has no radio group).

Out of scope:

- Deciding when the terms error appears and what it says; the register form passes `error` after a failed submit (L2-REQ-059 validation belongs to the form and the server).
- Creating or deleting the privilege when a toggle changes; the roles page handles `checkedChange` and calls the API (L2-REQ-011).
- The `.form-group` wrapper that spaces the terms checkbox in the register field stack; the consumer applies it (a checkbox is not projected into a [form field](form-field.md) because its label sits beside, not above).
- An indeterminate state (D-6).

## Usage

Every `input[type=checkbox]` in `docs/mocks` (9 `.checkbox-label` uses on 2 screens, 5 `#terms` rows in the public register, and 24 `.privilege-toggle` uses on 4 roles screens) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-login/*`, `pages/public-login/*` | labelled, `formControlName="rememberMe"` | "Remember me" | unchecked, checked | card |
| `pages/admin-register/*` inside `.form-group.terms-group` | labelled, `formControlName="termsAccepted"`, `error` | "I agree to the Terms and Conditions"; error "You must accept the terms and conditions" | unchecked, invalid | card |
| `pages/public-register/*` (`.terms-row`, `id="terms"`) | labelled, `id="terms"`, `error` | "I agree to the Terms and Conditions"; error "You must accept the terms" | unchecked, invalid | card |
| `pages/admin-roles/default`, `member`, `no-privileges` privileges table | toggle, `label="Read privilege for User"` and so on for Write, Create, Delete × each aggregate row | no visible text | checked, unchecked | table cell on card |
| design-system states only | labelled | "Option" | focus, disabled | card |

Every row is buildable with the API below: two variants, a label from the default slot or the `label` input, `checked` two-way, `disabled`, `error`, and form integration.

## Anatomy

1. **Wrapper (labelled variant)** — `<label class="checkbox-label">`. Flex row, `align-items: center`, gap `--space-2`, `--text-body-sm`, `cursor: pointer`, `min-height` `--target-min` (D-7).
2. **Box** — `<input type="checkbox">`, 1.125rem square, `accent-color: --color-accent`. In the toggle variant it carries `.privilege-toggle` and `aria-label`.
3. **Label text (labelled variant)** — `<span>` holding the projected text; it is the accessible name.
4. **Error (optional)** — `<p class="field-error" id="{id}-error">` after the wrapper, `--text-caption`, `--color-danger-fg`.

Host: `coop-checkbox` is `display: block` in the labelled variant and `display: inline-flex` with `min-width` and `min-height` of `--target-min`, centred, in the toggle variant (D-7). It carries no classes; `.checkbox-label`, `.privilege-toggle` and `.field-error` go on the inner elements.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `'labelled' \| 'toggle'` | `'labelled'` | no | `labelled` wraps the box and text in `.checkbox-label`; `toggle` renders the bare box with `.privilege-toggle` and no wrapper. |
| `checked` | `boolean` (model) | `false` | no | Two-way (`[(checked)]`). Reflects the native `checked` property; updated when the person toggles. |
| `label` | `string \| null` | `null` | toggle: yes | Toggle: the accessible name, rendered as `aria-label` ("Read privilege for User"). Labelled: ignored when text is projected; used as the visible text when nothing is projected. |
| `id` | `string \| null` | `null` | no | The input's id; `coop-checkbox-{n}` when null. The error id derives from it. |
| `name` | `string \| null` | `null` | no | Native `name` on the input for template-driven forms (`acceptTerms`). |
| `disabled` | `boolean` | `false` | no | Native `disabled`; also set by reactive forms through `setDisabledState`. |
| `required` | `boolean` | `false` | no | Sets `aria-required="true"` (the terms checkbox). No visible marker, as in [form field](form-field.md) D-6. |
| `error` | `string \| null` | `null` | no | Non-empty: renders `.field-error`, sets `aria-invalid="true"` and `aria-describedby="{id}-error"`. Empty or null: removes all three. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs; `checked` is a `model()`.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `checkedChange` | `boolean` | The person toggles the box (native `change`), with the new value. Not emitted when `checked` is set programmatically or by the form. |

The component implements `ControlValueAccessor`, so `formControlName="rememberMe"` and `formControlName="termsAccepted"` bind to it directly (D-5).

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | text, optionally with inline markup | The visible label of the labelled variant, projected into the `<span>`. Ignored in the toggle variant. |

Translation: the label is projected or passed as `label`, and `error` is an input, so the component holds no copy (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Labelled | `.checkbox-label` wrapper | A choice with words beside it: "Remember me", "I agree to the Terms and Conditions". The default. |
| Toggle | `.privilege-toggle` on the input | A cell in the privileges table, named by its row and column: "Read privilege for User". |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| single | — | box 1.125rem; labelled row `min-height` `--target-min`; toggle host `--target-min` square | — | `--text-body-sm` |

Width: the labelled variant is as wide as its container and the text wraps; the toggle is `--target-min` wide.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Unchecked | — | Empty native box with the browser's border, 1.125rem | Checked = false |
| Checked | `checked` | Native tick on an `--color-accent` fill | Checked = true |
| Hover | `:hover` | `cursor: pointer` on box and label; no colour change | — |
| Focus | `:focus-visible` on the input | Shared ring: `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` around the box | — |
| Invalid | `error` non-empty → `aria-invalid="true"` | `.field-error` text below in `--color-danger-fg`; the box itself does not change colour | Invalid = true; description = error text |
| Disabled | `disabled` | The browser dims the box; the label text keeps `--color-fg-default` and the row shows `cursor: not-allowed` | Not focusable; exposed as disabled |

Every state applies to both variants; the toggle shows no error state because the roles page has no validation.

## Markup

```html
<!-- rendered: labelled, unchecked -->
<coop-checkbox>
  <label class="checkbox-label"><input type="checkbox" id="rememberMe" name="rememberMe"><span>Remember me</span></label>
</coop-checkbox>
```

```html
<!-- rendered: labelled, invalid -->
<coop-checkbox>
  <label class="checkbox-label"><input type="checkbox" id="terms" aria-required="true" aria-invalid="true" aria-describedby="terms-error"><span>I agree to the Terms and Conditions</span></label>
  <p class="field-error" id="terms-error">You must accept the terms and conditions</p>
</coop-checkbox>
```

```html
<!-- rendered: toggle, checked -->
<coop-checkbox>
  <input class="privilege-toggle" type="checkbox" id="coop-checkbox-7" checked aria-label="Read privilege for User">
</coop-checkbox>
```

Checked and disabled differ only by the native attribute on the input.

```html
<!-- consumer -->
<coop-checkbox formControlName="rememberMe">Remember me</coop-checkbox>
<div class="form-group">
  <coop-checkbox formControlName="termsAccepted" required [error]="termsError()">I agree to the Terms and Conditions</coop-checkbox>
</div>
<td><coop-checkbox variant="toggle" [label]="'Read privilege for ' + row.aggregate" [checked]="row.read" (checkedChange)="setPrivilege(row, 'Read', $event)"></coop-checkbox></td>
```

The classes and attributes above are part of the contract: the e2e page objects locate checkboxes by `.checkbox-label`, `.privilege-toggle`, their accessible names and `checked`.

## Design

- Box 1.125rem square, `accent-color: --color-accent`; the browser draws the border, tick and disabled dimming.
- Labelled row: gap `--space-2`, `--text-body-sm`, `min-height` `--target-min`; text wraps under itself, not under the box (`align-items: center` with the box `flex-shrink: 0`).
- Toggle host: `--target-min` square hit area with the box centred (D-7); the table cell's padding adds to it.
- Error: `--space-1` above, `--text-caption`, `--color-danger-fg`.
- Motion: none; the native tick has no transition.
- Layer: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| none | — | The block reads `--color-accent`, `--color-focus-ring`, `--target-min`, `--space-2` and `--text-body-sm` directly (design-system tokens table). |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Checked fill | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Label text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Error text | `--color-danger-fg` | `--palette-red-800` | `--palette-red-800` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |
| Surface | `--color-bg-surface` | `--palette-white` | `--palette-white` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label text on a card |
| `--color-accent` | `--color-bg-surface` | 3:1 | Checked box on a card |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Checked box on the page |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Error text |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a card |

The unchecked box's border is drawn by the browser from `accent-color` and `color-scheme: light`; the tick on the checked fill is white, which is the same pair as `--color-fg-on-accent` on `--color-accent` (4.5:1 and above). Disabled boxes are exempt from contrast. Under `forced-colors: active` the browser draws the box in system colours and the ring becomes `Highlight`.

## Responsive behaviour

- The mocks define no media rule for the checkbox; the box stays 1.125rem at every width (design-system page).
- The labelled text wraps onto further lines under itself; "I agree to the Terms and Conditions" takes two lines at 320 px inside the register card and the box stays centred on the first line's row height, never shrinking.
- The privileges table scrolls inside its own container on narrow screens (accessibility foundation: wide tables scroll within their container); the toggle keeps its `--target-min` hit area in every cell.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom every box stays reachable and operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: the labelled row is at least 24 px tall and as wide as its text, so the whole row is the target; the toggle's host is 24 × 24 px and the cell padding extends it (WCAG 2.2 2.5.8).

## Accessibility

### Role and pattern

Native `<input type="checkbox">`: the [WAI-ARIA APG Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) with built-in semantics; no ARIA role is added.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the box in DOM order. Disabled boxes are skipped. |
| <kbd>Space</kbd> | Toggles the checked state (native). |
| <kbd>Enter</kbd> | Submits the enclosing form when the box is inside one (native). |

### Focus

Focus lands on the native input, never on the host, the label or the error. The shared ring shows on `:focus-visible` around the box; the mocks gave the box no custom ring and the design system adds the shared one. Showing or clearing `error` never moves focus. In the privileges table, focus moves cell by cell with <kbd>Tab</kbd>; the page does not add arrow-key navigation.

### Labelling

- Labelled: the wrapping `<label>` names the input with the projected text; clicking the text toggles the box. The name is exactly the visible text ("Remember me").
- Toggle: `aria-label` from `label`, in the form "{Access right} privilege for {aggregate}": "Read privilege for User", "Delete privilege for Maintenance Request". The role is the panel's heading and is not repeated (D-8). A test id is never the name.
- `aria-invalid="true"` and `aria-describedby="{id}-error"` only while `error` is non-empty; `aria-required="true"` only while `required`.

### Announcements

None by the checkbox. The native state change is announced by the browser; the roles page announces the result of saving a privilege through its own status region ([alert](alert.md)).

### Motion

None. Nothing transitions or animates, so `prefers-reduced-motion` changes nothing.

## Content and internationalisation

- Labels are positive sentence-case statements: "Remember me", "I agree to the Terms and Conditions" (the proper noun keeps its capitals). Never "Don't remember me".
- Toggle names follow "{Access right} privilege for {aggregate}" with the access rights Read, Write, Create, Delete (L2-REQ-011 AC1).
- Errors follow the content foundation's choice formula: "You must accept the terms and conditions" (recommended wording; the public mock's "You must accept the terms" is the same rule).
- Translatable inputs: `label`, `error`; the projected label is the consumer's. Data values: the aggregate name in a toggle label.
- A French label about 30 % longer ("J'accepte les conditions générales d'utilisation") wraps under itself at 320 px; a translated toggle name is never visible and has no length limit.

## Performance

- Change detection: `OnPush`, signal inputs, `checked` as a `model`; the `aria-describedby` value is a `computed`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the box has a fixed size and the row a fixed minimum height, so toggling never shifts layout; showing an error adds one caption line below, which is the forms pattern's intended behaviour.
- Weight: imports `@angular/core`, `@angular/common` and `@angular/forms` (for `NG_VALUE_ACCESSOR` only); no CDK.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-checkbox>Remember me</coop-checkbox>`, when it renders, then the DOM holds `<label class="checkbox-label"><input type="checkbox" id="…"><span>Remember me</span></label>`, the box is 1.125rem square and the text is `--text-body-sm` with `--space-2` between them. (L2-REQ-076)
- **AC-2** Given `variant="toggle"` with `label="Read privilege for User"`, when it renders, then the DOM holds a bare `<input class="privilege-toggle" type="checkbox" aria-label="Read privilege for User">` with no wrapping label. (L2-REQ-011)
- **AC-3** Given the register card's terms checkbox with `error="You must accept the terms and conditions"`, when it renders, then a `<p class="field-error">` with that text follows the label and the input has `aria-invalid="true"` and `aria-describedby` naming it. (L2-REQ-077)
- **AC-4** Given a checked "Remember me" checkbox, when it renders, then the box is filled with `--color-accent` (the green accent) and shows the native tick. (L2-REQ-061)
- **AC-5** Given an unchecked "Remember me" checkbox, when it renders, then the box is empty with no accent fill and the label text is unchanged. (L2-REQ-061)

### States

- **AC-6** Given an unchecked "Remember me" checkbox, when the person clicks the text "Remember me", then the box becomes checked and `checkedChange` emits `true` once. (L2-REQ-076)
- **AC-7** Given a checked toggle "Write privilege for User", when the person clicks it, then it becomes unchecked and `checkedChange` emits `false` so the page can delete that privilege. (L2-REQ-011)
- **AC-8** Given `[checked]="true"` is set by the roles page after loading privileges, when it renders, then the box is checked and `checkedChange` does not emit. (L2-REQ-011)
- **AC-9** Given the terms checkbox with `error` set, when the person checks the box and the form clears `error`, then the error element is removed and `aria-invalid` and `aria-describedby` leave the input. (L2-REQ-077)
- **AC-10** Given `disabled`, when it renders, then the native `disabled` attribute is present, clicking the label changes nothing and <kbd>Tab</kbd> skips it. (L2-REQ-061)
- **AC-11** Given `<coop-checkbox formControlName="rememberMe">` in a reactive form, when the person checks it, then the form control's value becomes `true`, and when the form calls `disable()` the input gains `disabled`. (L2-REQ-076)

### Keyboard and focus

- **AC-12** Given focus on the terms checkbox, when the person presses <kbd>Space</kbd>, then it toggles and `checkedChange` emits the new value. (L2-REQ-077)
- **AC-13** Given the "Remember me" box receives keyboard focus, when measured, then a `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is visible around the box and unclipped by the card. (L2-REQ-076)

### Screen readers

- **AC-14** Given a "Remember me" checkbox, when queried by assistive technology, then its role is checkbox, its name is exactly "Remember me" and it reports its checked state. (L2-REQ-076)
- **AC-15** Given the toggle in the Delete column of the Maintenance Request row, when queried by assistive technology, then its name is "Delete privilege for Maintenance Request" and never a test id. (L2-REQ-011)
- **AC-16** Given the terms checkbox with `required` and `error="You must accept the terms"`, when queried by assistive technology, then it is required, invalid and described by "You must accept the terms". (L2-REQ-077)

### Theming

- **AC-17** Given either variant, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-061)

### Responsive

- **AC-18** Given the terms checkbox inside the register card at 320 px, when measured, then the text wraps onto a second line under itself, the box keeps 1.125rem, and nothing scrolls horizontally. (L2-REQ-077)
- **AC-19** Given a privilege toggle in the roles table on a touch device, when its hit area is measured, then it is at least 24 × 24 CSS px (`--target-min`) before the cell's padding is counted. (L2-REQ-011)
- **AC-20** Given the "Remember me" row, when measured, then it is at least 24 px tall and a tap anywhere on the text toggles the box. (L2-REQ-076)

### Performance

- **AC-21** Given the privileges table with twenty toggles, when one toggle's `checked` input changes, then only that checkbox re-renders (`OnPush` with signal inputs). (L2-REQ-011)

## Implementation notes

- Folder `frontend/projects/components/src/lib/checkbox/`: `checkbox.component.ts`, `checkbox.component.html`, `checkbox.component.css`, `checkbox-variant.ts` (type alias); export from `public-api.ts`.
- `providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CheckboxComponent, multi: true }]`; `writeValue` sets `checked` without emitting, `registerOnChange` is called from the native `change` handler together with `checked.set(…)`, `setDisabledState` feeds a private disabled signal merged with the `disabled` input.
- The template branches on `variant()`; the `<input>` and its bindings live in one `<ng-template>` rendered inside or outside the `<label>`, and the one `<ng-content>` sits in the labelled branch's `<span>`.
- Host display: `:host { display: block; }` plus a host binding `[style.display]` that switches to `inline-flex` (with the `--target-min` square from the stylesheet's `:host.toggle` rule and a `[class.toggle]` host binding) when `variant()` is `'toggle'`.
- The id counter is a module-level variable; a consumer-supplied `id` wins.
- No CDK primitive. Composes nothing; the login and register pages and the [table](table.md) on the roles page compose it.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Does the component own the input or project it?* Owns it. The labelled variant must place the input inside its `<label>` and the toggle must add `.privilege-toggle` and `aria-label` to it; projecting the input would need a second directive to reach those attributes. [Form field](form-field.md) projects because its control sits beside the label, not inside it.
- **D-5** *How do reactive forms bind?* Through `ControlValueAccessor`, so the mocks' `formControlName="rememberMe"` and `"termsAccepted"` work on the host unchanged; `[(checked)]` and `checkedChange` serve the roles table, which has no form.
- **D-6** *Is there an indeterminate state?* No. No mock needs one and the design-system page says it is not implemented.
- **D-7** *How does the toggle reach the 24 px target?* The toggle host is a `--target-min` square with the 1.125rem box centred, and the labelled row has `min-height: --target-min`. The design-system page states the box meets 24 px only through its label and sets "at least 24px of target" as a requirement for toggles; a larger box would change the extracted look, a padded host does not.
- **D-8** *What is the toggle's name?* "{Access right} privilege for {aggregate}", for example "Read privilege for User". The design-system example says "Read privilege for Board member", but in the roles mock the table's rows are aggregates and the role is the selected item in the panel heading, so row and column are access right and aggregate; repeating the role in every cell would make twenty long names.
- **D-9** *Is the projected text wrapped in a `<span>`?* Yes. The mocks wrap it, the design system's bare text node has the same look, and a `<span>` gives `ng-content` an element to project into.
- **D-10** *Does the box change colour when invalid?* No. The design system and the mocks colour only the error text; the box keeps its native look and `aria-invalid` carries the state, so colour is never the only signal.
