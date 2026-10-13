# Form field

| Field | Value |
|---|---|
| Selector | `coop-form-field` (wrapper) and the `coopInput` attribute directive on the projected `input`, `select` or `textarea` |
| Library path | `frontend/projects/components/src/lib/form-field/` |
| Status | planned |
| Traces to | L2-REQ-004, L2-REQ-014, L2-REQ-021, L2-REQ-040, L2-REQ-043, L2-REQ-059, L2-REQ-061, L2-REQ-075, L2-REQ-076, L2-REQ-077 |
| Design system | [`form-field.html`](../../design-system/components/form-field.html) |
| Source mocks | [`pages/public-login/default`](../../mocks/pages/public-login/default.html), [`pages/admin-login/invalid`](../../mocks/pages/admin-login/invalid.html), [`pages/public-register/invalid`](../../mocks/pages/public-register/invalid.html), [`pages/admin-change-password/invalid`](../../mocks/pages/admin-change-password/invalid.html), [`pages/admin-profile/edit`](../../mocks/pages/admin-profile/edit.html), [`pages/admin-profile/invalid`](../../mocks/pages/admin-profile/invalid.html), [`pages/public-onboarding/profile`](../../mocks/pages/public-onboarding/profile.html), [`pages/admin-settings/default`](../../mocks/pages/admin-settings/default.html), [`dialogs/admin-user-create/invalid`](../../mocks/dialogs/admin-user-create/invalid.html), [`dialogs/admin-invitation-create/default`](../../mocks/dialogs/admin-invitation-create/default.html), [`dialogs/admin-document-create/default`](../../mocks/dialogs/admin-document-create/default.html), [`dialogs/public-maintenance-create/invalid`](../../mocks/dialogs/public-maintenance-create/invalid.html), [`dialogs/admin-maintenance-create/default`](../../mocks/dialogs/admin-maintenance-create/default.html) |
| Rendering | [`form-field.html`](form-field.html) |

## Purpose and scope

A form field is one labelled value in a form: a visible label above a full-width native control, with an optional hint under the control and an error message when the value is wrong. Every form in the product (sign in, create account, forgot password, change password, onboarding, profile edit, settings, and the create dialogs for users, invitations, documents and maintenance requests) is a stack of form fields followed by a button row ([forms pattern](../../design-system/patterns/forms.html)). The consumer projects the native control, so reactive-forms directives (`formControlName`), `type`, `placeholder`, `autocomplete`, `disabled` and `readonly` stay on the element the consumer owns; the component supplies the label, the hint, the error and the ARIA wiring between them.

Use something else instead when:

- the value is a yes or no choice with its label beside the box: [checkbox](checkbox.md);
- the control filters a list as the person types and has no visible label: [search bar](search-bar.md);
- the control is a message composer or comment row ("Type a message...", "Add a comment..."): those bare inputs belong to the messaging and maintenance-detail screens and are not form fields.

Out of scope:

- Validation rules, when an error appears (after the field is touched or after a failed submit) and what it says. The form decides and passes `error`; the component only shows it. The server stays authoritative (L2-REQ-059).
- The form-level request error above the button row ([alert](alert.md)), the busy submit button ([button](button.md)), and moving focus to the first invalid field after a failed submit (the form does it through its own template reference to the control).
- The dashed photo drop zone (`.upload-area`) drawn around the file input in the public maintenance dialog and onboarding. It is a stub in the mocks; the form field renders the native file input only.
- The `.form-row` layout wrapper is a design-system layout class the consumer applies; this CRD only specifies how a form field behaves inside it.

## Usage

Every `.form-group` in `docs/mocks` (172 uses on 22 screens, plus 5 `.form-group.terms-group` wrappers that hold a [checkbox](checkbox.md)) is one of the configurations below. Field errors in the mocks are `.error-message` inside the group; the design system names them `.field-error`.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/public-login/*`, `pages/admin-login/*` | text; password | "Username" with placeholder "Enter your username", "Password" with "Enter your password"; value "mira.fern" | default, filled, invalid "Username is required" / "Password is required" | card |
| `pages/public-register/*`, `pages/admin-register/*` | text; text; password; password | "Invitation Token" ("Enter your invitation token"), "Username" ("Choose a username"), "Password" ("Create a password"), "Confirm Password" ("Confirm your password") | default, filled, invalid "Invitation token is required", "Username is required", "Password is required", "Please confirm your password", "Passwords do not match" | card |
| `pages/public-forgot-password/default`, `pages/admin-forgot-password/default` | text | "Username or Email" ("Enter your username or email") / "Username" | default, invalid | card |
| `pages/admin-change-password/*` | password; password with hint; password | "Current Password", "New Password" with hint "Password must be at least 8 characters long", "Confirm New Password"; fixture values while submitting | default, filled, invalid "Current password is required", "New password is required", "Please confirm your new password", "Passwords do not match" | card |
| `pages/public-profile/password*`, `pages/admin-profile/password` | password ×3 | "Current Password", "New Password", "Confirm New Password" | default, invalid "New passwords do not match" | card |
| `pages/admin-profile/*`, `pages/admin-profiles/*` edit, `pages/admin-onboarding/profile` | `.form-row` of two text fields; text; text | "First Name" + "Last Name" side by side, "Phone", "Board Title"; values "Mira", "Fern", "555-0101" | default, filled, invalid "First name is required", "Last name is required" | card |
| `pages/public-onboarding/profile`, `pages/admin-onboarding/profile` | text; text; tel; email | "First Name" ("First name"), "Last Name" ("Last name"), "Phone (optional)" (`type="tel"`, "555-0100"), "Email" (`type="email"`) | default | card |
| `dialogs/admin-user-create/*`, `dialogs/admin-user-edit/default` | text; select; password | "Username" (edit value "mira.fern"), "Role" with Member / Board Member / Admin, "Password" | default, filled, invalid (mocks show the red border only; this CRD requires "Username is required", "Password is required") | dialog |
| `dialogs/admin-invitation-create/default` | select; date | "Type" with Member / Board Member / Staff, "Expires" holding an ISO value | default | dialog |
| `dialogs/admin-document-create/default` | text; select; textarea; select | "Title", "Type" with Notice / By-Law / Report, "Content", "Status" with Draft / Published | default | dialog |
| `dialogs/public-maintenance-create/*` | text; textarea; select; select; file | "Title" ("Brief title for your request"), "Description" ("Describe the issue in detail"), "Priority" with Low / Medium / High / Urgent, "Category" with General / Plumbing / Electrical / HVAC / Structural / Appliance / Other, "Photo (optional)" (`accept="image/*"`) | default, invalid (mocks show the border only; this CRD requires "Title is required", "Description is required") | dialog |
| `dialogs/admin-maintenance-create/*` | text; textarea; select; select; file | "Title", "Description", "Priority", "Category" with "Select category" first, "Photos" (`multiple accept="image/*"`) | default, invalid | dialog |
| `dialogs/admin-new-conversation/default` | text | "Recipient" | default | dialog |
| `pages/admin-settings/*` | select; text ×4 | "Scope" with Global / Default; "Primary Color", "Accent Color", "Background Color", "Text Color" holding colour strings | default, filled | card |
| design-system states only | text | "Name" with value "Mira Fern" | disabled, read-only | card |

Every row is buildable with the API below: one label, one projected control of any native type, an optional hint, an optional error, the `(optional)` marker, and the `.form-row` wrapper for the name pair.

## Anatomy

1. **Group** — `.form-group`, on the host. Block, `margin-bottom: --space-4`, left-aligned text.
2. **Label** — `<label for>` as the first child. `--text-label`, `--color-fg-muted`, `margin-bottom: --space-2`. Its text is the `label` input, followed by the `optionalText` when `optional` is set.
3. **Control** — the projected native `input`, `select` or `textarea` carrying `coopInput`. Full width, `min-height` 2.5rem (textarea 6.25rem, vertical resize), `--radius-sm`, hairline `--field-border` border, `--text-body-sm`.
4. **Hint (optional)** — `<p class="form-hint" id="{id}-hint">` after the control. `--text-caption`, `--color-fg-muted`. The mocks' `.password-hint` is the same rule.
5. **Error (optional)** — `<p class="field-error" id="{id}-error">` last. `--text-caption`, `--color-danger-fg`. Present only while `error` is non-empty.

Host: `coop-form-field` is `display: block` and carries the `.form-group` class itself (D-4), so `.form-row > .form-group` and the design-system descendant rules (`.form-group label`, `.form-group input`) apply unchanged. No inner wrapper element exists.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The visible label text. Rendered inside `<label for="{id}">`; never a placeholder. |
| `hint` | `string \| null` | `null` | no | Rendered as `.form-hint` with id `{id}-hint` and joined into the control's `aria-describedby`. Stays visible while an error shows. |
| `error` | `string \| null` | `null` | no | Non-empty: renders `.field-error` with id `{id}-error`, sets `aria-invalid="true"` on the control and puts `{id}-error` first in `aria-describedby`. Empty or null: removes all three. |
| `required` | `boolean` | `false` | no | Sets `aria-required="true"` on the control. No visible marker: forms use `novalidate` and most fields are required, so only optional ones are marked (D-6). |
| `optional` | `boolean` | `false` | no | Appends a space and `optionalText` to the label: "Phone (optional)". |
| `optionalText` | `string` | `'(optional)'` | no | The marker text. The one default string the component holds; consumers translate it by setting it. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

The `coopInput` directive has no inputs of its own. It reads the element's `id` and, when the element has none, assigns `coop-field-{n}` from a module-level counter (D-5). The label's `for`, the hint id and the error id derive from that id.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | Value, focus and change events belong to the projected control; the consumer binds them there or through reactive forms. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | exactly one `input[coopInput]`, `select[coopInput]` or `textarea[coopInput]`, with its `<option>` children when a select | The control. Any native `type` is allowed: text, password, tel, email, date, file, number. A checkbox is not projected here ([checkbox](checkbox.md)). Projecting nothing or two controls is a development-mode error. |

Translation: `label`, `hint`, `error` and `optionalText` are inputs; placeholders, option text and values live on the projected control, so the component holds no copy other than the overridable `optionalText` default (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

Variants are the projected control type; the wrapper is the same for all of them.

| Variant | Modifier | Use for |
|---|---|---|
| Text | `input[type=text]` (also `tel`, `email`) | Names, usernames, tokens, phone, colour strings: "Username", "First Name", "Phone (optional)", "Primary Color". |
| Password | `input[type=password]` | Credentials: "Password", "Current Password", "Confirm New Password". Paste and password managers stay allowed. |
| Select | `select` | A closed list: "Role", "Type", "Priority", "Category", "Status", "Scope". The native chevron is the indicator (D-7). |
| Textarea | `textarea` | Long text: "Description", "Content". |
| Date | `input[type=date]` | "Expires"; the value is ISO (2026-10-13), the browser renders the picker. |
| File | `input[type=file]` | "Photo (optional)", "Photos" (`multiple`). Native rendering; no drop zone. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| single | — | `min-height` 2.5rem; textarea 6.25rem | `--space-2` `--space-4` | `--text-body-sm` |

Width is always 100 % of the group; the group is as wide as its container, or an equal share of a `.form-row`.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--field-border` = `--color-border-strong` hairline on `--color-bg-surface`; placeholder in `--color-fg-subtle` | Name = label; description = hint if any |
| Filled | value set | Text in `--color-fg-default` | Value reported natively |
| Focus | `:focus` on the control | Border becomes `--color-accent` over `--duration-base`; on `:focus-visible` the shared ring (`--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset`) is added, never substituted | — |
| Invalid | `error` non-empty → `aria-invalid="true"` | Border `--color-danger-solid`; `.field-error` text below in `--color-danger-fg`; label colour unchanged | Invalid = true; description starts with the error text |
| Disabled | `disabled` on the control | Background `--color-bg-subtle`, text `--color-fg-disabled`, `cursor: not-allowed` | Not focusable; exposed as disabled |
| Read-only | `readonly` on the control | Background `--color-bg-subtle`, text keeps `--color-fg-default` | Focusable; exposed as read-only |
| With hint | `hint` set | `.form-hint` under the control | Description includes the hint |
| In a row | parent `.form-row` | Equal share of the row above `--layout-breakpoint-sm`; full width below it (D-8) | — |

A submitting form disables its button, not its fields (forms pattern); the component has no busy state.

## Markup

```html
<!-- rendered: text field with placeholder -->
<coop-form-field class="form-group">
  <label for="username">Username</label>
  <input id="username" type="text" placeholder="Enter your username" autocomplete="username">
</coop-form-field>
```

```html
<!-- rendered: password with a hint -->
<coop-form-field class="form-group">
  <label for="newPassword">New Password</label>
  <input id="newPassword" type="password" autocomplete="new-password" aria-describedby="newPassword-hint">
  <p class="form-hint" id="newPassword-hint">Password must be at least 8 characters long</p>
</coop-form-field>
```

```html
<!-- rendered: invalid, with hint and error -->
<coop-form-field class="form-group">
  <label for="currentPassword">Current Password</label>
  <input id="currentPassword" type="password" aria-invalid="true" aria-describedby="currentPassword-error currentPassword-hint" aria-required="true">
  <p class="form-hint" id="currentPassword-hint">Enter the password you sign in with</p>
  <p class="field-error" id="currentPassword-error">Current password is required</p>
</coop-form-field>
```

```html
<!-- rendered: select, textarea, date, file -->
<coop-form-field class="form-group">
  <label for="role">Role</label>
  <select id="role"><option value="Member">Member</option><option value="BoardMember">Board Member</option><option value="Admin">Admin</option></select>
</coop-form-field>
<coop-form-field class="form-group">
  <label for="description">Description</label>
  <textarea id="description" placeholder="Describe the issue in detail"></textarea>
</coop-form-field>
<coop-form-field class="form-group">
  <label for="expires">Expires (optional)</label>
  <input id="expires" type="date" value="2026-10-13">
</coop-form-field>
<coop-form-field class="form-group">
  <label for="photos">Photos</label>
  <input id="photos" type="file" multiple accept="image/*">
</coop-form-field>
```

```html
<!-- rendered: two fields in a row -->
<div class="form-row">
  <coop-form-field class="form-group">
    <label for="firstName">First Name</label>
    <input id="firstName" type="text" value="Mira" autocomplete="given-name">
  </coop-form-field>
  <coop-form-field class="form-group">
    <label for="lastName">Last Name</label>
    <input id="lastName" type="text" value="Fern" autocomplete="family-name">
  </coop-form-field>
</div>
```

Disabled and read-only differ only by the native attribute on the control. The `coopInput` attribute is a directive selector and leaves no trace in the rendered DOM other than the ids and ARIA attributes it manages.

```html
<!-- consumer -->
<coop-form-field label="Username" [error]="usernameError()">
  <input coopInput id="username" type="text" formControlName="username" placeholder="Enter your username" autocomplete="username">
</coop-form-field>
<coop-form-field label="New Password" hint="Password must be at least 8 characters long" [error]="newPasswordError()" required>
  <input coopInput type="password" formControlName="newPassword" autocomplete="new-password">
</coop-form-field>
<coop-form-field label="Role">
  <select coopInput formControlName="role">
    <option value="Member">Member</option><option value="BoardMember">Board Member</option><option value="Admin">Admin</option>
  </select>
</coop-form-field>
<coop-form-field label="Phone" optional>
  <input coopInput type="tel" formControlName="phone" placeholder="555-0100" autocomplete="tel">
</coop-form-field>
<div class="form-row">
  <coop-form-field label="First Name" [error]="firstNameError()"><input coopInput formControlName="firstName" autocomplete="given-name"></coop-form-field>
  <coop-form-field label="Last Name" [error]="lastNameError()"><input coopInput formControlName="lastName" autocomplete="family-name"></coop-form-field>
</div>
```

The classes and attributes above are part of the contract: the e2e page objects locate fields by `.form-group`, the `label` text, `aria-invalid` and `.field-error`.

## Design

- Group spacing `--space-4` below each group; `--space-2` between label and control; `--space-1` above hint and error.
- Label `--text-label` (medium, `--font-size-sm`) in `--color-fg-muted`; control text `--text-body-sm` in `--color-fg-default`; hint and error `--text-caption`. Source copy is Title Case for labels and sentence case for hints, errors and placeholders; the CSS applies no transform.
- Control: `width: 100%`, `min-height` 2.5rem, padding `--space-2` `--space-4`, border `--border-width-hairline` solid `--field-border`, radius `--radius-sm`, background `--color-bg-surface`. Textarea `min-height` 6.25rem, `resize: vertical`.
- Transition: `border-color` over `--duration-base` with `--ease-standard`. Nothing moves.
- Row: `.form-row` is `display: flex; gap: --space-4`; each child group `flex: 1 1 0`. Below `--layout-breakpoint-sm` the row becomes a column with no gap (the groups keep their own `--space-4` bottom margin) (D-8).
- Layer: none; fields sit in the flow of their card or dialog.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--field-border` | `--color-border-strong` | `:focus` (`--color-accent`), `aria-invalid="true"` (`--color-danger-solid`) |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Control text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Placeholder | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-500` |
| Control fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Border | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-500` |
| Border, focus | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Border, invalid | `--color-danger-solid` | `--palette-red-600` | `--palette-red-600` |
| Error text | `--color-danger-fg` | `--palette-red-800` | `--palette-red-800` |
| Hint text | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Disabled and read-only fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Disabled text | `--color-fg-disabled` | `--palette-gray-400` | `--palette-gray-400` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Label and hint on a card or dialog |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Label and hint on the page |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Typed text |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Typed text in a read-only field |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Placeholder |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Error text |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Field border on a card |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Field border on the page |
| `--color-accent` | `--color-bg-surface` | 3:1 | Focused border |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid border |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a card |

Disabled text is exempt from contrast (WCAG 1.4.3) but the state is also carried by the native attribute. Under `forced-colors: active` the border and ring take `CanvasText` and `Highlight` from tokens.css; the component adds no colour of its own.

## Responsive behaviour

- The mocks define no media rule for the field itself; label, control, hint and error stack at every width and the control is always 100 % wide (design-system page).
- `.form-row` keeps its two groups side by side at `--layout-breakpoint-sm` (640 px) and above, and stacks them below it (D-8). The mocks never stack it; at 320 px two side-by-side name fields would be about 130 px wide each, so the CRD requires the stack.
- Labels, hints and errors wrap; nothing truncates. "Please confirm your new password" wraps to two lines at 320 px without clipping.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom every field stays reachable and operable (AGENTS.md reflow rule; WCAG 1.4.10). Dialogs shrink to the viewport minus the overlay padding and the field follows.
- Targets: controls are at least 40 px tall (2.5rem), above the 24 px `--target-min`; the label is a 1.5-line target above the control and clicking it focuses the control.

## Accessibility

### Role and pattern

Native `input`, `select` and `textarea` with a native `<label for>`; no ARIA role. Errors follow the WAI technique of `aria-invalid` plus `aria-describedby` ([WAI tutorial: user notifications in forms](https://www.w3.org/WAI/tutorials/forms/notifications/)).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves between controls in DOM order. Disabled controls are skipped; read-only ones are not. |
| <kbd>Enter</kbd> | Submits the enclosing form from a single-line input (native). |
| <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd>, <kbd>Space</kbd> | Changes or opens a focused select (native). |
| Typing | Edits the value; a textarea takes <kbd>Enter</kbd> as a newline. |

### Focus

Focus lands on the native control, never on the host, the label or the messages. The shared ring shows on `:focus-visible` and the border turns `--color-accent` on `:focus`; the ring is added to the border change, not substituted for it, and must not be clipped by a dialog's `overflow`. Showing or clearing `error` never moves focus; the form moves focus to the first invalid control after a failed submit (forms pattern), which it can do because it owns the control.

### Labelling

- The accessible name is the `label` text (plus the optional marker), associated through `for`/`id`. Placeholders are examples and are never the name.
- `aria-describedby` lists the error id first, then the hint id, so the problem is read before the rule (D-9). It is absent when neither exists.
- `aria-invalid="true"` is present only while `error` is non-empty; `aria-required="true"` only while `required` is true.
- Identity fields carry `autocomplete` on the projected control (`username`, `current-password`, `new-password`, `given-name`, `family-name`, `tel`, `email`); the consumer sets it (accessibility foundation 3.3.7).

### Announcements

None by the field. An error that appears on blur is read with the field on the next focus through `aria-describedby`; the form-level failure is a live region owned by [alert](alert.md).

### Motion

Only `border-color` transitions, over `--duration-base`. Under `prefers-reduced-motion: reduce` tokens.css shortens it to 0.01 ms; the component adds no animation.

## Content and internationalisation

- Labels are Title Case nouns matching the data: "Username", "Confirm New Password", "Invitation Token", "Board Title". Optional fields end with "(optional)": "Phone (optional)", "Photo (optional)".
- Placeholders are sentence-case examples or prompts: "Enter your username", "Choose a username", "Brief title for your request", "555-0100". They never repeat the label and never carry a rule.
- Hints state the rule before the person fails it: "Password must be at least 8 characters long".
- Errors say what is wrong, without blame, in the formula "Field is required" or a cross-field sentence: "Username is required", "First name is required", "Passwords do not match", "Please confirm your new password". A red border is never shown without text.
- Dates are ISO in the control (2026-10-13); the page formats displayed dates as "Oct 13, 2026" elsewhere.
- Translatable inputs: `label`, `hint`, `error`, `optionalText`; placeholders and option text are the consumer's. Data values: the control's value ("mira.fern", "Mira", "555-0101").
- Long strings wrap. A French label about 30 % longer ("Confirmer le nouveau mot de passe") and a two-line error stay inside the group at 320 px; a `.form-row` label never forces the row wider than its container.

## Performance

- Change detection: `OnPush`, signal inputs; the label text and `aria-describedby` string are `computed`; the directive applies attributes through host bindings.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the control's `min-height` is fixed, so the group's height changes only when a hint or error appears below it; showing an error pushes the following fields down by one caption line, which is the design system's intended behaviour (the forms pattern renders errors in the flow). No skeleton.
- Weight: imports `@angular/core` and `@angular/common` only; no `@angular/forms` dependency (the consumer's reactive-forms directives sit on the projected control).

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-form-field label="Username">` projecting `<input coopInput id="username" type="text" placeholder="Enter your username">`, when it renders, then the host has `.form-group`, a `<label for="username">Username</label>` precedes the input, the input is 100 % wide with a `--color-border-strong` hairline border and `--radius-sm` corners, and the placeholder reads "Enter your username" in `--color-fg-subtle`. (L2-REQ-061)
- **AC-2** Given `label="Description"` projecting `<textarea coopInput placeholder="Describe the issue in detail">`, when it renders, then the label sits above a bordered textarea at least 6.25rem tall that resizes vertically only. (L2-REQ-061)
- **AC-3** Given `label="Priority"` projecting a `<select coopInput>` with the options Low, Medium, High and Urgent, when it renders, then the label sits above a bordered select whose native chevron is visible and whose options are the four projected ones. (L2-REQ-061)
- **AC-4** Given `label="Password"` with `hint="Password must be at least 8 characters long"`, when it renders, then a `<p class="form-hint">` with that text follows the control in `--text-caption` and the control's `aria-describedby` names it. (L2-REQ-077)
- **AC-5** Given `label="Phone"` and `optional`, when it renders, then the label reads "Phone (optional)" and the control has no `aria-required`. (L2-REQ-014)
- **AC-6** Given the "Invitation Token", "Username", "Password" and "Confirm Password" fields of the register card, when they render, then each is a `.form-group` with its label above a full-width control and the four stack in that order. (L2-REQ-077)
- **AC-7** Given `label="Expires"` projecting `<input coopInput type="date">`, when the person picks 13 October 2026, then the control's value is "2026-10-13". (L2-REQ-043)
- **AC-8** Given `label="Photos"` projecting `<input coopInput type="file" multiple accept="image/*">`, when it renders, then the native file control is labelled "Photos", accepts several image files, and no drop zone is drawn. (L2-REQ-040)
- **AC-9** Given `label="Email"` projecting `<input coopInput type="email">` (the onboarding profile step, and the Email field the contact form design describes), when it renders, then the control keeps `type="email"` and its accessible name is "Email". (L2-REQ-075)

### States

- **AC-10** Given the "Username" field of the login card, when `error` becomes "Username is required", then the control gains `aria-invalid="true"`, its border turns `--color-danger-solid`, and a `<p class="field-error">Username is required</p>` in `--color-danger-fg` appears below it. (L2-REQ-076)
- **AC-11** Given the "Current Password" field with `error="Current password is required"`, when `error` becomes null, then the error element is removed and `aria-invalid` and the error id leave `aria-describedby`. (L2-REQ-004)
- **AC-12** Given the "New Password" field with both a hint and `error="New password is required"`, when it renders, then both messages show, the error last, and `aria-describedby` reads "{id}-error {id}-hint". (L2-REQ-004)
- **AC-13** Given the "Title" field of the maintenance dialog, when the form marks it invalid, then it shows the text "Title is required" under the field and never a red border alone. (L2-REQ-021)
- **AC-14** Given the "Username" field with `error="Username is required"`, when the form rejects the submission, then the message stays until the form clears `error`, and the field reports invalid to assistive technology for as long as it shows. (L2-REQ-059)
- **AC-15** Given the "Name" field with `disabled` on the control, when it renders, then the fill is `--color-bg-subtle`, the text `--color-fg-disabled`, and <kbd>Tab</kbd> skips it. (L2-REQ-061)
- **AC-16** Given the "Name" field with `readonly` on the control, when it renders, then the fill is `--color-bg-subtle`, the text stays `--color-fg-default`, and the control still receives focus. (L2-REQ-061)

### Keyboard and focus

- **AC-17** Given focus on the "Username" field of the login card, when the person presses <kbd>Enter</kbd>, then the enclosing form submits. (L2-REQ-076)
- **AC-18** Given the "Confirm Password" control receives keyboard focus, when measured, then its border is `--color-accent` and a `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is visible around it. (L2-REQ-077)
- **AC-19** Given the "Username" field, when the person clicks the label text, then the control receives focus. (L2-REQ-061)

### Screen readers

- **AC-20** Given the "Current Password" field with `required` and `error="Current password is required"`, when queried by assistive technology, then its name is "Current Password", it is required and invalid, and its description begins "Current password is required". (L2-REQ-004)
- **AC-21** Given the "Role" select of the Add User dialog, when queried by assistive technology, then its name is "Role" and its options are Member, Board Member and Admin. (L2-REQ-061)

### Theming

- **AC-22** Given any field, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-061)

### Responsive

- **AC-23** Given "First Name" and "Last Name" in a `.form-row` at 768 px, when measured, then the two groups share the row equally with `--space-4` between them. (L2-REQ-014)
- **AC-24** Given the same `.form-row` at 320 px, when measured, then the two groups stack full width with no horizontal scrolling and both labels and values are fully visible. (L2-REQ-014)
- **AC-25** Given the "Confirm New Password" field with `error="Please confirm your new password"` at 320 px and 400 % zoom, when the page reflows, then the label, control and error stay inside the card and the error wraps rather than truncates. (L2-REQ-004)

### Motion

- **AC-26** Given `prefers-reduced-motion: reduce`, when the "Username" control gains focus, then its border colour changes with a 0.01 ms transition and nothing animates. (L2-REQ-061)

### Performance

- **AC-27** Given the register card with four fields, when `error` changes on "Username", then only that field re-renders (`OnPush` with signal inputs) and the other three are untouched. (L2-REQ-077)

## Implementation notes

- Folder `frontend/projects/components/src/lib/form-field/`: `form-field.component.ts`, `form-field.component.html`, `form-field.component.css`, `input.directive.ts` (`CoopInputDirective`, selector `input[coopInput], select[coopInput], textarea[coopInput]`); export both from `public-api.ts`.
- `FormFieldComponent` sets `host: { class: 'form-group' }` and `contentChild(CoopInputDirective, { required: true })`. The directive injects `FormFieldComponent` (optional, so it also works alone) and applies `id`, `aria-invalid`, `aria-describedby` and `aria-required` through host bindings computed from the parent's signals.
- The id counter is a module-level variable incremented per directive instance; a consumer-supplied `id` wins.
- Template order: `<label>`, `<ng-content>`, `@if (hint())` hint, `@if (error())` error. One `<ng-content>`; no conditional slots.
- No CDK primitive. Composes nothing; [checkbox](checkbox.md) and [search bar](search-bar.md) are siblings, not children. [Dialog](dialog.md) and the auth, profile and settings pages compose it.
- The `.form-row` stacking rule (D-8) lives next to `.form-row` in the shared foundation stylesheet, not in the component's encapsulated styles, because the row wraps the host.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Where does `.form-group` go?* On the host element, not on an inner wrapper. `.form-row > .form-group` and `.form-group label` are the design-system selectors and the e2e locators; an inner wrapper would break the row's equal-share rule and the group margin, and a `display: contents` host would not satisfy the child combinator.
- **D-5** *Who owns the control's id?* The consumer when it sets one (the public mocks use `id="username"`); otherwise the directive assigns `coop-field-{n}`. The admin mocks omit ids and rely on `aria-label`, which the design system rejects; generating an id guarantees the `for`/`id` pair.
- **D-6** *Is there a visible required marker?* No. Every mock omits one, the forms use `novalidate`, and the accessibility foundation marks optional fields instead. `required` sets `aria-required` only.
- **D-7** *Does the select get a custom chevron?* No. L2-REQ-061 AC3 asks for a chevron indicator; the native select draws one, no mock replaces it, and the design system extracted no custom control. The native indicator satisfies the criterion.
- **D-8** *Does `.form-row` stack on phones?* Yes, below `--layout-breakpoint-sm` (640 px). The mocks keep it side by side at every width (responsive foundation), but two name fields at 320 px would be about 130 px wide each, which fails the usable-at-400 %-zoom rule in AGENTS.md. 640 px is the product's smallest breakpoint and the one the public pages already use. The rendering shows the required stack and the current drift side by side.
- **D-9** *In what order are hint and error described?* Error first, hint second, while the DOM order is hint then error. A screen reader then hears what is wrong before the rule; the visual order keeps the rule nearest the control, as the change-password mock does.
- **D-10** *Is the file input a form field?* Yes, as a native control with the same label, hint and error wiring. The public maintenance dialog's dashed `.upload-area` and the onboarding photo tile are stubs in the mocks ("public photo selection is a stub"); no drop-zone component is specified until a design artefact shows one working.
- **D-11** *Which class names do hint and error use?* `.form-hint` and `.field-error`, the design-system names. The mocks' `.password-hint` and `.form-group .error-message` are the same rules under implementation names; the second collides with the form-level `.error-message`, which is why the design system renamed it. Page objects locate messages by `.field-error`.
- **D-12** *Does the component provide a `focus()` method?* No. The consumer owns the projected control and can focus it through its own template reference after a failed submit, so a method would duplicate native behaviour.
