# Table

| Field | Value |
|---|---|
| Selector | `coop-table` |
| Library path | `frontend/projects/components/src/lib/table/` |
| Status | planned |
| Traces to | L2-REQ-001, L2-REQ-002, L2-REQ-003, L2-REQ-013, L2-REQ-043, L2-REQ-044, L2-REQ-057 |
| Design system | [`table.html`](../../design-system/components/table.html) |
| Source mocks | [`pages/admin-users/default`](../../mocks/pages/admin-users/default.html), [`pages/admin-users/page-2`](../../mocks/pages/admin-users/page-2.html), [`pages/admin-users/empty`](../../mocks/pages/admin-users/empty.html), [`pages/admin-users/no-results`](../../mocks/pages/admin-users/no-results.html), [`pages/admin-invitations/default`](../../mocks/pages/admin-invitations/default.html), [`pages/admin-invitations/empty`](../../mocks/pages/admin-invitations/empty.html), [`pages/admin-roles/default`](../../mocks/pages/admin-roles/default.html), [`pages/admin-roles/no-privileges`](../../mocks/pages/admin-roles/no-privileges.html), [`dialogs/admin-user-edit/default`](../../mocks/dialogs/admin-user-edit/default.html) |
| Rendering | [`table.html`](table.html) |

## Purpose and scope

A table lists records of the same kind, one per row, with the same attribute in every column, so an administrator can scan, compare and manage them: the Users table (username, roles, status, edit and delete), the Invitations table (token, type, expiry, status) and the privileges grid on the Roles page. It is a static data table on a card: a visually hidden caption, a header row, body rows whose cells hold text, a [badge](badge.md), an avatar with a name, [icon buttons](icon-button.md) or a [checkbox](checkbox.md), and an optional footer that holds [pagination](pagination.md).

Use something else instead when:

- the rows are chosen from or read as a sequence (conversations, profiles, notices, assets): [list item](list-item.md);
- each entry needs a title and a paragraph of its own (documents, maintenance requests): [card](card.md);
- the facts belong to one record: [description list](description-list.md).

Out of scope:

- Sorting, row selection, sticky headers, column resizing, row expansion and loading skeletons. The design system states none is implemented; the page shows a [spinner](spinner.md) while rows load.
- Paging logic and the "Showing 1-2 of 4 users" summary. [Pagination](pagination.md) owns them; this component only places the footer.
- What a row action does. The consumer binds `(click)` on its own icon buttons; confirmation is the [dialog](dialog.md)'s.
- Checkbox state in the privileges grid. [Checkbox](checkbox.md) owns it; the table only lays the cells out.

## Usage

Every table in `docs/mocks` (the users table on 4 admin-users states and behind 3 user dialogs, the invitations table on 2 states and behind 2 invitation dialogs, the privileges table on 3 roles states) is one of the configurations below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/admin-users/*`, behind `dialogs/admin-user-create`, `admin-user-edit`, `admin-user-delete` | `caption="Users"`, `columns` Username, Role, Status, Actions; footer pagination | user cell (avatar "M" + "mira.fern"), "Member", success badge "Active", icon buttons "Edit mira.fern" and "Delete mira.fern" | default, row hover, empty "No users found" (`empty`, `no-results`), page 2 | canvas, on the card |
| `pages/admin-invitations/*`, behind `dialogs/admin-invitation-create`, `admin-invitation-created` | `caption="Invitations"`, `columns` Token, Type, Expires, Status; no footer | "fictional-invite-0", "Member" / "Board Member" / "Staff", "Nov 13, 2026", badges Active (success), Expired (danger), Used (gray) | default, empty "No invitations found" | canvas, on the card |
| `pages/admin-roles/*` privileges panel | `frameless`, `caption="SystemAdministrator privileges"`, `columns` Aggregate, Read, Write, Create, Delete; no footer | "User", "MaintenanceRequest", "Document", "Profile"; one checkbox per privilege cell named "Read User", "Write User", … | default, checked, empty "No privileges assigned" (`no-privileges`) | the privileges panel card |

Every row is buildable with the API below: a caption, a list of column headings, projected rows, an empty message, a footer slot and a frameless mode for a table that already sits in a card.

## Anatomy

1. **Card** — `.card.table-card`. The design-system card with no padding, so the header row follows the rounded corners. Omitted when `frameless`.
2. **Scroll region** — `.table-scroll`. Wraps the table only; `overflow-x: auto`, `tabindex="0"`, `role="region"`, `aria-label` equal to the caption. It is the element that scrolls when the columns do not fit (D-4, D-5).
3. **Table** — `table.table`. Full width, collapsed borders, `--text-body-sm`.
4. **Caption** — `caption`. The caption text; visually hidden by `.table caption`, announced by screen readers.
5. **Header row** — `thead > tr > th[scope="col"]`, one per entry of `columns`. `--color-bg-subtle` fill, `--color-fg-muted` `--text-label` text, hairline below.
6. **Body rows** — `tbody > tr > td`, projected by the consumer. Hairline between rows, none after the last; cells vertically centred.
7. **User cell** — `.user-cell` inside a `td`: a `coop-avatar` (`size="sm"`, decorative) and the username, `--space-3` apart.
8. **Badge cell** — a `td` holding one `coop-badge`.
9. **Actions cell** — a `td` holding one or more `coop-icon-button`s, each named "Verb subject", `--space-1` apart.
10. **Checkbox cell** — a `td` holding one `coop-checkbox` whose label is the column heading and the row's subject ("Read User").
11. **Empty row** — `tbody > tr > td[colspan]` holding `.empty-state` (icon + `empty` text); replaces the projected rows when `empty` is set.
12. **Footer** — the `[slot=footer]` content, rendered inside the card after the scroll region: the page's `coop-pagination`.

Host: `coop-table` is `display: block` and carries no classes. The card, scroll region, table, caption and header row are rendered by the component; the consumer projects `<tr>` rows (and the footer) and composes [avatar](avatar.md), [badge](badge.md), [icon button](icon-button.md) and [checkbox](checkbox.md) inside its cells.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `caption` | `string` | — | yes | Rendered as the `<caption>` and as the scroll region's `aria-label`. A noun naming the data: "Users", "Invitations". |
| `columns` | `readonly string[]` | — | yes | One `th[scope="col"]` per entry, in order. The empty row's `colspan` is `columns.length`. |
| `empty` | `string \| null` | `null` | no | When set, the body renders one row with `.empty-state` and this text instead of the projected rows ("No users found"). |
| `emptyIcon` | `string` | `'inbox'` | no | Material Icons name shown above the empty text, `aria-hidden="true"`; the users table passes `people`. |
| `frameless` | `boolean` | `false` | no | Omits `.card.table-card` so a table inside another card (the privileges panel) does not draw a second frame. The scroll region and footer stay. |

Booleans accept bare attributes (`booleanAttribute`). All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | Rows are not interactive. The consumer binds `(click)` on the icon buttons and `(checkedChange)` on the checkboxes it projects. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | `<tr>` elements, each holding `<td>` cells in `columns` order | Projected into `<tbody>`. Not rendered while `empty` is set. One cell per column; the first cell identifies the row. |
| `[slot=footer]` | `coop-pagination` or any block | Rendered once, inside the card, after the scroll region. Omitted when nothing is projected. |

Translation: `caption`, `columns`, `empty` and every cell are the consumer's strings; the component holds no copy of its own (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Framed (default) | `.card.table-card` around the region | A table that is the page's content: Users, Invitations. |
| Frameless | no card | A table inside a card that already has a header: the privileges grid. |

The design system defines one table; it varies only by the content of its cells. There are no size variants: cell padding is `--space-3` by `--space-5` and the row height follows the tallest cell (40 px icon buttons make a user row 64 px tall; text-only invitation rows are 45 px).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--color-bg-surface` rows, `--color-bg-subtle` header, `--color-border-default` hairlines | Table with caption and column headers |
| Row hover | `tbody tr:hover` | Row fill `--color-bg-subtle`; instant (no transition) | — (rows are not interactive) |
| Action focus | `:focus-visible` on a projected icon button or checkbox | Shared ring on that control, not clipped by the card | — |
| Region focus | `:focus-visible` on `.table-scroll` | Shared ring around the region | Announced as "Users, region" |
| Scrollable | region content wider than the region | The region scrolls horizontally; the page does not | Arrow keys scroll the focused region |
| Empty | `empty` set | Header row stays; one body row with the `.empty-state` icon and text; no hover | The empty text is a normal cell |
| Checked (privileges) | `coop-checkbox` checked | Checkbox's own state | Checkbox's own state |

Selection, sorting, sticky headers and loading rows are not states of this component.

## Markup

```html
<!-- rendered: users table with pagination -->
<coop-table>
  <div class="card table-card">
    <div class="table-scroll" role="region" aria-label="Users" tabindex="0">
      <table class="table">
        <caption>Users</caption>
        <thead><tr><th scope="col">Username</th><th scope="col">Role</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
        <tbody>
          <tr>
            <td><div class="user-cell"><span class="avatar avatar-sm" aria-hidden="true">M</span><span>mira.fern</span></div></td>
            <td>Member</td>
            <td><span class="badge badge-success">Active</span></td>
            <td><button class="icon-btn" type="button" aria-label="Edit mira.fern"><span class="material-icons" aria-hidden="true">edit</span></button><button class="icon-btn" type="button" aria-label="Delete mira.fern"><span class="material-icons" aria-hidden="true">delete</span></button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">…</div>
  </div>
</coop-table>
```

```html
<!-- rendered: empty body -->
<tbody><tr><td colspan="4"><div class="empty-state"><span class="material-icons" aria-hidden="true">people</span><p>No users found</p></div></td></tr></tbody>
```

```html
<!-- rendered: frameless privileges grid (inside the panel card) -->
<coop-table>
  <div class="table-scroll" role="region" aria-label="SystemAdministrator privileges" tabindex="0">
    <table class="table">
      <caption>SystemAdministrator privileges</caption>
      <thead><tr><th scope="col">Aggregate</th><th scope="col">Read</th><th scope="col">Write</th><th scope="col">Create</th><th scope="col">Delete</th></tr></thead>
      <tbody><tr><td>User</td><td><input type="checkbox" aria-label="Read User" checked></td>…</tr></tbody>
    </table>
  </div>
</coop-table>
```

The invitations table differs only in its cells (text, text, text, badge) and has no footer.

```html
<!-- consumer -->
<coop-table caption="Users" [columns]="['Username', 'Role', 'Status', 'Actions']" [empty]="users().length ? null : 'No users found'" emptyIcon="people">
  @for (user of users(); track user.id) {
    <tr>
      <td><div class="user-cell"><coop-avatar [initials]="user.initial" size="sm" /><span>{{ user.username }}</span></div></td>
      <td>{{ user.roles }}</td>
      <td><coop-badge tone="success">Active</coop-badge></td>
      <td><coop-icon-button icon="edit" [label]="'Edit ' + user.username" (click)="edit(user)" /><coop-icon-button icon="delete" [label]="'Delete ' + user.username" (click)="confirmDelete(user)" /></td>
    </tr>
  }
  <coop-pagination slot="footer" [page]="page()" [pageSize]="2" [total]="total()" noun="users" (pageChange)="load($event)" />
</coop-table>
```

The classes and attributes above are part of the contract: the e2e page objects locate the table by `.table`, its rows by `tbody tr`, cells by column index, the region by `role="region"` and its name, and the empty row by `.empty-state`.

## Design

- Card radius `--radius-lg`, hairline `--color-border-default`, no padding (`.table-card`).
- Cell padding `--space-3` by `--space-5` in header and body; header fill `--color-bg-subtle`, header text `--text-label` in `--color-fg-muted`; body text `--text-body-sm` in `--color-fg-default`.
- Row divider `--border-width-hairline` solid `--color-border-default`; none after the last row.
- User cell gap `--space-3`; icon buttons in the actions cell `--space-1` apart (accessibility foundation, touch) and the actions cell never wraps (`white-space: nowrap`), so the buttons stay on one line however narrow the column.
- Cells wrap text; nothing truncates. Badges (`white-space: nowrap`), the avatar and the icon buttons set the table's minimum width; when that exceeds the region, the region scrolls (D-4).
- Scroll region: `overflow-x: auto`, `overscroll-behavior-x: contain`. Its focus ring is the shared ring drawn inset (`outline-offset` of minus `--focus-ring-width`) so the card's rounded clipping cannot cut it; `.table-card` keeps its own `overflow-x: auto`, which never engages because the region scrolls first (D-5).
- Empty row: `.empty-state` padding `--space-12` by `--space-5`, 3rem icon, `--text-body` text.
- Motion: none. Row hover is an instant fill change (design-system page).
- Layer: none; the table sits in the flow of its surface.

Component tokens: none. The table consumes semantic tokens directly (there is no `--table-*` group in components.css) and overrides nothing per surface.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Card and row fill | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Header fill, hovered row fill | `--color-bg-subtle` | `--palette-gray-50` | `--palette-gray-50` |
| Header text, empty text | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Cell text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-900` |
| Row divider, card edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-200` |
| Focus ring (region, actions) | `--color-focus-ring` | `--palette-green-500` | `--palette-green-500` |
| Success badge fill and text | `--color-success-bg`, `--color-success-fg` | `--palette-green-100`, `--palette-green-800` | `--palette-green-100`, `--palette-green-800` |
| Danger badge fill and text | `--color-danger-bg`, `--color-danger-fg` | `--palette-red-100`, `--palette-red-800` | `--palette-red-100`, `--palette-red-800` |
| Gray badge fill and text | `--color-bg-subtle-hover`, `--color-fg-default` | `--palette-gray-200`, `--palette-gray-900` | `--palette-gray-200`, `--palette-gray-900` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Cell text |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Header text on the header fill |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Cell text on a hovered row |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Empty text |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | "Active" badge |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | "Expired" badge |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | "Used" badge |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the region and on actions |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Region ring against the page beside the card |

Dividers and the card edge are decorative and exempt from 1.4.11; the header fill and the column headings carry the structure. Under `forced-colors: active` dividers become `CanvasText` and the ring `Highlight` (tokens.css); the component adds no colour of its own.

## Responsive behaviour

- The mocks define no media rule for the table, and the design system adds none: cell padding, type and the column set are the same at every width.
- Four users columns fit side by side from about 640 px (`--layout-breakpoint-sm`). Below that the table's minimum width (avatar + username, a nowrap badge, two 40 px buttons) exceeds the card and the region scrolls horizontally inside the card. The page never scrolls sideways; the footer stays in place beneath the region (D-4, D-5).
- At 320 px and at 400 % zoom every column, every action and the footer stay reachable: by swipe, by the region's scrollbar, or by focusing the region and pressing the arrow keys. A data table is the one case WCAG 1.4.10 exempts from the no-two-dimensional-scrolling rule, so scrolling inside the card satisfies the AGENTS.md reflow requirement; no column is hidden and no row stacks (D-4).
- Text cells wrap ("Board Member", "MaintenanceRequest" wraps only at a hyphen or space, so it does not); nothing truncates.
- Targets: icon buttons are 40 px, checkboxes at least `--target-min`; rows are at least 45 px tall.

## Accessibility

### Role and pattern

A native `<table>` with `<caption>`, `<thead>`, `<tbody>` and `th[scope="col"]`; a static data table, not an ARIA grid, so there is no cell-by-cell navigation. [WAI-ARIA APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/). The scroll region is a labelled `role="region"` with `tabindex="0"` so keyboard users can scroll it (WCAG 2.1.1). Body cells are `td` (D-6).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves to the scroll region, then through the icon buttons or checkboxes row by row in DOM order, then to the footer's pagination. |
| <kbd>→</kbd> <kbd>←</kbd> (region focused) | Scrolls the region horizontally (browser default for a focused scroll container). |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates the focused icon button or toggles the focused checkbox (their own behaviour). |
| Arrow keys elsewhere | No table navigation; screen readers use their own table commands. |

### Focus

The region is always a tab stop (D-7); its ring is the shared ring (`--focus-ring-width` solid `--color-focus-ring`) drawn inset so the card does not clip it. Icon-button and checkbox rings are drawn by those components; the last column keeps `--space-5` padding so the ring of the last action is not cut by the card edge (design-system page). When a page change replaces the rows, focus stays on the pagination control that was activated; when a row is deleted, the consumer moves focus (to the next row's first action or the page heading) because the table does not know the row is gone.

### Labelling

- The caption names the table ("Users") and the same text names the region, so a screen reader hears "Users, region" and "Users, table, 4 columns, 3 rows".
- Every header cell has `scope="col"`, so cells are announced with their column: "Status, Active".
- The avatar in a user cell is decorative (`aria-hidden="true"`); the username text follows it.
- Each icon button names its verb and its row ("Edit mira.fern", "Delete mira.fern"); each privileges checkbox names the privilege and the aggregate ("Read User").
- Status is the badge's text, never colour alone.

### Announcements

None by the table. The pagination summary ("Showing 3-4 of 4 users") is [pagination](pagination.md)'s, and the result of an edit or delete is announced by the page's [alert](alert.md).

### Motion

None. Row hover changes the fill instantly; the design system sets no transition, so `prefers-reduced-motion` changes nothing.

## Content and internationalisation

- Column headings are single Title Case nouns without colons or units: "Username", "Role", "Status", "Actions", "Token", "Type", "Expires", "Aggregate", "Read".
- The caption is a plural noun, not a sentence: "Users", "Invitations", "SystemAdministrator privileges".
- The Role cell lists the user's roles as a comma-separated list in the order assigned: "Member", "Member, Board Member" (L2-REQ-013 allows several). Role and invitation type names are shown with a space ("Board Member"), as the invitations mock does (D-8).
- Status text is one Title Case word in a badge: "Active", "Expired", "Used".
- Dates are "Nov 13, 2026" (content foundation). An invitation with no expiry date reads "No expiry" (D-9).
- Empty text follows the "No things found" formula: "No users found", "No invitations found", "No privileges assigned".
- Translatable inputs: `caption`, `columns`, `empty`. Data values: usernames, tokens, role names, dates, status words (the consumer passes them already formatted).
- Long strings wrap inside their cell; a French heading about 30 % longer ("Nom d'utilisateur") wraps onto two lines in the header rather than widening the table.

## Performance

- Change detection: `OnPush`, signal inputs; the header row is a `computed` from `columns`; projected rows are the consumer's and re-render only when its data changes.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the header row renders before the rows arrive, and the empty row has the same padding as a loaded body, so switching between pages, empty and loaded changes only the body height. The scroll region reserves no scrollbar height; a horizontal scrollbar appears below the rows only when needed.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK, no table library. Composes nothing itself; avatar, badge, icon button, checkbox and pagination are projected by the consumer.

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-table caption="Users" [columns]="['Username', 'Role', 'Status', 'Actions']">` with two projected rows, when it renders, then the DOM holds `.card.table-card > .table-scroll[role="region"][aria-label="Users"][tabindex="0"] > table.table` with a visually hidden `<caption>` reading "Users" and four `th[scope="col"]` reading "Username", "Role", "Status", "Actions". (L2-REQ-001)
- **AC-2** Given the row for mira.fern, when it renders, then its first cell holds `.user-cell` with a decorative `.avatar.avatar-sm` reading "M" (`aria-hidden="true"`) followed by the text "mira.fern". (L2-REQ-001)
- **AC-3** Given a user who holds the Member and Board Member roles, when the row renders, then the Role cell reads "Member, Board Member" and a user with one role reads "Member". (L2-REQ-013)
- **AC-4** Given the row for mira.fern, when it renders, then the Actions cell holds two `.icon-btn` controls named "Edit mira.fern" and "Delete mira.fern", each 40 × 40 px and `--space-1` apart. (L2-REQ-002)
- **AC-5** Given the invitations table, when the active, expired and used invitations render, then the Status cells hold `.badge.badge-success` "Active", `.badge.badge-danger` "Expired" and `.badge.badge-gray` "Used", each conveyed by text. (L2-REQ-044)
- **AC-6** Given an invitation "fictional-invite-0" of type Member expiring on 13 November 2026, when it renders, then the Token, Type and Expires cells read "fictional-invite-0", "Member" and "Nov 13, 2026", and an invitation without an expiry reads "No expiry". (L2-REQ-043)
- **AC-7** Given `frameless` with `caption="SystemAdministrator privileges"` and columns Aggregate, Read, Write, Create, Delete, when it renders inside the privileges panel card, then no `.card` wraps the region, the first cell of the first row reads "User" and the checkbox in its Read cell is named "Read User". (L2-REQ-013)

### States

- **AC-8** Given the pointer over tavi.moss's row, when the row is hovered, then its fill is `--color-bg-subtle`, the row is not focusable and nothing else changes. (L2-REQ-002)
- **AC-9** Given `empty="No users found"` and `emptyIcon="people"`, when it renders, then the header row stays, `tbody` holds exactly one row with `td[colspan="4"] > .empty-state` containing an `aria-hidden` "people" icon and the text "No users found", and no projected row is rendered. (L2-REQ-057)
- **AC-10** Given a `coop-pagination` projected with `slot="footer"` reading "Showing 1-2 of 4 users", when it renders, then it appears inside the card below `.table-scroll` and outside it, and stays in place when the region is scrolled sideways. (L2-REQ-057)
- **AC-11** Given page 1 showing mira.fern and tavi.moss, when the consumer replaces the rows with page 2 (neri.vale and oren.reed), then only the `tbody` rows change, the caption and header row are not re-created, and focus stays on the pagination control that was activated. (L2-REQ-057)

### Keyboard and focus

- **AC-12** Given the users table at 320 px where the region overflows, when <kbd>Tab</kbd> reaches the region, then it takes focus, shows the shared ring unclipped, and <kbd>→</kbd> scrolls the region so the Actions column comes into view. (L2-REQ-002)
- **AC-13** Given focus on the region, when <kbd>Tab</kbd> is pressed repeatedly, then focus moves to "Edit mira.fern", "Delete mira.fern", "Edit tavi.moss", "Delete tavi.moss" and then to the pagination's "Previous page" control, in that order. (L2-REQ-002)
- **AC-14** Given focus on "Delete mira.fern", when <kbd>Enter</kbd> is pressed, then the consumer's `(click)` handler on that icon button fires exactly once and the row itself emits nothing. (L2-REQ-003)

### Screen readers

- **AC-15** Given a screen reader reading the users table in table mode, when it reaches the Status cell of mira.fern's row, then it announces the column header "Status" with the cell text "Active". (L2-REQ-001)
- **AC-16** Given the privileges grid, when a screen reader reads the Read cell of the MaintenanceRequest row, then the checkbox is announced as "Read MaintenanceRequest, checkbox, checked". (L2-REQ-013)

### Theming

- **AC-17** Given the users table, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-001)

### Responsive

- **AC-18** Given the users table at 320 px, when measured, then `document.documentElement.scrollWidth` equals the viewport width, `.table-scroll` scrolls horizontally, and all four columns and both action buttons of every row can be brought into view and operated. (L2-REQ-002)
- **AC-19** Given the invitations table at 768 px, when measured, then the region does not scroll, "Board Member" and "Nov 13, 2026" stay on one line, and the four columns share the card width. (L2-REQ-043)

### Performance

- **AC-20** Given a users table with two rows, when an unrelated input on the page changes, then the table does not re-render (`OnPush` with signal inputs), and a `columns` change re-renders only the header row. (L2-REQ-057)

## Implementation notes

- Folder `frontend/projects/components/src/lib/table/`: `table.component.ts`, `table.component.html`, `table.component.css`; export from `public-api.ts`. No separate types: `columns` is `readonly string[]`.
- Template: `@if (!frameless()) { <div class="card table-card">…</div> } @else { … }` sharing one `<ng-template>` that holds the region, table and footer `ng-content`, so each slot is declared once.
- `.table-scroll` is a new class: add it to `components.css` next to `.table-card` (`overflow-x: auto`), and move the card's clipping off the region axis so the region's focus ring is visible (D-5). Until then the rendering page carries it as a specimen-only style.
- The empty row is `@if (empty()) { <tr><td [attr.colspan]="columns().length"><div class="empty-state">…</div></td></tr> } @else { <ng-content /> }`.
- No CDK primitive (no `CdkTable`; the DOM is a plain table so the e2e page objects and mocks match). Composes nothing; [pagination](pagination.md), [avatar](avatar.md), [badge](badge.md), [icon button](icon-button.md) and [checkbox](checkbox.md) are projected by the consumer.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *What happens at 320 px: scroll inside the card, a sticky first column, or stacked rows?* The table scrolls horizontally inside a keyboard-focusable, labelled region in its card; no column is pinned and no row stacks. The design-system page requires the in-card scroll region; a sticky username column would take almost half of a 320 px viewport and still could not keep the Actions column visible, so it would help neither the person nor the reflow rule; stacking rows would turn a comparison table into a list, which the list item already is. WCAG 1.4.10 exempts data tables from the two-dimensional-scrolling rule, so the page itself never scrolls sideways and the AGENTS.md reflow requirement is met with every column and action reachable.
- **D-5** *Which element scrolls?* A `.table-scroll` region around the table only, not `.table-card`. The design-system anatomy places pagination inside the card beneath the table; if the card scrolled, the footer would scroll with the rows and be hidden off-screen. The class is new and must be added to `components.css`.
- **D-6** *Are the identifying cells `th scope="row"`?* No, every body cell is a `td`. `.table th` gives header cells the subtle fill and muted text, which no design-system specimen shows on a body row; the column headers plus the "Verb subject" action names already tie each cell to its row.
- **D-7** *Is the region focusable only when it overflows?* No, always. Measuring overflow on every resize adds code for an uncertain gain; a predictable, named tab stop ("Users, region") on every width is simpler for the keyboard users this product serves and costs one extra <kbd>Tab</kbd>.
- **D-8** *How are role and invitation types spelled?* With a space between words: "Board Member". The invitations mock already does; the roles column follows it. Several roles are comma-separated in the order assigned.
- **D-9** *What does the Expires cell show for an invitation without an expiry?* "No expiry". L2-REQ-043 makes the expiry optional and the mocks always show a date; a blank cell would read as missing data (content foundation: never leave a row blank).
- **D-10** *Does the table render the `.user-avatar` colours, `.token-cell` and `.privileges-table` classes from the mocks?* No. The design system replaced per-user avatar colours with the single accent avatar and names the table `.table`; the token is plain text in a `td` and the privileges grid is the same `.table` in frameless mode.
- **D-11** *What does an empty table show?* One body row holding the empty state ("No users found", "No invitations found", "No privileges assigned") under the header row, from the `empty` input. The mocks leave `tbody` blank (the roles mock omits it entirely); the design-system page requires the empty state so the table is never silently blank, and the header row stays so the person still sees what the table lists.
