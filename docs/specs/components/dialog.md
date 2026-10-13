# Dialog

| Field | Value |
|---|---|
| Selector | `coop-dialog` (the surface shell inside a dialog component), `coop-dialog-container` (the CDK container the shell renders into); opened through `DialogService` |
| Library path | `frontend/projects/components/src/lib/dialog/` |
| Status | planned |
| Traces to | L2-REQ-001, L2-REQ-003, L2-REQ-018, L2-REQ-021, L2-REQ-034, L2-REQ-035, L2-REQ-042, L2-REQ-043, L2-REQ-064 |
| Design system | [`dialog.html`](../../design-system/components/dialog.html), [`patterns/dialogs.html`](../../design-system/patterns/dialogs.html) |
| Source mocks | [`dialogs/admin-user-delete/default`](../../mocks/dialogs/admin-user-delete/default.html), [`dialogs/admin-document-delete/default`](../../mocks/dialogs/admin-document-delete/default.html), [`dialogs/admin-asset-delete/default`](../../mocks/dialogs/admin-asset-delete/default.html), [`dialogs/admin-user-create/default`](../../mocks/dialogs/admin-user-create/default.html), [`dialogs/admin-user-create/invalid`](../../mocks/dialogs/admin-user-create/invalid.html), [`dialogs/admin-user-edit/default`](../../mocks/dialogs/admin-user-edit/default.html), [`dialogs/admin-invitation-create/default`](../../mocks/dialogs/admin-invitation-create/default.html), [`dialogs/admin-invitation-created/default`](../../mocks/dialogs/admin-invitation-created/default.html), [`dialogs/admin-new-conversation/default`](../../mocks/dialogs/admin-new-conversation/default.html), [`dialogs/admin-document-create/default`](../../mocks/dialogs/admin-document-create/default.html), [`dialogs/admin-document-viewer/default`](../../mocks/dialogs/admin-document-viewer/default.html), [`dialogs/admin-maintenance-create/invalid`](../../mocks/dialogs/admin-maintenance-create/invalid.html), [`dialogs/admin-asset-detail/default`](../../mocks/dialogs/admin-asset-detail/default.html), [`dialogs/admin-asset-upload/busy`](../../mocks/dialogs/admin-asset-upload/busy.html), [`dialogs/public-maintenance-create/invalid`](../../mocks/dialogs/public-maintenance-create/invalid.html), [`dialogs/public-maintenance-detail/empty`](../../mocks/dialogs/public-maintenance-detail/empty.html), [`dialogs/public-document-viewer/default`](../../mocks/dialogs/public-document-viewer/default.html), [`dialogs/public-profile-switcher/default`](../../mocks/dialogs/public-profile-switcher/default.html) |
| Rendering | [`dialog.html`](dialog.html) |

## Purpose and scope

A dialog interrupts the page to ask for one thing: confirm a deletion, fill in a short form, read a document or glance at one record. It sits on a 50 % black scrim, and everything behind it is unavailable until it closes. The product has 17 dialog screens and every one is built from the same parts: the scrim (`.modal-overlay`), the surface (`.modal-content.card`), a title, a body and a row of actions (`.modal-actions`). The component is a shell: it owns the surface, the title, the optional close control, the action row, the width, the focus behaviour and the close policy. The feature component that opens it owns the body (fields, document text, list items) and the action buttons.

Use something else instead when:

- the message is information, not a question: [alert](alert.md) in the page flow;
- the task has its own address, tabs or several steps (sign in, register, onboarding, change password, admin maintenance detail): navigate to a page;
- the control only expands a navigation panel: the sidebar drawer ([sidebar](sidebar.md)).

Out of scope:

- The body content and its validation. Form dialogs compose [form field](form-field.md); invalid fields, error text and `aria-invalid` belong to it.
- The action buttons themselves. They are [button](button.md) instances projected into the actions slot; the dialog only lays the row out and decides the initial focus.
- What a dialog result does to the page behind it (reloading a list, showing a success alert). The feature component that opened the dialog handles the `DialogRef` result.
- A busy indicator inside the body (the asset upload progress bar and its spinner are body content from the feature; the dialog only exposes `aria-busy` and locks its close paths).

## Usage

Every `.modal-overlay` in `docs/mocks` (18 overlays on 17 dialog screens; the asset delete screen holds two) is one of the configurations below. Each row is one dialog component in the feature app whose template is a `coop-dialog` with projected body and actions.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/admin-user-delete/default` | confirm, sm | title "Confirm Delete"; body "Are you sure you want to delete this user?"; actions "Cancel" (secondary) + "Delete" (danger) | default | scrim over the admin users table |
| `dialogs/admin-document-delete/default` | confirm, sm | "Confirm Delete"; "Are you sure you want to delete this document?"; "Cancel" + "Delete" | default | scrim over admin documents |
| `dialogs/admin-asset-delete/default` | confirm, sm, stacked over the asset detail viewer | "Confirm Delete"; "Are you sure you want to delete this asset?"; "Cancel" + "Delete" | default, stacked | second scrim over the asset detail dialog |
| `dialogs/admin-user-create/default`, `invalid` | form, sm | "Add New User"; fields Username, Role, Password; "Cancel" + "Create" (submit) | default, invalid | scrim over admin users |
| `dialogs/admin-user-edit/default` | form, sm | "Edit User"; the same fields prefilled "mira.fern"; "Cancel" + "Save" | default | scrim over admin users |
| `dialogs/admin-invitation-create/default` | form, sm | "Create Invitation"; fields Type, Expires; "Cancel" + "Create" | default | scrim over admin invitations |
| `dialogs/admin-new-conversation/default` | form, sm | "New Conversation"; field Recipient; "Cancel" + "Start" | default | scrim over admin messaging |
| `dialogs/admin-maintenance-create/default`, `invalid` | form, md | "New Maintenance Request"; Title, Description, Priority, Category, Photos; "Cancel" + "Submit" | default, invalid | scrim over admin maintenance |
| `dialogs/public-maintenance-create/default`, `invalid` | form, md | "Create New Request"; Title, Description, Priority, Category, Photo (optional); "Cancel" (outline) + "Submit Request" | default, invalid | scrim over public maintenance |
| `dialogs/admin-asset-upload/default`, `busy` | form, md, `busy` while uploading | "Upload File"; file input and progress bar; "Cancel" + "Upload" | default, busy | scrim over admin assets |
| `dialogs/admin-document-create/default` | form, lg | "New Document"; Title, Type, Content (textarea), Status; "Cancel" + "Save" | default | scrim over admin documents |
| `dialogs/admin-invitation-created/default` | viewer, sm | "Invitation Created"; body token "fictional-invite-mira"; actions "Copy" (secondary) + "Close" (primary); header close control | default | scrim over admin invitations |
| `dialogs/admin-asset-detail/default` | viewer, md | "Asset Details"; preview icon, "Courtyard plan.pdf", size, "Oct 13, 2026, 8:00 AM"; actions "Delete" (danger) + "Download" (primary) + "Close" (secondary); header close control | default, parent of a stacked confirm | scrim over admin assets |
| `dialogs/admin-document-viewer/default`, `dialogs/public-document-viewer/default` | viewer, lg | "Autumn courtyard gathering"; meta "Notice", "Oct 13, 2026"; document text; action "Download" with a leading `download` icon; header close control | default | scrim over documents |
| `dialogs/public-maintenance-detail/default`, `empty` | viewer, md | "Kitchen tap leak"; badges "New", "High"; description; "Attachments" ("No attachments" when empty); "Comments" with a comment composer "Add a comment..." + "Send"; no actions row; header close control | default, empty | scrim over public maintenance |
| `dialogs/public-profile-switcher/default` | viewer, sm | "Switch Profile"; two list items "Mira Fern · Member" and "Mira Fern · BoardMember"; no actions row; header close control | default | scrim over the public profile |

Every row is buildable with the API below: three variants (confirm, form, viewer), three widths, an optional header close control, a body slot, an actions slot, a busy lock and one level of stacking.

## Anatomy

1. **Scrim** — `.modal-overlay`. Fixed, fills the viewport, `--color-bg-backdrop`, `--z-modal`, `--space-4` padding on every side plus the device safe-area insets so the surface never touches a screen edge. Rendered by the container, one per open dialog.
2. **Container** — `coop-dialog-container`, the CDK dialog container. Carries `role="dialog"` (`"alertdialog"` for confirm), `aria-modal="true"`, `aria-labelledby` (the title), `aria-describedby` (confirm only) and `aria-busy` when busy. It traps focus and is the element the scrim centres.
3. **Surface** — `.modal-content.card`. `--color-bg-surface`, `--radius-lg`, `--space-8` padding, hairline `--color-border-default` edge, `width: 100%` up to the size cap, `max-height: 90vh` with `overflow-y: auto`. No shadow (D-5).
4. **Header (viewer only)** — `.modal-header`. Title and close control on one row, `--space-4` below.
5. **Title** — `<h3>` in `--text-h2`, id `coop-dialog-{n}-title`. Always an `h3` regardless of the page outline (D-8). It is the accessible name.
6. **Close control (viewer only)** — `<button class="icon-btn" type="button" aria-label="Close">` with the `close` glyph, 2.5 rem square, last in the header ([icon button](icon-button.md)).
7. **Body** — `<div class="modal-body" id="coop-dialog-{n}-body">`: the projected content (a sentence, form fields, document text, list items). It has no styles of its own; it exists so the confirm variant can point `aria-describedby` at it (D-9).
8. **Actions** — `.modal-actions`. The projected buttons on one row, `--space-3` apart, `--space-5` above, each taking an equal share. Cancel first, the committing action last. Omitted when nothing is projected into the slot.

Host: `coop-dialog` is `display: contents`; the classes go on the inner elements. `coop-dialog-container` is a block that fills the CDK overlay pane and renders `.modal-overlay > .modal-content.card`, projecting the opened feature component (and so the `coop-dialog` shell inside it) into `.modal-content`.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `'confirm' \| 'form' \| 'viewer'` | `'form'` | no | Sets the role, the initial focus target, the close policy and whether the header close control renders (see Variants and sizes). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | no | `sm` adds no class (`.modal-content` alone caps at `--layout-dialog-sm`); `md` adds `.modal-md`; `lg` adds `.modal-lg`. |
| `title` | `string` | — | yes | Rendered in the `<h3>`; registered as the container's `aria-labelledby`. |
| `closeLabel` | `string` | `'Close'` | no | Accessible name of the header close control (viewer variant). |
| `busy` | `boolean` | `false` | no | Sets `aria-busy="true"` on the container, disables the close control and makes <kbd>Esc</kbd> and scrim clicks do nothing. Consumers disable their own action buttons ([button](button.md) `busy` or `disabled`). |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `closed` | `DialogCloseReason` = `'escape' \| 'scrim' \| 'close-button'` | The shell dismissed the dialog through one of its own paths. The shell then closes the `DialogRef` with no result. Buttons the consumer projects (Cancel, Delete, Save, Done) close the `DialogRef` themselves with their result and do not raise `closed` (D-10). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | any content: a `<p>`, `.form-group` fields, document text, list items | The body. Projected once into `.modal-body`. |
| `[slot=actions]` | `coop-button` elements | Projected into `.modal-actions`. When empty the row is not rendered (profile switcher, maintenance detail). |

### Service

`DialogService.open<TResult>(component, options)` wraps CDK `Dialog.open` and returns the CDK `DialogRef<TResult>`. `options` carries `data` (passed to the component through `DIALOG_DATA`) and `restoreFocus` (`boolean | HTMLElement`, default `true`, meaning the element focused when `open` was called). The service always sets `disableClose: true` (the container applies the close policy itself), `autoFocus: false` (the container moves focus per variant), `hasBackdrop: false` (the container draws the scrim), `container: DialogContainerComponent`, and a pane class that makes the pane fill the viewport. Stacking is the CDK's: a dialog opened while another is open renders after it in the overlay container and sits on top (D-7).

Translation: `title` and `closeLabel` are inputs and the body and actions are projected, so the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Role | Initial focus | <kbd>Esc</kbd> | Scrim click | Header close control | Use for |
|---|---|---|---|---|---|---|
| Confirm | `alertdialog` | the first button in `.modal-actions` (Cancel, the safe choice) | closes (`'escape'`) | ignored | no | "Confirm Delete" for a user, document or asset: one sentence, Cancel then Delete. |
| Form | `dialog` | the first field in the body | closes (`'escape'`), the same as Cancel | ignored | no | Create and edit: user, invitation, conversation, maintenance request, document, asset upload. |
| Viewer | `dialog` | the title (`tabindex="-1"`) | closes (`'escape'`) | closes (`'scrim'`) | yes | Read-only content: document viewers, asset details, maintenance detail, invitation created, profile switcher. |

Scrim clicks never confirm or submit; confirm and form dialogs ignore them so an accidental tap on a phone cannot lose typed input or dismiss a decision (D-6).

| Size | Modifier | Max width | Padding | Use |
|---|---|---|---|---|
| sm | — | `--layout-dialog-sm` (400 px) | `--space-8` | Confirmations and short forms: user, invitation, new conversation, invitation created, profile switcher. |
| md | `.modal-md` | `--layout-dialog-md` (500 px) | `--space-8` | Forms with several fields and record detail: maintenance request, asset upload, asset details, maintenance detail. |
| lg | `.modal-lg` | `--layout-dialog-lg` (700 px) | `--space-8` | Document viewers and the document form, which read better at a wider measure. |

The surface is always `width: 100%` up to its cap, so it shrinks on phones. Height is never fixed: the surface grows with its content and caps at 90 % of the viewport height, then scrolls inside.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Closed | not open | Nothing rendered; the trigger on the page is the only trace | — |
| Open | `DialogService.open` | Scrim over the page, surface centred, page scroll blocked | Dialog announced by name; the page behind is hidden (`aria-hidden`) and unreachable |
| Hover, close control | `:hover` on `.icon-btn` | `--color-bg-subtle` fill over `--duration-base` | — |
| Focus | `:focus-visible` on any control inside; the title when focused programmatically | Shared ring: `--focus-ring-width` solid `--color-focus-ring` at `--focus-ring-offset`, visible on the white surface | — |
| Invalid (form) | fields with `aria-invalid="true"` in the body | Red borders and error text from [form field](form-field.md); the dialog stays open | Field errors linked by `aria-describedby`; the dialog itself adds nothing |
| Busy | `busy` | Close control disabled; the consumer disables its buttons; body shows the feature's progress | `aria-busy="true"` on the container; <kbd>Esc</kbd> and scrim ignored; the feature's `role="status"` text announces progress |
| Empty (viewer) | body content | The feature's empty text ("No attachments") inside the body | — |
| Scrolling | content taller than 90 vh | The surface scrolls inside; the scrim and page do not | — |
| Stacked | a second `open` while one is open | A second scrim darkens the first dialog; the first stays rendered beneath | Only the top dialog is reachable; <kbd>Esc</kbd> closes the top one; focus returns to the control in the lower dialog that opened it |

## Markup

```html
<!-- rendered: confirm, sm (admin user delete) -->
<div class="cdk-overlay-container">
  <div class="cdk-global-overlay-wrapper">
    <div class="cdk-overlay-pane coop-dialog-pane">
      <coop-dialog-container class="cdk-dialog-container" role="alertdialog" aria-modal="true" aria-labelledby="coop-dialog-1-title" aria-describedby="coop-dialog-1-body" tabindex="-1">
        <div class="modal-overlay">
          <div class="modal-content card">
            <coop-user-delete-dialog><coop-dialog>
              <h3 id="coop-dialog-1-title">Confirm Delete</h3>
              <div class="modal-body" id="coop-dialog-1-body"><p>Are you sure you want to delete this user?</p></div>
              <div class="modal-actions">
                <button class="btn btn-secondary" type="button">Cancel</button>
                <button class="btn btn-danger" type="button">Delete</button>
              </div>
            </coop-dialog></coop-user-delete-dialog>
          </div>
        </div>
      </coop-dialog-container>
    </div>
  </div>
</div>
```

```html
<!-- rendered: form, sm (admin user create); the surface only -->
<div class="modal-content card">
  <h3 id="coop-dialog-2-title">Add New User</h3>
  <div class="modal-body" id="coop-dialog-2-body">
    <form novalidate>
      <div class="form-group"><label for="username">Username</label><input id="username" type="text" autocomplete="username"></div>
      <div class="form-group"><label for="role">Role</label><select id="role"><option>Member</option><option>Board Member</option><option>Admin</option></select></div>
      <div class="form-group"><label for="password">Password</label><input id="password" type="password" autocomplete="new-password"></div>
    </form>
  </div>
  <div class="modal-actions">
    <button class="btn btn-secondary" type="button">Cancel</button>
    <button class="btn btn-primary" type="submit" form="user-form">Create</button>
  </div>
</div>
```

```html
<!-- rendered: viewer, lg (document viewer); the surface only -->
<div class="modal-content card modal-lg">
  <div class="modal-header">
    <h3 id="coop-dialog-3-title" tabindex="-1">Autumn courtyard gathering</h3>
    <button class="icon-btn" type="button" aria-label="Close"><span class="material-icons" aria-hidden="true">close</span></button>
  </div>
  <div class="modal-body" id="coop-dialog-3-body">
    <p>Notice · Oct 13, 2026</p>
    <p>Join your neighbours in the courtyard on Saturday at 2 pm. Bring a mug and a story to share.</p>
  </div>
  <div class="modal-actions">
    <button class="btn btn-primary" type="button"><span class="material-icons" aria-hidden="true">download</span>Download</button>
  </div>
</div>
```

```html
<!-- rendered: busy form (asset upload); container attribute plus disabled actions -->
<coop-dialog-container role="dialog" aria-modal="true" aria-labelledby="coop-dialog-4-title" aria-busy="true" tabindex="-1">
  …
  <h3 id="coop-dialog-4-title">Upload File</h3>
  <div class="modal-body" id="coop-dialog-4-body"><p role="status">Uploading courtyard-plan.pdf</p></div>
  <div class="modal-actions">
    <button class="btn btn-secondary" type="button" disabled>Cancel</button>
    <button class="btn btn-primary" type="button" disabled aria-busy="true">Uploading...</button>
  </div>
  …
</coop-dialog-container>
```

The md variant adds `.modal-md`; a viewer without actions (profile switcher, maintenance detail) omits `.modal-actions`. A stacked confirm is a second `coop-dialog-container` rendered after the first in `.cdk-overlay-container`.

```html
<!-- consumer: the feature's dialog component template, opened by DialogService -->
<coop-dialog variant="confirm" title="Confirm Delete">
  <p>Are you sure you want to delete this user?</p>
  <coop-button slot="actions" variant="secondary" (click)="ref.close(false)">Cancel</coop-button>
  <coop-button slot="actions" variant="danger" (click)="ref.close(true)">Delete</coop-button>
</coop-dialog>

<coop-dialog variant="form" size="md" title="New Maintenance Request" [busy]="saving()">
  <form id="request-form" (ngSubmit)="save()">…</form>
  <coop-button slot="actions" variant="secondary" (click)="ref.close()">Cancel</coop-button>
  <coop-button slot="actions" variant="primary" type="submit" [busy]="saving()" busyLabel="Creating...">Create Request</coop-button>
</coop-dialog>

<coop-dialog variant="viewer" size="lg" [title]="document().title" (closed)="ref.close()">
  <p>{{ document().body }}</p>
  <coop-button slot="actions" variant="primary" icon="download" (click)="download()">Download</coop-button>
</coop-dialog>
```

```ts
// consumer: opening and reading the result
const ref = this.dialogs.open<boolean>(UserDeleteDialogComponent, { data: { user } });
ref.closed.subscribe(confirmed => { if (confirmed) this.deleteUser(user); });
```

The classes and attributes above are part of the contract: the e2e page objects locate the open dialog by `[role="dialog"]` or `[role="alertdialog"]`, the surface by `.modal-overlay .modal-content`, the title by `.modal-content h3`, the close control by `.modal-header .icon-btn`, and the buttons by `.modal-actions .btn`.

## Design

- Scrim: `--color-bg-backdrop` fill, `--z-modal` layer (the CDK overlay container is given the same layer), padding `--space-4` on every side plus `env(safe-area-inset-*)`; a `viewport-fit=cover` meta is the app shell's job (responsive foundation).
- Surface: `--color-bg-surface`, hairline `--border-width-hairline` solid `--color-border-default`, `--radius-lg`, padding `--space-8` at every size and width, `max-height: 90vh`, `overflow-y: auto`.
- Title `--text-h2` (semibold, `--font-size-xl`), `--space-2` below it; in a `.modal-header` the title has no bottom margin and the row has `--space-4` below.
- Actions: flex row, gap `--space-3`, `--space-5` above, every button `flex: 1 1 0` with `min-width: max-content`; the row wraps (`flex-wrap: wrap`) when the labels do not fit (D-16). The wrap rule is the component's own stylesheet; components.css does not have it yet.
- Close control: `--icon-btn-size` (2.5 rem) square, `--radius-sm`, `--color-bg-subtle` on hover over `--duration-base`.
- Motion: none. The dialog appears and disappears in one frame (D-11).
- Layer order: scrim and surface at `--z-modal`, above the sticky bars (`--z-sticky`) and the drawer (`--z-drawer`); the bottom tab bar is covered by the scrim.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--icon-btn-size` | 2.5rem | — (the close control uses the icon button's own token) |

The dialog declares no component tokens of its own; its colours and sizes come from the semantic tokens above.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Scrim | `--color-bg-backdrop` | `rgba(0, 0, 0, 0.5)` | `rgba(0, 0, 0, 0.5)` |
| Surface fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Surface edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Title and body text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Secondary text (card `p`) | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Close control glyph | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Close control, hover | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Focus ring | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Title and body on the surface |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Meta text ("Notice · Oct 13, 2026") on the surface |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Close glyph on its hover fill |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | "Delete" label in a confirm |
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | "Create", "Save", "Download" labels |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the surface |

The surface edge is decorative and exempt from 1.4.11; the scrim provides the separation. Under `forced-colors: active` the ring becomes `Highlight` and the edge `CanvasText` (tokens.css); the scrim keeps its translucent black, which the browser renders as is.

## Responsive behaviour

- No media rule changes the dialog (design-system page): the same centred surface is used at every width; there is no full-screen sheet and no bottom sheet.
- The scrim's `--space-4` padding and the surface's `width: 100%` keep a 16 px gutter on both sides at every width; at 320 px the surface is 288 px wide and the `--space-8` padding is kept.
- The surface caps at 90 vh and scrolls inside (`overflow-y: auto`); the scrim never scrolls and the page behind cannot scroll while a dialog is open.
- `.modal-actions` buttons share the row equally. When the row cannot hold every label at its natural width, as the three asset detail actions ("Delete", "Download", "Close") cannot at 320 px, the row wraps and the overflowing button takes the next row at full width; no label ever clips (D-16). Two-button rows fit on one row at 320 px.
- At 320 px and 400 % zoom nothing scrolls horizontally or clips: fields, document text and list items wrap inside the surface (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: action buttons are 40 px tall and share the row (well over 44 px wide); the close control is 40 px square (accessibility foundation; `--target-min` is 24 px).
- Safe areas: the scrim padding adds `env(safe-area-inset-*)` on notched phones (design-system requirement; the mocks do not).

## Accessibility

### Role and pattern

[WAI-ARIA APG Modal Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) on the CDK dialog container: `role="dialog"`, or `role="alertdialog"` for the confirm variant, `aria-modal="true"`, named by `aria-labelledby` (the title) and, for confirm, described by `aria-describedby` (the body). Built on `@angular/cdk/dialog` (`Dialog`, `DialogRef`, `CdkDialogContainer`), which supplies the focus trap, the block scroll strategy, `aria-hidden` on the page behind and focus restoration.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Moves to the next control inside the dialog; from the last control it wraps to the first (focus is trapped). |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves backward; from the first control it wraps to the last. |
| <kbd>Esc</kbd> | Closes the topmost dialog as Cancel (`closed` with `'escape'`, `DialogRef` closed with no result). Ignored while `busy`. |
| <kbd>Enter</kbd> | In a field, submits the form (native); on a button, activates it. It never activates "Delete" unless that button has focus. |
| <kbd>Space</kbd> | Activates the focused button. |

### Focus

- On open, the container focuses itself for one frame (CDK), then the shell moves focus to the variant's target: the first `.modal-actions` button (Cancel) for confirm, the first field in the body for form, the title (`tabindex="-1"`) for viewer. Nothing outside the dialog can take focus while it is open.
- The shared ring (`--focus-ring-width` solid `--color-focus-ring`, offset `--focus-ring-offset`) shows on every control and on the focused title; `.modal-content`'s `overflow-y: auto` must not clip it, so the surface keeps its `--space-8` padding around every control.
- On close, focus returns to the element that was focused when `open` was called (CDK `restoreFocus`). When that element is no longer in the document (the user row was deleted), the service focuses the page's `<h1>` inside `main`, giving it `tabindex="-1"` if it has none (D-12).
- Stacked: when the asset delete confirm closes, focus returns to the "Delete" button of the asset detail dialog, which is still open.

### Labelling

- The title is the accessible name; it is never empty (`title` is required).
- The close control is named by `closeLabel` ("Close"), never a bare "×".
- `aria-describedby` points at the body only for the confirm variant, whose body is one sentence; for forms and viewers the body is content to navigate, not a description.
- `aria-busy="true"` while `busy`.

### Announcements

None by the shell. A busy upload's progress text is a `role="status"` element in the feature's body; the result of a dialog (a list reloading, a success message) is announced by the page through an [alert](alert.md).

### Motion

None. The dialog shows and hides without a transition, so `prefers-reduced-motion` needs no rule (D-11).

## Content and internationalisation

- Titles are Title Case and state the task: "Confirm Delete", "Add New User", "Edit User", "Create Invitation", "New Conversation", "New Document", "New Maintenance Request", "Upload File", "Invitation Created", "Asset Details", "Switch Profile"; viewers use the record's own title ("Autumn courtyard gathering", "Kitchen tap leak").
- A confirm body is one sentence that names the thing: "Are you sure you want to delete this user?" (and "…this document?", "…this asset?"). No second sentence, no explanation.
- Action labels are one or two words, the verb the person chose: "Cancel", "Delete", "Create", "Save", "Start", "Submit Request", "Upload", "Copy", "Close", "Download". Never "OK" or "Yes".
- Cancel (or Close) is first and the committing action last, except the asset detail row, which leads with "Delete" and ends with "Close" as the mock does.
- Dates in viewers follow the content foundation: "Oct 13, 2026" and "Oct 13, 2026, 8:00 AM" (the asset detail mock's seconds and raw byte count are unformatted values the feature must format).
- Translatable inputs: `title`, `closeLabel`. Data values: document titles and bodies, asset names, request titles, profile names in the projected body. A French title about 30 % longer ("Confirmer la suppression") wraps onto a second line inside the header without pushing the close control out of the surface; a long document title wraps the same way.

## Performance

- Change detection: `OnPush`, signal inputs; the class list and the id pair come from `computed` signals; the container reads the shell's variant, size, title id and busy through signals the shell sets once at init.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the surface has its cap from the size class and grows with content; the header reserves the 2.5 rem close control so the title does not shift when it appears; nothing moves after open because there is no transition.
- Weight: imports `@angular/core`, `@angular/common`, `@angular/cdk/dialog` and `@angular/cdk/a11y` (through the CDK container); no router, no forms module, no page-level library. Composes [icon button](icon-button.md); consumers compose [button](button.md) and [form field](form-field.md) inside it.

## Acceptance criteria

### Rendering

- **AC-1** Given `UserDeleteDialogComponent` whose template is `<coop-dialog variant="confirm" title="Confirm Delete">` with the sentence "Are you sure you want to delete this user?" and "Cancel" and "Delete" in the actions slot, when `DialogService.open` renders it, then the DOM holds `.modal-overlay > .modal-content.card` with an `<h3>` "Confirm Delete", the sentence in `.modal-body`, and `.modal-actions` with "Cancel" before "Delete". (L2-REQ-064)
- **AC-2** Given any open dialog, when its surface is measured, then it has `--color-bg-surface` fill, `--radius-lg` corners, a hairline `--color-border-default` edge, `--space-8` padding, and sits centred on a `--color-bg-backdrop` scrim that covers the whole viewport. (L2-REQ-064)
- **AC-3** Given the user create dialog `<coop-dialog variant="form" title="Add New User">` with Username, Role and Password fields and "Cancel" and "Create", when it renders, then the fields sit between the title and `.modal-actions`, `.modal-content` has no size class and is at most `--layout-dialog-sm` wide. (L2-REQ-001)
- **AC-4** Given the document viewer `<coop-dialog variant="viewer" size="lg" title="Autumn courtyard gathering">`, when it renders, then `.modal-content` has `.modal-lg`, `.modal-header` holds the `<h3>` and an `.icon-btn` named "Close" with the `close` glyph, and `.modal-actions` holds the single "Download" button. (L2-REQ-035)
- **AC-5** Given the public maintenance create dialog with `size="md"`, when it renders, then `.modal-content` has `.modal-md` and is at most `--layout-dialog-md` wide. (L2-REQ-021)
- **AC-6** Given the asset detail viewer with "Delete", "Download" and "Close" in the actions slot, when it renders at 768 px, then the three buttons share `.modal-actions` equally in that order; at 320 px the row wraps so that "Close" takes a second row and no label is clipped. (L2-REQ-042)
- **AC-7** Given the profile switcher `<coop-dialog variant="viewer" title="Switch Profile">` with two list items and nothing in the actions slot, when it renders, then no `.modal-actions` element exists and the header close control is the only button. (L2-REQ-018)

### States

- **AC-8** Given the asset upload dialog with `[busy]="uploading()"`, when `busy` becomes true, then the container has `aria-busy="true"`, <kbd>Esc</kbd> and scrim clicks do nothing and the close control, if present, is `disabled`; when `busy` returns to false they work again. (L2-REQ-064)
- **AC-9** Given the user create dialog in its invalid state (Username with `aria-invalid="true"` and an error message), when the submit is rejected, then the dialog stays open, keeps focus inside and renders the field errors from the body without changing its own size or role. (L2-REQ-001)
- **AC-10** Given the document create dialog at a viewport 500 px tall, when its content is taller than 90 % of the viewport, then `.modal-content` scrolls inside, the scrim does not move and the page behind does not scroll. (L2-REQ-064)
- **AC-11** Given the asset detail viewer is open, when its "Delete" button opens the asset delete confirm, then a second `.modal-overlay` renders after the first in the overlay container, its scrim darkens the detail dialog, and only the confirm's controls are reachable. (L2-REQ-042)

### Keyboard and focus

- **AC-12** Given the user delete confirm opens from the "Delete user" icon button in the users table, when it finishes opening, then focus is on the "Cancel" button, not on "Delete". (L2-REQ-003)
- **AC-13** Given the invitation create form dialog opens, when it finishes opening, then focus is in the "Type" select, the first field. (L2-REQ-043)
- **AC-14** Given the document viewer opens, when it finishes opening, then focus is on the `<h3>` title, which has `tabindex="-1"` and shows the focus ring. (L2-REQ-035)
- **AC-15** Given focus on the last control of any open dialog, when <kbd>Tab</kbd> is pressed, then focus moves to the dialog's first control, and <kbd>Shift</kbd>+<kbd>Tab</kbd> from the first control moves to the last; focus never reaches the page behind. (L2-REQ-064)
- **AC-16** Given the user create form dialog with text typed into Username, when <kbd>Esc</kbd> is pressed, then `closed` emits `'escape'`, the `DialogRef` closes with no result and no user is created. (L2-REQ-001)
- **AC-17** Given the user delete confirm, when the scrim outside `.modal-content` is clicked, then nothing happens: the dialog stays open and no result is emitted. (L2-REQ-003)
- **AC-18** Given the document viewer, when the scrim is clicked or the "Close" control is activated, then `closed` emits `'scrim'` or `'close-button'` and the dialog closes. (L2-REQ-035)
- **AC-19** Given the document delete confirm was opened from the "Delete document" icon button of a document row, when it closes by Cancel, then focus returns to that icon button. (L2-REQ-034)
- **AC-20** Given the user delete confirm was opened from the delete icon button of Oren Reed's row, when "Delete" removes that row and the dialog closes, then focus moves to the page's `<h1>` because the trigger no longer exists. (L2-REQ-003)
- **AC-21** Given the asset delete confirm stacked over the asset detail viewer, when <kbd>Esc</kbd> is pressed, then only the confirm closes and focus returns to the detail dialog's "Delete" button. (L2-REQ-042)
- **AC-22** Given focus on the "Cancel" button of a confirm dialog, when <kbd>Enter</kbd> is pressed, then the dialog closes without deleting; "Delete" fires only when it has focus. (L2-REQ-003)

### Screen readers

- **AC-23** Given the user delete confirm, when queried by assistive technology, then the container has role `alertdialog`, `aria-modal="true"`, name "Confirm Delete" and description "Are you sure you want to delete this user?". (L2-REQ-003)
- **AC-24** Given the invitation created viewer, when queried by assistive technology, then the container has role `dialog`, name "Invitation Created", and the page's `main` landmark is `aria-hidden` while it is open and not after it closes. (L2-REQ-043)
- **AC-25** Given the document viewer's close control, when queried by assistive technology, then its role is button and its name is "Close", with no "×" glyph in the name. (L2-REQ-064)

### Theming

- **AC-26** Given any dialog, when the page sets `data-theme="dark"`, then the scrim, surface and title render with the same light tokens because no dark theme is defined, and no hard-coded colour appears in the component's styles. (L2-REQ-064)

### Responsive

- **AC-27** Given the user delete confirm at a 320 px viewport, when measured, then the surface is 288 px wide with a 16 px gutter on each side, keeps its `--space-8` padding, both buttons share the row and nothing scrolls horizontally. (L2-REQ-064)
- **AC-28** Given the public maintenance create dialog at 320 px and 400 % zoom, when it opens, then every field, both buttons and the title are reachable by scrolling inside the surface, with no horizontal scrolling. (L2-REQ-021)
- **AC-29** Given the document viewer at 768 px, when measured, then the surface is 700 px wide (`--layout-dialog-lg`) and centred. (L2-REQ-035)

### Motion

- **AC-30** Given `prefers-reduced-motion: reduce` or not, when a dialog opens and closes, then nothing animates: the scrim and surface appear and disappear in one frame. (L2-REQ-064)

### Performance

- **AC-31** Given an open form dialog, when a field's value changes, then only the field re-renders; the shell and container (`OnPush`, signal inputs) do not. (L2-REQ-064)

## Implementation notes

- Folder `frontend/projects/components/src/lib/dialog/`: `dialog.component.ts|html|css` (`DialogComponent`, selector `coop-dialog`), `dialog-container.component.ts|html|css` (`DialogContainerComponent`, selector `coop-dialog-container`, extends `CdkDialogContainer`), `dialog.service.ts` (`DialogService`), `dialog-variant.ts`, `dialog-size.ts`, `dialog-close-reason.ts`, `dialog-open-options.ts`; export from `public-api.ts`.
- The first slice adds `@angular/cdk` to `frontend/package.json` (it is not installed yet) and sets `prefix` to `coop` in `frontend/angular.json` and the components ESLint config (D-1).
- `DialogService.open` calls CDK `Dialog.open(component, { data, container: DialogContainerComponent, disableClose: true, autoFocus: false, hasBackdrop: false, restoreFocus, panelClass: 'coop-dialog-pane' })`. `.coop-dialog-pane` is `position: fixed; inset: 0` so the container's `.modal-overlay` fills the viewport; the CDK overlay container's layer is set to `--z-modal`.
- `DialogContainerComponent` renders `<div class="modal-overlay" (click)="onScrim($event)"><div class="modal-content card" [class.modal-md] [class.modal-lg]><ng-template cdkPortalOutlet></ng-template></div></div>`, overrides the host bindings for `role`, `aria-labelledby`, `aria-describedby` and `aria-busy` from signals, handles `keydown.escape` on its host, and performs the variant's initial focus in `afterNextRender` once the shell has registered.
- `DialogComponent` injects `DialogContainerComponent` and `DialogRef`; on init it registers `variant`, `size`, the title and body ids and `busy` with the container, and renders `.modal-header` (viewer) or the bare `<h3>`, `.modal-body` and, when the actions slot has content, `.modal-actions`. One `<ng-template>` holds the projected content.
- The scrim handler acts only when `event.target` is the `.modal-overlay` itself, the variant is viewer and `busy` is false.
- Composes [icon button](icon-button.md) for the close control. [Button](button.md), [form field](form-field.md), [list item](list-item.md) and [badge](badge.md) are projected by consumers.

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Does every dialog have a close button in its title area, as L2-REQ-064 AC2 says?* No. The design-system page and the dialogs pattern require a close control only on viewers and detail dialogs; confirm and form dialogs close through Cancel, which every one of them has, and the admin mocks render them that way. Two close paths side by side would invite a misclick for the audience. L2-REQ-064 AC2 needs an `engineering-requirements` review to say "viewers"; until then the CRD follows the design system.
- **D-5** *Does the surface have a shadow, as L2-REQ-064 AC1 says?* No. No mock stylesheet gives `.modal-content` a shadow and the design-system page lists no elevation token for it; the scrim separates the surface from the page. L2-REQ-064 AC1 should drop "and a shadow" in the same review as D-4.
- **D-6** *Does a scrim click close the dialog?* Only a viewer. The design-system page allows a scrim click to close a viewer and forbids it from confirming or submitting; confirm and form dialogs ignore it so an accidental tap beside a phone-width surface cannot discard typed input or dismiss a decision, and Cancel remains the one way out.
- **D-7** *How are dialogs stacked and where is the scrim?* Each open dialog's CDK container draws its own `.modal-overlay` scrim with `hasBackdrop: false`, so the design-system ancestry `.modal-overlay > .modal-content` holds for e2e page objects and a second dialog's scrim darkens the first by DOM order, as the design-system page describes. One level of stacking (asset delete over asset detail) is the maximum; the service does not refuse a third, but no feature may open one.
- **D-8** *Which heading level is the title?* Always `<h3>`. The design system and components.css style `.modal-content h3`; the admin maintenance create mock's `<h2>` is drift. The dialog is named by `aria-labelledby`, so the level does not affect its accessible name, and a fixed level keeps the page outline stable.
- **D-9** *How does the confirm variant get its description?* The shell wraps the projected body in `<div class="modal-body">` with a generated id and points `aria-describedby` at it. The design-system example puts the id on the `<p>` itself, which the shell cannot reach inside projected content; the wrapper has no styles and does not alter the card's `h3` and `p` rules.
- **D-10** *Does `closed` fire for Cancel and the committing action?* No. Those are the consumer's buttons and they close the `DialogRef` with their own result (`false`, `true`, the created record); `closed` reports only the shell's own paths (Escape, scrim, close control), so a consumer handles each exit once.
- **D-11** *Is there an entrance animation?* No. The mocks show none and the design-system page says a fade may be added only if removed under reduced motion; without one there is nothing to remove, the open is instant for the audience and layout stability holds.
- **D-12** *Where does focus go when the trigger was removed?* To the page's `<h1>` inside `main`. The design-system page says "the nearest sensible heading"; the page heading always exists (accessibility foundation: exactly one `h1` per page) and the service gives it `tabindex="-1"` when needed.
- **D-13** *What does `busy` lock?* The dialog's own close paths and the close control. The design-system busy specimen disables the buttons and offers no way to close during an upload; the consumer disables its buttons through the button API so the lock is complete without the dialog reaching into projected content.
- **D-14** *Is the public profile switcher a dialog?* Yes, a `viewer` at `sm`. The dialogs pattern lists "Choose between profiles" as a dialog with the profile switcher as its instance, while the mock expands an inline options list under the trigger; the design system is the agreed reference and the inline list is drift, so the CRD specifies the dialog and the feature's list items go in the body slot.
- **D-15** *Does Escape on a form with typed input ask before discarding?* No. It closes as Cancel does. No mock has a discard prompt, the one permitted stacking level is reserved for the asset delete confirm, and a confirm-on-cancel would be a new behaviour the product has not asked for.
- **D-16** *What happens when three action labels do not fit at 320 px?* The row wraps. With equal shares alone the asset detail actions ("Delete", "Download", "Close") clip "Close" inside a 288 px surface, which the rendering showed; the dialogs pattern only asks for one-word labels, and that is not enough. The row keeps equal shares and adds `flex-wrap: wrap` with `min-width: max-content` on each button, so two-button rows are unchanged and a third button drops to a full-width second row. components.css needs the same rule; until then the component's stylesheet carries it.
