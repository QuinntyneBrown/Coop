# Alert

| Field | Value |
|---|---|
| Selector | `coop-alert` |
| Library path | `frontend/projects/components/src/lib/alert/` |
| Status | planned |
| Traces to | L2-REQ-004, L2-REQ-007, L2-REQ-015, L2-REQ-045, L2-REQ-059, L2-REQ-063 |
| Design system | [`alert.html`](../../design-system/components/alert.html), [`patterns/feedback.html`](../../design-system/patterns/feedback.html) |
| Source mocks | [`notifications/admin-profile-saved/success`](../../mocks/notifications/admin-profile-saved/success.html), [`notifications/admin-profiles-saved/success`](../../mocks/notifications/admin-profiles-saved/success.html), [`notifications/admin-password-saved/success`](../../mocks/notifications/admin-password-saved/success.html), [`notifications/admin-theme-saved/success`](../../mocks/notifications/admin-theme-saved/success.html), [`notifications/public-profile-saved/success`](../../mocks/notifications/public-profile-saved/success.html), [`pages/admin-login/error`](../../mocks/pages/admin-login/error.html), [`pages/public-login/error`](../../mocks/pages/public-login/error.html), [`pages/admin-register/error`](../../mocks/pages/admin-register/error.html), [`pages/public-register/error`](../../mocks/pages/public-register/error.html), [`pages/admin-change-password/error`](../../mocks/pages/admin-change-password/error.html), [`pages/admin-change-password/mismatch`](../../mocks/pages/admin-change-password/mismatch.html), [`pages/public-profile/password-error`](../../mocks/pages/public-profile/password-error.html) |
| Rendering | [`alert.html`](alert.html) |

## Purpose and scope

An alert reports the outcome of an action in the page flow, above the content it relates to: "Profile updated successfully" at the top of the saved card, "Invalid username or password" above the sign-in form. It is inline: nothing floats, nothing disappears on a timer. Success and danger are in use today; warning and info are available for the same purpose. The form error block (`.error-message-block`) is the same component in its `form` configuration: a lighter, smaller red block for a failed request above the submit button.

Use something else instead when:

- the message belongs to one field ("Username is required"): the field error of [form field](form-field.md);
- the page is waiting: [spinner](spinner.md);
- a list has nothing to show: [empty state](empty-state.md);
- a count must sit on a control (the dashboard bell's unread count): the [icon button](icon-button.md) `count` badge; it is not an alert.

Out of scope:

- Deciding when a message shows. The page shows a success alert only after the save succeeded and clears field errors when it does (feedback pattern); the component renders what it is given.
- Toasts, stacking, auto-dismiss and a notification centre. The product has none; see D-4.
- Focus after a failed submit. The form moves focus to the first invalid field or the failure message's form; the alert never takes focus.

## Usage

Every `.alert`, standalone `.error-message` and `.success-message` in `docs/mocks` (10 uses on 12 screens) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `notifications/admin-profile-saved/success`, `admin-profiles-saved/success` | success | "Profile updated successfully" | shown (after save) | card, above the edit form's button row |
| `notifications/admin-password-saved/success` | success | "Password updated successfully" | shown | change-password card, under the subtitle |
| `notifications/admin-theme-saved/success` | success | "Theme saved successfully" | shown | settings card |
| `notifications/public-profile-saved/success` | success (the mock's `.success-message`, unified) | "Profile updated successfully" (the mock adds "!") | shown | public profile page, above the info card |
| `pages/admin-login/error` | danger | "Invalid username or password" | shown | login card, above the form |
| `pages/public-login/error` | danger, `form` (the mock's `.error-message.login-error`) | "Invalid username or password" | shown | login form, above the submit button |
| `pages/admin-register/error` | danger | "Registration failed. Please check your invitation token." | shown | register card, above the form |
| `pages/public-register/error` | danger, `form` (the mock's `.error-message.register-error`) | "Registration failed. Please check your invitation token." | shown | register form, above the submit button |
| `pages/admin-change-password/error`, `mismatch` | danger | "Failed to update password"; "Passwords do not match" | shown | change-password card, under the subtitle |
| `pages/public-profile/password-error` | danger, `form` (the mock's standalone `.error-message`) | "Failed to change password. Check your current password." | shown | public profile password form |
| any page that needs a dismissable message | any tone, `dismissible` | message + "Dismiss" control | shown, dismissed | card or page |
| `notifications/admin-dashboard-unread/info` | not an alert | the Unread Messages [metric card](metric-card.md) "2" | — | canvas |

No mock renders a warning or info alert; the tones exist in components.css and the API so a future message needs no API change. Every row is buildable with the API below: four tones, the form block, and an optional dismiss control.

## Anatomy

1. **Container** — `.alert` with `.alert-{tone}`, or `.error-message-block` for the form configuration. Hairline `--alert-border` edge, `--radius-sm`, `--alert-bg` fill, `--alert-fg` text, `--space-3` by `--space-4` padding, `--space-4` below. It carries the live-region role.
2. **Message** — the projected text in `--text-body-sm`, one or two sentences, no title. It is the accessible content.
3. **Dismiss control (optional)** — `<button class="icon-btn" type="button" aria-label="Dismiss">` with the `close` glyph, 2.5 rem square, at the end of the row, in `--alert-fg` ([icon button](icon-button.md)).

Host: `coop-alert` is `display: block` and carries no classes of its own; the classes and role go on the inner `<div>`. The inner element renders with its role at creation and never gains it later, so assistive technology announces the message when the element is inserted (design-system accessibility rule).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `'success' \| 'danger' \| 'warning' \| 'info'` | `'info'` | no | Adds `.alert-{tone}`. `success`, `warning` and `info` give `role="status"`; `danger` gives `role="alert"`. Ignored when `form` is set (the block is always danger). |
| `form` | `boolean` | `false` | no | Renders `.error-message-block` with `role="alert"` instead of `.alert`: the lighter, smaller form-level failure above a submit button. `dismissible` is ignored (D-6). |
| `dismissible` | `boolean` | `false` | no | Adds the dismiss control and a flex layout; the message wraps beside it. |
| `dismissLabel` | `string` | `'Dismiss'` | no | Accessible name of the dismiss control. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `dismissed` | `void` | The dismiss control was activated by pointer or keyboard. The component does not hide itself; the consumer removes it (D-7). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | text, optionally with inline markup | The message. Projected once; the only slot. |

Translation: the message is projected by the consumer and `dismissLabel` is an input, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Role | Use for |
|---|---|---|---|
| Success | `.alert.alert-success` | `status` | A save that stays on the page: "Profile updated successfully", "Password updated successfully", "Theme saved successfully". |
| Danger | `.alert.alert-danger` | `alert` | A failure for the whole form: "Invalid username or password", "Failed to update password", "Passwords do not match". |
| Warning | `.alert.alert-warning` | `status` | A condition that needs attention but did not fail. No mock uses it. |
| Info | `.alert.alert-info` | `status` | Neutral information. No mock uses it; `.alert-info` adds no rule because `.alert` already carries the info tokens (D-5). |
| Form error block | `.error-message-block` | `alert` | A rejected request above the submit button in the public sign-in, register and profile password forms: "Registration failed. Please check your invitation token." |

Modifier tone classes are additive to `.alert`; `form` replaces the whole class.

| Size | Modifier | Padding | Type |
|---|---|---|---|
| alert (one size) | — | `--space-3` vertical, `--space-4` horizontal | `--text-body-sm` |
| form error block | `.error-message-block` | `--space-2` all round | `--text-body-sm` |

Width comes from the container: the alert fills it and grows in height with its text.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Hidden | not rendered by the consumer | Nothing | — |
| Shown | inserted by the consumer | Tinted fill, hairline edge, tone text | Announced politely (`status`) or assertively (`alert`) on insertion |
| Message change | projected text changes | New text in place | Announced by the live region |
| Dismissible | `dismissible` | Flex row: message, then the 2.5 rem dismiss control at the end; one-line height stays 3 rem | The control is a button named "Dismiss" |
| Dismiss control, hover | `:hover` | `--color-bg-subtle` fill over `--duration-base` | — |
| Dismiss control, focus | `:focus-visible` | Shared ring `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` | — |
| Dismissed | the control activated | The consumer removes the element | `dismissed` emitted; the consumer moves focus (D-7) |

The alert has no hover, active, disabled or busy state of its own: it is not interactive apart from the optional dismiss control.

## Markup

```html
<!-- rendered: success -->
<div class="alert alert-success" role="status">Profile updated successfully</div>
```

```html
<!-- rendered: danger -->
<div class="alert alert-danger" role="alert">Invalid username or password</div>
```

```html
<!-- rendered: form error block -->
<div class="error-message-block" role="alert">Registration failed. Please check your invitation token.</div>
```

```html
<!-- rendered: dismissible success -->
<div class="alert alert-success" role="status" data-dismissible="true">
  <span class="alert-message">Theme saved successfully</span>
  <button class="icon-btn" type="button" aria-label="Dismiss"><span class="material-icons" aria-hidden="true">close</span></button>
</div>
```

Warning and info differ from success only by the modifier class.

```html
<!-- consumer -->
@if (saved()) {
  <coop-alert tone="success">Profile updated successfully</coop-alert>
}
@if (error()) {
  <coop-alert tone="danger">{{ error() }}</coop-alert>
}
<coop-alert form>Registration failed. Please check your invitation token.</coop-alert>
<coop-alert tone="success" dismissible (dismissed)="saved.set(false)">Theme saved successfully</coop-alert>
```

The classes and attributes above are part of the contract: the e2e page objects locate messages by `.alert`, the tone modifier, `.error-message-block`, `[role="status"]`, `[role="alert"]` and the dismiss control by `.alert .icon-btn`.

## Design

- Padding `--space-3` vertical and `--space-4` horizontal; margin `--space-4` below so the message sits apart from the content it precedes. The form block uses `--space-2` padding and `--space-2` below.
- Text `--text-body-sm` in `--alert-fg`; long messages wrap, never truncate.
- Edge `--border-width-hairline` solid `--alert-border`; radius `--radius-sm`.
- Dismissible layout (the component's own stylesheet, applied with `data-dismissible="true"`): `display: flex; align-items: flex-start; gap: var(--space-3)`; `.alert-message` is `flex: 1 1 auto; min-width: 0`; the control is `.icon-btn` with margin `calc(-1 * var(--space-2))` on its top, right and bottom so a one-line alert stays 3 rem tall and the 2.5 rem target does not stretch it (D-8).
- Transitions: only the dismiss control's background over `--duration-base` with `--ease-standard`. Nothing moves.
- Layer: none; alerts sit in the flow of their surface.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--alert-bg` | `--color-info-bg` | `.alert-success` (`--color-success-bg`), `.alert-warning` (`--color-warning-bg`), `.alert-danger` (`--color-danger-bg`) |
| `--alert-fg` | `--color-info-fg` | `.alert-success` (`--color-success-fg`), `.alert-warning` (`--color-warning-fg`), `.alert-danger` (`--color-danger-fg`) |
| `--alert-border` | `--color-info-border` | `.alert-success` (`--color-success-border`), `.alert-warning` (`--color-warning-border`), `.alert-danger` (`--color-danger-border`) |

The form block reads the semantic tokens directly (`--color-danger-subtle`, `--color-danger-fg`, `--color-danger-border`) and declares no component tokens.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Success fill | `--color-success-bg` | `--palette-green-100` | `--palette-green-100` |
| Success text and glyph | `--color-success-fg` | `--palette-green-800` | `--palette-green-800` |
| Success edge | `--color-success-border` | `--palette-green-200` | `--palette-green-200` |
| Danger fill | `--color-danger-bg` | `--palette-red-100` | `--palette-red-100` |
| Danger text and glyph | `--color-danger-fg` | `--palette-red-800` | `--palette-red-800` |
| Danger edge | `--color-danger-border` | `--palette-red-200` | `--palette-red-200` |
| Warning fill | `--color-warning-bg` | `--palette-amber-100` | `--palette-amber-100` |
| Warning text and glyph | `--color-warning-fg` | `--palette-amber-700` | `--palette-amber-700` |
| Warning edge | `--color-warning-border` | `--palette-amber-300` | `--palette-amber-300` |
| Info fill | `--color-info-bg` | `--palette-blue-100` | `--palette-blue-100` |
| Info text and glyph | `--color-info-fg` | `--palette-blue-800` | `--palette-blue-800` |
| Info edge | `--color-info-border` | `--palette-blue-200` | `--palette-blue-200` |
| Form block fill | `--color-danger-subtle` | `--palette-red-50` | `--palette-red-50` |
| Dismiss control, hover | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | Success message |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Danger message |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Warning message |
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | Info message |
| `--color-danger-fg` | `--color-danger-subtle` | 4.5:1 | Form error block |
| `--color-success-fg` | `--color-success-bg` | 3:1 | Dismiss glyph on the success tint (and each other tone, which passes 4.5:1 as text) |
| `--color-focus-ring` | `--color-success-bg` | 3:1 | Focus ring on the dismiss control over the success tint (D-9) |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring where the control overhangs the card |

The edge is decorative and exempt from 1.4.11; the fill and the text carry the meaning, and the text always states what happened so colour is never the only signal. Under `forced-colors: active` the edge becomes `CanvasText` and the ring `Highlight` (tokens.css); the component adds no colour of its own.

## Responsive behaviour

- No media rule applies (design-system page): the alert fills its container at every width and wraps its text onto further lines.
- At 320 px "Registration failed. Please check your invitation token." wraps to two or three lines inside the form block without clipping or horizontal scrolling; with `dismissible` the message column shrinks and the 2.5 rem control keeps its size at the end of the row.
- At 400 % zoom the message stays in the flow above its form and is reached by vertical scrolling only (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: the dismiss control is 40 px square (icon button), above the 24 px `--target-min`; the alert itself is not a target.
- At 768 px and below a success alert at the top of an admin card scrolls with the page; nothing is pinned.

## Accessibility

### Role and pattern

[WAI-ARIA APG Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/): a `<div>` with `role="alert"` for danger and the form block, `role="status"` for success, warning and info (WCAG 4.1.3 Status Messages; accessibility foundation). The dismiss control is a native `<button>`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Reaches the dismiss control, if present, in DOM order. The message itself is not a tab stop. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates the dismiss control (browser default). |

### Focus

The alert never takes focus and never moves it; the live region announces it. After a failed submit the form moves focus to the first invalid field or keeps it on the submit button (feedback pattern), not to the alert. When a dismissible alert is removed while its control has focus, the consumer that removes it moves focus to the nearest control it names, so focus is not dropped to `body` (D-7).

### Labelling

- The message text is the accessible content; there is no `aria-label` on the container.
- The dismiss control is named by `dismissLabel` ("Dismiss"); the glyph is `aria-hidden="true"`.
- Colour is never the only signal: the text says what happened ("updated successfully", "failed", "Invalid").

### Announcements

- The role is present on the inner element when it is created, so inserting `<coop-alert tone="success">Profile updated successfully</coop-alert>` announces "Profile updated successfully" politely, and inserting a danger alert announces it assertively, interrupting the current reading.
- A message change inside a mounted alert is announced the same way.
- No sound, no auto-dismiss, nothing timed.

### Motion

None. Only the dismiss control's background transitions over `--duration-base`, which tokens.css shortens under `prefers-reduced-motion: reduce`.

## Content and internationalisation

- Success: "{Thing} {past participle} successfully", no exclamation mark: "Profile updated successfully", "Password updated successfully", "Theme saved successfully". The public profile mock's "Profile updated successfully!" is drift (content foundation).
- Failure: say what failed and, if possible, what to do, without codes: "Invalid username or password", "Failed to update password", "Passwords do not match", "Registration failed. Please check your invitation token.", "Failed to change password. Check your current password."
- One or two sentences, no title, no "Oops" or apologies, and never the same message in a field and in the alert.
- Translatable inputs: `dismissLabel`; the projected message is the consumer's. Data values: none.
- A French message about 30 % longer ("Le profil a été mis à jour avec succès", "Échec de l'inscription. Vérifiez votre jeton d'invitation.") wraps onto further lines at 320 px without clipping; with `dismissible` the control stays at the end of the first line.

## Performance

- Change detection: `OnPush`, signal inputs; the class list and role come from one `computed`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: height comes from the text; a dismissible one-line alert stays 3 rem tall because the control overhangs the padding (D-8). The consumer inserts the alert where it will stay; it never shifts content after load.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK, no page-level library. Composes [icon button](icon-button.md) for the dismiss control.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-alert tone="success">Profile updated successfully</coop-alert>` inserted at the top of Mira Fern's saved profile card, when it renders, then the DOM holds `<div class="alert alert-success" role="status">Profile updated successfully</div>` with a `--color-success-bg` fill, a `--color-success-border` hairline, `--radius-sm` corners and `--color-success-fg` text at 4.5:1 or better. (L2-REQ-015)
- **AC-2** Given `<coop-alert tone="danger">Invalid username or password</coop-alert>` above the admin sign-in form, when it renders, then it has `.alert.alert-danger`, `role="alert"`, a `--color-danger-bg` fill and `--color-danger-fg` text. (L2-REQ-007)
- **AC-3** Given `<coop-alert form>Registration failed. Please check your invitation token.</coop-alert>` above the public register submit button, when it renders, then the DOM holds `<div class="error-message-block" role="alert">` with a `--color-danger-subtle` fill, `--space-2` padding and `--color-danger-fg` text, and no `.alert` class. (L2-REQ-059)
- **AC-4** Given a `coop-alert` with no `tone`, when it renders, then it has `.alert.alert-info`, `role="status"` and the `--color-info-bg` fill, and `tone="warning"` renders `.alert-warning` with `role="status"` and the `--color-warning-bg` fill. (L2-REQ-063)
- **AC-5** Given success, danger, warning and info alerts side by side, when compared, then each has a different fill, edge and text colour so the four are distinguishable at a glance, and each message states its outcome in words. (L2-REQ-063)
- **AC-6** Given `<coop-alert tone="success" dismissible>Theme saved successfully</coop-alert>`, when it renders, then the message sits in `.alert-message` beside a 2.5 rem `.icon-btn` named "Dismiss" at the end of the row, and the alert is 3 rem tall. (L2-REQ-063)
- **AC-7** Given a `coop-alert` with `form` and `dismissible`, when it renders, then no dismiss control is rendered. (L2-REQ-059)

### States

- **AC-8** Given the change-password page showing "Failed to update password", when the next attempt succeeds and the page replaces it with `<coop-alert tone="success">Password updated successfully</coop-alert>`, then the danger alert is gone and the success alert renders alone, with no field errors beside it. (L2-REQ-004)
- **AC-9** Given a dismissible alert, when its "Dismiss" control is activated by pointer, then `dismissed` emits once and the component itself stays rendered until the consumer removes it. (L2-REQ-063)

### Keyboard and focus

- **AC-10** Given a dismissible "Theme saved successfully" alert on the settings page, when <kbd>Tab</kbd> reaches its control and <kbd>Enter</kbd> or <kbd>Space</kbd> is pressed, then `dismissed` emits, and when the page removes the alert it moves focus to the "Save Theme" button. (L2-REQ-045)
- **AC-11** Given a non-dismissible alert, when the page is tabbed through, then the alert is never a tab stop and never receives focus. (L2-REQ-063)

### Screen readers

- **AC-12** Given the settings page with no alert, when "Theme saved successfully" is inserted as a success alert, then the element carries `role="status"` at insertion and a screen reader announces "Theme saved successfully" without interrupting the current reading. (L2-REQ-045)
- **AC-13** Given the admin sign-in form, when "Invalid username or password" is inserted as a danger alert after a rejected sign-in, then the element carries `role="alert"` at insertion and a screen reader announces it assertively. (L2-REQ-007)
- **AC-14** Given a dismissible alert, when its control is queried by assistive technology, then its role is button and its name is "Dismiss" (or the `dismissLabel` given), and the glyph is hidden. (L2-REQ-063)

### Theming

- **AC-15** Given any tone, when the page sets `data-theme="dark"`, then the alert renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-063)

### Responsive

- **AC-16** Given the form error block "Registration failed. Please check your invitation token." at a 320 px viewport, when measured, then it fills the form's width, wraps onto further lines and nothing scrolls horizontally. (L2-REQ-059)
- **AC-17** Given a dismissible danger alert with a two-line message at 320 px, when measured, then the control stays 40 px square at the end of the first line and the message wraps in the remaining width. (L2-REQ-063)

### Motion

- **AC-18** Given `prefers-reduced-motion: reduce`, when a success alert is inserted and a dismiss control is hovered, then nothing animates: the alert appears in one frame and the control's fill changes with a 0.01 ms transition. (L2-REQ-063)

### Performance

- **AC-19** Given a page with a mounted alert, when a sibling's input changes, then the alert does not re-render (`OnPush` with signal inputs), and a `tone` change re-renders only its class list and role. (L2-REQ-063)

## Implementation notes

- Folder `frontend/projects/components/src/lib/alert/`: `alert.component.ts`, `alert.component.html`, `alert.component.css`, `alert-tone.ts` (type alias); export from `public-api.ts`.
- One `<ng-template>` holds the projected message; the template renders either the `.alert` branch (with the optional `.alert-message` wrapper and dismiss control) or the `.error-message-block` branch and projects into it.
- `alert.component.css` holds only the dismissible layout (`[data-dismissible="true"]` flex row, `.alert-message`, the control's negative margins); every colour and size comes from components.css and tokens.css.
- The role is a static attribute of each branch, set from the `computed` tone at creation; the component never toggles `role` on a mounted element.
- Composes [icon button](icon-button.md). [Dialog](dialog.md) bodies, the sign-in, register, change-password, profile and settings pages compose it.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Is this the "toast notification" of L2-REQ-063?* It is the component that fulfils it, as an inline message. L2-REQ-063 describes toasts, but the mocks show only inline alerts, the feedback pattern says "nothing floats, nothing disappears on a timer", and the accessibility foundation states that auto-dismissing toasts do not exist in the product. The CRD keeps the alert inline, satisfies AC2's dismiss affordance with `dismissible` and `dismissed`, satisfies AC3 with four tones, and meets AC1 with colour-coded fill, edge and text rather than a left accent bar or icon, which no design artefact shows. L2-REQ-063 needs an `engineering-requirements` review to describe inline alerts (or to specify toasts, which would then need mocks and a design-system page first).
- **D-5** *What class does the info tone render?* `.alert.alert-info`. components.css has no `.alert-info` rule because `.alert` already carries the info tokens, so the class changes nothing visually; it lets page objects and tests select every tone the same way.
- **D-6** *Can the form error block be dismissed?* No. It reports a rejected request directly above the submit button and clears when the next submit succeeds or the form is left; a control there would compete with the submit button for the audience. `dismissible` is ignored when `form` is set.
- **D-7** *Does the alert hide itself when dismissed?* No. It emits `dismissed` and the consumer removes it with the same `@if` that showed it, so visibility has one owner and the consumer can move focus to a sensible control (the form's primary button) because it knows the page.
- **D-8** *How tall is a dismissible alert?* 3 rem for one line. The 2.5 rem icon button is the system's touch target; letting it overhang the `--space-3` padding by `--space-2` on three sides keeps the alert at its text height plus padding instead of growing to 4 rem.
- **D-9** *Which pairs must the dismiss control's focus ring pass?* The ring over the success and other tints, and over the card where it overhangs. The ring token (`--color-focus-ring`, green 500) on the success tint (green 100) is the closest pair; the rendering shows the live ratio and the control may not be placed where it falls below 3:1.
- **D-10** *Why is the warning tone `status` and not `alert`?* A warning did not fail anything, so it should not interrupt; the accessibility foundation reserves `role="alert"` for errors.
