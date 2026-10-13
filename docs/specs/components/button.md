# Button

| Field | Value |
|---|---|
| Selector | `coop-button` |
| Library path | `frontend/projects/components/src/lib/button/` |
| Status | planned |
| Traces to | L2-REQ-060, L2-REQ-064, L2-REQ-066, L2-REQ-068, L2-REQ-069, L2-REQ-076, L2-REQ-077 |
| Design system | [`button.html`](../../design-system/components/button.html) |
| Source mocks | [`pages/public-login/default`](../../mocks/pages/public-login/default.html), [`pages/public-login/submitting`](../../mocks/pages/public-login/submitting.html), [`pages/public-register/submitting`](../../mocks/pages/public-register/submitting.html), [`pages/public-landing/default`](../../mocks/pages/public-landing/default.html), [`pages/admin-messaging/default`](../../mocks/pages/admin-messaging/default.html), [`pages/admin-change-password/default`](../../mocks/pages/admin-change-password/default.html), [`pages/public-onboarding/profile`](../../mocks/pages/public-onboarding/profile.html), [`pages/public-profile/default`](../../mocks/pages/public-profile/default.html), [`pages/admin-profile/default`](../../mocks/pages/admin-profile/default.html), [`dialogs/admin-user-delete/default`](../../mocks/dialogs/admin-user-delete/default.html), [`dialogs/admin-user-create/default`](../../mocks/dialogs/admin-user-create/default.html) |
| Rendering | [`button.html`](button.html) |

## Purpose and scope

A button triggers an action: it submits a form, opens or confirms a dialog, starts or ends a session, or creates a record. One primary button per view marks the action the view exists for. When the control only navigates, the component renders the same look on an anchor (`href`) so landing-page calls to action and "Cancel" links share the API.

Use something else instead when:

- the control is a single icon with no visible label: [icon button](icon-button.md);
- the control filters a list and stays pressed: [filter chips](filter-chips.md);
- the control switches a panel: [tabs](tabs.md);
- the control is one of the dashboard's "quick actions": [card](card.md) (quick-action variant).

Out of scope:

- Form validation, double-submit protection and the form-level error message. The form owns them and drives this component's `busy` input ([form field](form-field.md), [alert](alert.md)).
- Button rows. `.btn-row` and `.modal-actions` are layout containers owned by the page and by [dialog](dialog.md); this CRD only requires that the button fills its share inside `.modal-actions`.
- The live-region announcement of a busy state. The form's status region announces it; the button only exposes `aria-busy`.

## Usage

Every `.btn` in `docs/mocks` (214 uses on 40 screens) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/public-login/*`, `pages/admin-login/*` form | primary, md, block, submit | "Sign In"; busy "Signing in..." | default, busy (`submitting`) | card |
| `pages/public-register/*`, `pages/admin-register/*` form | primary, md, block, submit | "Create Account"; busy "Creating account..." | default, busy | card |
| `pages/public-forgot-password/default`, `pages/admin-forgot-password/default` | primary, md, block, submit | "Send Reset Link" | default | card |
| `pages/public-landing/default`, `pages/admin-landing/default` hero | primary, lg, `href` | "Join Now" / "Get Started" | default | hero band |
| `pages/admin-landing/default` header | primary, md, `href` | "Register" | default | surface |
| `pages/admin-change-password/*` button row | secondary `href` + primary submit in `.btn-row` | "Cancel", "Update Password" | default | card |
| `pages/admin-profile/*`, `pages/admin-profiles/*` | primary; secondary; primary submit; secondary cancel; danger | "Edit Profile", "Change Password", "Save Changes", "Cancel", "Logout" | default | card |
| `pages/public-profile/*`, `dialogs/public-profile-switcher/default` | outline, sm; secondary, sm; outline, block; sign-out, block; primary, block | "Edit", "Change Avatar", "Change Password", "Log Out", "Update Password" | default | card |
| `pages/public-onboarding/*`, `pages/admin-onboarding/*` step row | outline / secondary + primary in `.btn-row` | "Back", "Next", "Skip", "Go to Dashboard" | default | card |
| `pages/admin-users/*`, `pages/admin-documents/*`, `pages/admin-assets/*`, `pages/admin-invitations/*`, `pages/admin-maintenance/*` page header | primary, md, leading icon | `add` + "Add User" / "New Document" / "New Request" / "New Invitation"; `upload` + "Upload Asset" | default | canvas |
| `pages/public-maintenance/*` page header | primary, md | "+ Create Request" | default | canvas |
| `pages/admin-messaging/*` list toolbar | primary, sm, leading icon | `add` + "New Conversation" | default | surface |
| `pages/admin-roles/*` privileges panel | primary, sm, leading icon | `add` + "Add Privilege" | default | card |
| `pages/admin-maintenance/detail-*` detail panel | primary; secondary | "Receive Request", "Edit Description" | default | card |
| `pages/admin-settings/*` theme form | primary | "Save Theme" | default | card |
| `pages/admin-messaging/chat`, `pages/public-messaging/chat` composer | primary, submit, icon-only (`send`) with `label` "Send message" | icon `send` | default | surface |
| every confirmation dialog (`dialogs/admin-user-delete`, `admin-document-delete`, `admin-asset-delete`) | secondary + danger in `.modal-actions` | "Cancel", "Delete" | default | dialog |
| every form dialog (`dialogs/admin-user-create`, `admin-user-edit`, `admin-invitation-create`, `admin-document-create`, `admin-maintenance-create`, `public-maintenance-create`, `admin-new-conversation`, `admin-asset-upload`) | secondary (or outline in the public dialog) + primary submit in `.modal-actions` | "Cancel", "Create" / "Save" / "Create Request" / "Upload" / "Start" | default, busy (`admin-asset-upload/busy`) | dialog |
| `dialogs/admin-invitation-created/default`, viewers | primary in `.modal-actions` | "Done", "Copy Link" | default | dialog |

Every row is buildable with the API below: five variants, three sizes, block width, a leading icon, an icon-only form with a required label, an anchor form, and a busy state with its own label.

## Anatomy

1. **Container** — `.btn`. Inline-flex, centred, minimum height `--button-height`, horizontal padding `--button-padding-x`, hairline border `--button-border`, radius `--button-radius`, gap `--space-2` between icon and label.
2. **Label** — the projected text. It is the accessible name. Title Case verb phrase ("Save Changes").
3. **Leading icon (optional)** — `<span class="material-icons" aria-hidden="true">` before the label, rendered from the `icon` input. With no label projected the button is icon-only and `label` supplies `aria-label`.
4. **Busy label** — when `busy` is true the label text is replaced by `busyLabel` ("Signing in...").

Host: `coop-button` is `display: inline-flex` (`display: flex; width: 100%` when `block`) and carries no classes of its own. All classes and attributes go on the inner native `<button>` or `<a>`; the host forwards `click` events only when the control is neither disabled nor busy (`pointer-events: none` on the host in those states).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'danger' \| 'sign-out'` | `'secondary'` | no | Maps to `.btn-{variant}`. Secondary adds `.btn-secondary` (the mocks name it explicitly). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | `sm` adds `.btn-sm`, `lg` adds `.btn-lg`, `md` adds nothing. |
| `block` | `boolean` | `false` | no | Adds `.btn-full`; the host becomes `display: flex; width: 100%`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | no | Set on the inner `<button>`. Ignored when `href` is set. |
| `href` | `string \| null` | `null` | no | When set the component renders `<a class="btn …" href>` (an Angular `routerLink` consumer passes the resolved URL). `type`, `busy` and `disabled` do not apply to the anchor form; a disabled navigation is not rendered. |
| `icon` | `string \| null` | `null` | no | Material Icons ligature name rendered as a leading `.material-icons` span with `aria-hidden="true"`. |
| `label` | `string \| null` | `null` | no | Accessible name for an icon-only button (`aria-label`). Required when no label text is projected. When text is projected and `label` is also set, `label` must contain the visible text (WCAG 2.5.3). |
| `busy` | `boolean` | `false` | no | Sets native `disabled` and `aria-busy="true"` on the inner button and swaps the label for `busyLabel`. Width does not change while busy (see Design). |
| `busyLabel` | `string` | `''` | when `busy` can be true | The present-participle label shown while busy ("Signing in..."). An empty value keeps the normal label. |
| `disabled` | `boolean` | `false` | no | Native `disabled`; removed from the tab order; 60 % opacity. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | Consumers bind `(click)` on the host; the host suppresses pointer events while disabled or busy, and the native `disabled` attribute suppresses keyboard activation. A `submit` button submits its enclosing form natively. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | text, optionally with inline markup | The label. Projected once into the inner element; no other slot. |

Translation: the label is projected by the consumer and `busyLabel` and `label` are inputs, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Primary | `.btn-primary` | The one action the view exists for: "Sign In", "Save Changes", "Create Account", "Add User". One per view. |
| Secondary | `.btn-secondary` | Safe actions beside a primary: "Cancel", "Back", "Edit Description". The default. |
| Outline | `.btn-outline` | Lower-emphasis accent action: "Edit", "Change Password" on the public profile, "Back" in public onboarding. |
| Danger | `.btn-danger` | Destructive confirmation in a "Confirm Delete" dialog: "Delete". Also the admin "Logout". |
| Sign out | `.btn-sign-out` | Ending a session from the public profile: "Log Out" (the mocks' `.logout-btn`). |

Ghost (text-only, no border) is named by L2-REQ-060 AC5 but no mock uses it and the design system does not define it; see D-4.

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| sm | `.btn-sm` | `--button-height` = 2rem | `--space-4` | `--text-label` |
| md | — | `--button-height` = 2.5rem | `--space-5` | `--text-label` |
| lg | `.btn-lg` | `--button-height` = 3rem | `--space-8` | `--text-label` at `--font-size-md` |

Width comes from the label plus padding; `block` makes it fill the container; inside `.modal-actions` each button takes an equal share (`flex: 1 1 0`).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--button-bg` fill, `--button-fg` label, `--button-border` hairline | Name = label |
| Hover | `:hover` | Fill moves to `--button-bg-hover` over `--duration-base`; no underline on the anchor form | — |
| Focus | `:focus-visible` | Shared ring: `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset` | — |
| Active | `:active` | Fill `--button-bg-active` (falls back to the hover fill) | — |
| Disabled | `disabled` | Opacity 0.6, `cursor: not-allowed`, no hover change | Not focusable; exposed as disabled |
| Busy | `busy` → `disabled` + `aria-busy="true"` | As disabled, label replaced by `busyLabel`, `cursor: progress`, width held | Not focusable; busy = true; the form's status region announces the label |
| Block | `block` | Fills the container width | — |
| Icon-only | no projected text | Square-ish `md` control with the glyph only | Name from `label` |

Every variant has every interaction state; the five-row matrix in the rendering is the contract.

## Markup

```html
<!-- rendered: primary submit, block, with and without busy -->
<button class="btn btn-primary btn-full" type="submit">Sign In</button>
<button class="btn btn-primary btn-full" type="submit" disabled aria-busy="true">Signing in...</button>
```

```html
<!-- rendered: leading icon, small -->
<button class="btn btn-primary btn-sm" type="button"><span class="material-icons" aria-hidden="true">add</span>New Conversation</button>
```

```html
<!-- rendered: icon-only submit -->
<button class="btn btn-primary" type="submit" aria-label="Send message"><span class="material-icons" aria-hidden="true">send</span></button>
```

```html
<!-- rendered: anchor form, large -->
<a class="btn btn-primary btn-lg" href="/register">Join Now</a>
```

```html
<!-- rendered: confirmation dialog actions -->
<div class="modal-actions">
  <button class="btn btn-secondary" type="button">Cancel</button>
  <button class="btn btn-danger" type="button">Delete</button>
</div>
```

Secondary, outline, danger and sign-out differ only by the modifier class; `disabled` adds only the attribute.

```html
<!-- consumer -->
<coop-button variant="primary" size="md" block type="submit" [busy]="signingIn()" busyLabel="Signing in...">Sign In</coop-button>
<coop-button variant="primary" size="sm" icon="add" (click)="openNewConversation()">New Conversation</coop-button>
<coop-button variant="primary" type="submit" icon="send" label="Send message"></coop-button>
<coop-button variant="primary" size="lg" [href]="registerUrl">Join Now</coop-button>
<coop-button variant="danger" (click)="confirmDelete()">Delete</coop-button>
```

The classes and attributes above are part of the contract: the e2e page objects locate buttons by `.btn`, the modifier classes, `type`, `disabled` and `aria-busy`.

## Design

- Height `--button-height` (2rem, 2.5rem, 3rem by size); side padding `--button-padding-x`; gap `--space-2` between icon and label.
- Label `--text-label` (medium weight, `--font-size-sm`); large uses `--font-size-md`. Source copy is Title Case; the CSS applies no transform.
- Border `--border-width-hairline` solid `--button-border`; radius `--button-radius` = `--radius-md`.
- Transitions: `background-color` and `border-color` over `--duration-base` with `--ease-standard`. Nothing moves.
- Busy width: the component measures nothing; it sets `min-width` on the inner element to the width it had when `busy` became true so the row does not shift, and releases it when `busy` clears (D-5).
- Layer: none; buttons sit in the flow of their surface.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--button-height` | 2.5rem | `.btn-sm` (2rem), `.btn-lg` (3rem) |
| `--button-padding-x` | `--space-5` | `.btn-sm` (`--space-4`), `.btn-lg` (`--space-8`) |
| `--button-radius` | `--radius-md` | — |
| `--button-bg` | `--color-bg-surface` | `.btn-primary` (`--color-accent`), `.btn-outline` and `.btn-sign-out` (transparent), `.btn-danger` (`--color-danger-solid`) |
| `--button-bg-hover` | `--color-bg-subtle` | `.btn-primary` (`--color-accent-hover`), `.btn-outline` (`--color-accent-subtle-hover`), `.btn-danger` (`--color-danger-solid-hover`), `.btn-sign-out` (`--color-danger-subtle`) |
| `--button-bg-active` | falls back to `--button-bg-hover` | `.btn-primary` (`--color-accent-active`) |
| `--button-fg` | `--color-fg-default` | `.btn-primary` (`--color-fg-on-accent`), `.btn-outline` (`--color-fg-accent`), `.btn-danger` (`--color-fg-on-danger`), `.btn-sign-out` (`--color-danger-fg`) |
| `--button-border` | `--color-border-default` | `.btn-primary` and `.btn-outline` (`--color-accent`), `.btn-danger` and `.btn-sign-out` (`--color-danger-solid`) |

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Primary fill | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Primary fill, hover | `--color-accent-hover` | `--palette-green-800` | `--palette-green-800` |
| Primary fill, active | `--color-accent-active` | `--palette-green-900` | `--palette-green-900` |
| Primary label | `--color-fg-on-accent` | `--palette-white` | `--palette-white` |
| Secondary fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Secondary fill, hover | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Secondary label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Secondary border | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Outline label and border | `--color-fg-accent`, `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Outline fill, hover | `--color-accent-subtle-hover` | `--palette-green-100` | `--palette-green-100` |
| Danger fill | `--color-danger-solid` | `--palette-red-600` | `--palette-red-600` |
| Danger fill, hover | `--color-danger-solid-hover` | `--palette-red-700` | `--palette-red-700` |
| Danger label | `--color-fg-on-danger` | `--palette-white` | `--palette-white` |
| Sign-out label | `--color-danger-fg` | `--palette-red-800` | `--palette-red-800` |
| Sign-out fill, hover | `--color-danger-subtle` | `--palette-red-50` | `--palette-red-50` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Primary label |
| `--color-fg-on-accent` | `--color-accent-hover` | 4.5:1 | Primary label, hover |
| `--color-fg-on-accent` | `--color-accent-active` | 4.5:1 | Primary label, active |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Secondary label |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Secondary label, hover |
| `--color-fg-accent` | `--color-bg-surface` | 4.5:1 | Outline label |
| `--color-fg-accent` | `--color-accent-subtle-hover` | 4.5:1 | Outline label, hover |
| `--color-accent` | `--color-bg-surface` | 3:1 | Outline border on a card |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Outline border on the page |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Danger label |
| `--color-fg-on-danger` | `--color-danger-solid-hover` | 4.5:1 | Danger label, hover |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Sign-out label |
| `--color-danger-fg` | `--color-danger-subtle` | 4.5:1 | Sign-out label, hover |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Sign-out and danger border |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a card |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |

The secondary border (`--color-border-default`, decorative) is exempt from 1.4.11: the fill and label carry the affordance. Disabled labels are exempt from contrast. Under `forced-colors: active` the ring becomes `Highlight` and borders `CanvasText` (tokens.css); the component adds no colour of its own.

## Responsive behaviour

- The mocks define no media rule for buttons; height and padding are the same at every width (design-system page).
- Below `--layout-breakpoint-md` (768 px) the sign-in, register and profile submits use `block` so they span the form; dialog actions stay on one row in `.modal-actions` with equal shares at every width.
- Labels wrap onto a second line rather than truncate; the minimum height grows with the wrapped label. "Creating account..." fits on one line at 320 px in a block button.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom every button stays reachable and operable (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: `md` and `lg` are 40 px and 48 px tall, above the 24 px `--target-min`; `sm` is 32 px tall and keeps `--space-3` or more from its neighbours (accessibility foundation). Primary phone actions are block buttons at 40 px or more.

## Accessibility

### Role and pattern

Native `<button>` (`type="button"` or `"submit"`), or native `<a href>` for navigation; no ARIA role is added. [WAI-ARIA APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the button in DOM order. Disabled and busy buttons are skipped. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates a `<button>` (browser default). |
| <kbd>Enter</kbd> | Follows the anchor form. |

### Focus

Focus lands on the inner native element, never on the host. The shared ring (`--focus-ring-width` solid `--color-focus-ring`, offset `--focus-ring-offset`) shows on `:focus-visible` and must not be clipped by a parent's `overflow: hidden`. When a focused button becomes busy, native `disabled` drops focus; when `busy` clears, the component restores focus to the button if nothing else took focus in the meantime (D-6).

### Labelling

- The projected text is the accessible name. Leading icons are `aria-hidden="true"`.
- Icon-only buttons take their name from `label` (`aria-label`); `label` is required then.
- Busy: `aria-busy="true"` plus the busy label as the name ("Signing in...").
- No `aria-disabled`; the native attribute carries the state.

### Announcements

None by the button. The enclosing form's status region announces the busy and result messages ([alert](alert.md)).

### Motion

Only `background-color` and `border-color` transition, over `--duration-base`. Under `prefers-reduced-motion: reduce` tokens.css shortens `--duration-base` to 0.01 ms; the component adds no animation.

## Content and internationalisation

- Labels are Title Case verb phrases that name the outcome: "Sign In", "Create Account", "Save Changes", "Update Password", "Add User", "New Request", "Delete", "Log Out". Never "Submit" or "OK".
- Busy labels are the present participle with three dots: "Signing in...", "Creating account...".
- Cancel precedes the committing action; the primary is last in a row.
- Translatable inputs: `busyLabel`, `label`; the projected label is the consumer's. Data values: none.
- Long labels wrap; a French label about 30 % longer ("Créer un compte", "Enregistrer les modifications") stays on one line in a block button at 320 px and wraps inside `.modal-actions` without overflowing.

## Performance

- Change detection: `OnPush`, signal inputs, class list from one `computed`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: height comes from `--button-height`, so a label change never changes height; the busy state holds the width it had (D-5).
- Weight: imports `@angular/core` and `@angular/common` only; no CDK, no router dependency (the consumer resolves `href`).

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-button variant="primary">Save Changes</coop-button>`, when it renders, then the DOM holds `<button class="btn btn-primary" type="button">Save Changes</button>` with a `--color-accent` fill and a label contrast of at least 4.5:1. (L2-REQ-060)
- **AC-2** Given a button with no `variant`, when it renders, then it has `.btn.btn-secondary`, a `--color-bg-surface` fill and a `--color-border-default` hairline distinct from the primary. (L2-REQ-060)
- **AC-3** Given `variant="outline"` and the label "Edit", when it renders, then the fill is transparent and both the border and the label use the accent colour. (L2-REQ-060)
- **AC-4** Given `variant="danger"` and the label "Delete" inside a "Confirm Delete" dialog, when it renders, then the fill is `--color-danger-solid` with a white label. (L2-REQ-060)
- **AC-5** Given `variant="sign-out"` and the label "Log Out", when it renders, then it has `.btn.btn-sign-out`, a transparent fill, a `--color-danger-solid` border and a `--color-danger-fg` label. (L2-REQ-060)
- **AC-6** Given `icon="add"` and the label "Add User", when it renders, then a `.material-icons` span containing "add" with `aria-hidden="true"` precedes the label and the accessible name is "Add User". (L2-REQ-060)
- **AC-7** Given `href="/register"`, `size="lg"` and the label "Join Now", when it renders, then the DOM holds `<a class="btn btn-primary btn-lg" href="/register">Join Now</a>` and no `type` attribute. (L2-REQ-068)

### Sizes

- **AC-8** Given `size="sm"` with `icon="add"` and "New Conversation", when it renders, then it has `.btn-sm`, a 2rem minimum height and `--space-4` side padding. (L2-REQ-060)
- **AC-9** Given `block` on the "Sign In" submit, when it renders inside the login card, then it has `.btn-full` and its width equals the card's content width. (L2-REQ-076)

### States

- **AC-10** Given a primary "Save Changes" button, when it is hovered, then its fill changes to `--color-accent-hover` over `--duration-base` and the label stays white. (L2-REQ-060)
- **AC-11** Given `disabled`, when it renders, then the native `disabled` attribute is present, opacity is 0.6, hover changes nothing and <kbd>Tab</kbd> skips it. (L2-REQ-060)
- **AC-12** Given the "Sign In" submit with `busyLabel="Signing in..."`, when `busy` becomes true, then the label reads "Signing in...", the button has `disabled` and `aria-busy="true"`, its width does not change and a second activation submits nothing. (L2-REQ-076)
- **AC-13** Given the "Create Account" submit with `busyLabel="Creating account..."`, when `busy` becomes true and then false, then the label returns to "Create Account" and `disabled` and `aria-busy` are removed. (L2-REQ-077)

### Keyboard and focus

- **AC-14** Given focus on the "Delete" button of a confirm dialog, when <kbd>Enter</kbd> or <kbd>Space</kbd> is pressed, then the host's `click` fires once. (L2-REQ-064)
- **AC-15** Given a "Cancel" button, when it receives keyboard focus, then a `--focus-ring-width` solid `--color-focus-ring` ring at `--focus-ring-offset` is visible and unclipped. (L2-REQ-064)
- **AC-16** Given the "Sign In" button held focus when it became busy, when `busy` clears and nothing else took focus, then focus is on the button again. (L2-REQ-076)

### Screen readers

- **AC-17** Given an icon-only submit with `icon="send"` and `label="Send message"`, when queried by assistive technology, then its role is button and its name is "Send message". (L2-REQ-060)
- **AC-18** Given a busy "Sign In" button, when queried by assistive technology, then its name is "Signing in..." and it reports busy and disabled. (L2-REQ-076)
- **AC-19** Given the "Member Login" button in the public header, when queried by assistive technology, then its name is exactly "Member Login". (L2-REQ-066)

### Theming

- **AC-20** Given any variant, when the page sets `data-theme="dark"`, then the button renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-060)

### Responsive

- **AC-21** Given the hero call to action "Join Now" at 320 px wide, when measured, then it is at least 48 px tall, fully visible and activatable by touch without horizontal scrolling. (L2-REQ-069)
- **AC-22** Given "Cancel" and "Delete" in `.modal-actions` at 320 px, when measured, then both share the row equally and neither label clips. (L2-REQ-064)
- **AC-23** Given the block "Create Account" button at 320 px and 400 % zoom, when the page reflows, then the button is reachable and its label wraps rather than truncates. (L2-REQ-077)

### Motion

- **AC-24** Given `prefers-reduced-motion: reduce`, when a primary button is hovered, then the fill changes with a 0.01 ms transition and nothing animates. (L2-REQ-060)

### Performance

- **AC-25** Given a page with twenty buttons, when a sibling's input changes, then no button re-renders (`OnPush` with signal inputs), and a busy change re-renders only that button. (L2-REQ-060)

## Implementation notes

- Folder `frontend/projects/components/src/lib/button/`: `button.component.ts`, `button.component.html`, `button.component.css`, `button-variant.ts` (type alias), `button-size.ts` (type alias), `button-type.ts` (type alias); export from `public-api.ts`.
- One `<ng-template>` holds the projected content; the template renders either the `<button>` or the `<a>` branch and projects into it.
- The host sets `pointer-events: none` via a host binding when `disabled || busy`, so a consumer's `(click)` never fires in those states.
- The busy width hold reads `offsetWidth` once in an effect when `busy` turns true and writes `min-width` on the inner element; it clears on false.
- Focus restoration (AC-16) remembers `document.activeElement === inner` when `busy` turns true and calls `inner.focus()` after `busy` turns false in the same effect.
- No CDK primitive; composes nothing. [Dialog](dialog.md), [form field](form-field.md) and [top bar](top-bar.md) compose it.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Does the API include the Ghost variant L2-REQ-060 AC5 names?* No. No mock uses a text-only button and the design system (extracted from the implementation) defines five variants without it. Adding one would specify a look no design artefact shows. L2-REQ-060 AC5 and AC1 (which names the mocks' brand-green hex fill that the design system replaced with `--color-accent` for 4.5:1 contrast) need an `engineering-requirements` update; until then the CRD follows the design system.
- **D-5** *Does the busy button change width?* No. The design system shows only a label swap; holding the pre-busy width as `min-width` keeps the form from shifting, which the layout-stability rule requires.
- **D-6** *What happens to focus while busy?* The design system uses native `disabled` for busy, which drops focus. The component restores focus to itself when `busy` clears if focus was not moved elsewhere, so a keyboard user continues from the same place after "Signing in..." finishes.
- **D-7** *Is there a separate output?* No. The native `click` on the host is enough for every usage; an extra output would duplicate it.
- **D-8** *How does an icon-only button get its name?* From the required `label` input rendered as `aria-label`; the only icon-only `.btn` in the mocks (the messaging "send" submit) has no visible text.
- **D-9** *Which modifier does secondary emit?* `.btn-secondary`, because the mocks name it on every Cancel and the design system keeps the class, even though `.btn` alone has the same look.
