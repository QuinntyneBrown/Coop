# Component requirements documents

One CRD per design-system component: a Markdown file with the requirements and
Given/When/Then acceptance criteria, and an HTML file that renders every
variant, size and state with the real design-system stylesheets. Written with
the `writing-component-requirements-documents` skill on 13 October 2026 from
[`docs/design-system`](../../design-system/README.md), [`docs/mocks`](../../mocks/README.md)
and [`L2.md`](../L2.md).

Check them with:

```sh
python .claude/skills/writing-component-requirements-documents/scripts/check_crds.py docs/specs/components
```

All components are `planned`: the Angular `components` library is still a
scaffold. Every CRD assumes the selector prefix `coop-` (see shared decisions).

| Component | Selector | Status | Criteria | Traces to | Files | Design system |
|---|---|---|---|---|---|---|
| Alert | `coop-alert` | planned | 19 | L2-REQ-004, 007, 015, 045, 059, 063 | [alert.md](alert.md) · [alert.html](alert.html) | [alert](../../design-system/components/alert.html) |
| Avatar | `coop-avatar` | planned | 16 | L2-REQ-014, 016, 070, 071 | [avatar.md](avatar.md) · [avatar.html](avatar.html) | [avatar](../../design-system/components/avatar.html) |
| Badge | `coop-badge` | planned | 20 | L2-REQ-025, 032, 038, 044, 062 | [badge.md](badge.md) · [badge.html](badge.html) | [badge](../../design-system/components/badge.html) |
| Bottom tab bar | `coop-bottom-tab-bar` | planned | 18 | L2-REQ-053, 054, 067, 076 | [bottom-tab-bar.md](bottom-tab-bar.md) · [bottom-tab-bar.html](bottom-tab-bar.html) | [bottom-tab-bar](../../design-system/components/bottom-tab-bar.html) |
| Button | `coop-button` | planned | 25 | L2-REQ-060, 064, 066, 068, 069, 076, 077 | [button.md](button.md) · [button.html](button.html) | [button](../../design-system/components/button.html) |
| Card | `coop-card` | planned | 27 | L2-REQ-030, 035, 054, 065, 070, 071, 076 | [card.md](card.md) · [card.html](card.html) | [card](../../design-system/components/card.html) |
| Checkbox | `coop-checkbox` | planned | 21 | L2-REQ-011, 061, 076, 077 | [checkbox.md](checkbox.md) · [checkbox.html](checkbox.html) | [checkbox](../../design-system/components/checkbox.html) |
| Description list | `coop-description-list` | planned | 13 | L2-REQ-014, 021, 022, 023, 024, 040, 041 | [description-list.md](description-list.md) · [description-list.html](description-list.html) | [description-list](../../design-system/components/description-list.html) |
| Dialog | `coop-dialog`, `coop-dialog-container` | planned | 31 | L2-REQ-001, 003, 018, 021, 034, 035, 042, 043, 064 | [dialog.md](dialog.md) · [dialog.html](dialog.html) | [dialog](../../design-system/components/dialog.html) |
| Empty state | `coop-empty-state` | planned | 14 | L2-REQ-030, 035, 036, 041 | [empty-state.md](empty-state.md) · [empty-state.html](empty-state.html) | [empty-state](../../design-system/components/empty-state.html) |
| Filter chips | `coop-filter-chips`, `coop-filter-chip` | planned | 22 | L2-REQ-025, 030, 035 | [filter-chips.md](filter-chips.md) · [filter-chips.html](filter-chips.html) | [filter-chips](../../design-system/components/filter-chips.html) |
| Form field | `coop-form-field`, `coopInput` | planned | 27 | L2-REQ-004, 014, 021, 040, 043, 059, 061, 075, 076, 077 | [form-field.md](form-field.md) · [form-field.html](form-field.html) | [form-field](../../design-system/components/form-field.html) |
| Icon button | `coop-icon-button` | planned | 25 | L2-REQ-002, 003, 016, 034, 038, 064, 067 | [icon-button.md](icon-button.md) · [icon-button.html](icon-button.html) | [icon-button](../../design-system/components/icon-button.html) |
| List item | `coop-list-item` | planned | 20 | L2-REQ-019, 035, 036, 037, 038, 041 | [list-item.md](list-item.md) · [list-item.html](list-item.html) | [list-item](../../design-system/components/list-item.html) |
| Metric card | `coop-metric-card` | planned | 15 | L2-REQ-030, 035, 038, 054 | [metric-card.md](metric-card.md) · [metric-card.html](metric-card.html) | [metric-card](../../design-system/components/metric-card.html) |
| Pagination | `coop-pagination` | planned | 22 | L2-REQ-057 | [pagination.md](pagination.md) · [pagination.html](pagination.html) | [pagination](../../design-system/components/pagination.html) |
| Search bar | `coop-search-bar` | planned | 17 | L2-REQ-035, 036, 041, 057, 065 | [search-bar.md](search-bar.md) · [search-bar.html](search-bar.html) | [search-bar](../../design-system/components/search-bar.html) |
| Sidebar | `coop-sidebar` | planned | 24 | L2-REQ-018, 054, 066, 067 | [sidebar.md](sidebar.md) · [sidebar.html](sidebar.html) | [sidebar](../../design-system/components/sidebar.html) |
| Spinner | `coop-spinner` | planned | 10 | L2-REQ-030, 035, 036 | [spinner.md](spinner.md) · [spinner.html](spinner.html) | [spinner](../../design-system/components/spinner.html) |
| Stepper | `coop-stepper` | planned | 16 | L2-REQ-014 | [stepper.md](stepper.md) · [stepper.html](stepper.html) | [stepper](../../design-system/components/stepper.html) |
| Table | `coop-table` | planned | 20 | L2-REQ-001, 002, 003, 013, 043, 044, 057 | [table.md](table.md) · [table.html](table.html) | [table](../../design-system/components/table.html) |
| Tabs | `coop-tabs`, `coop-tab` | planned | 23 | L2-REQ-028, 045, 046 | [tabs.md](tabs.md) · [tabs.html](tabs.html) | [tabs](../../design-system/components/tabs.html) |
| Top bar | `coop-top-bar` | planned | 23 | L2-REQ-038, 054, 066, 067 | [top-bar.md](top-bar.md) · [top-bar.html](top-bar.html) | [top-bar](../../design-system/components/top-bar.html) |

## Shared decisions

Every CRD records these as D-1 to D-3 before its own decisions.

- **Selector prefix `coop-`.** The `lib` prefix in `frontend/angular.json` and
  the components ESLint config is the Angular generator default. The first
  implementation slice changes both to `coop`.
- **Light appearance only.** The design system defines no dark theme, so each
  rendering's dark block shows the same light tokens and the Colour tables
  repeat the light primitive in the Dark column.
- **No perf-test scenario.** The workspace has no perf-test project; the
  Performance sections specify change detection, layout stability and weight.

Cross-cutting rules (320 px reflow, 400 % zoom, keyboard and focus, live
regions, translation) have no L2 requirement of their own. The CRDs state them
as design-system requirements without acceptance criteria and trace a criterion
only where a functional L2 requirement is the reason.

## Follow-ups the CRDs surfaced

Each is recorded as a decision in the CRD named; the CRD follows the design
system until the upstream artefact changes.

| Where | Finding | Upstream change |
|---|---|---|
| L2-REQ-060 AC1, AC5 ([button](button.md) D-4) | AC1 names the mocks' brand-green fill that the design system replaced for 4.5:1 contrast; AC5 asks for a Ghost variant no mock or design-system page defines | `engineering-requirements` update |
| L2-REQ-063 ([alert](alert.md) D-4) | Describes toasts with an accent bar or icon; the product has inline alerts with no auto-dismiss. The CRD adds `dismissible` to meet AC2 | `engineering-requirements` review |
| L2-REQ-064 AC1, AC2 ([dialog](dialog.md) D-4, D-5) | Asks for a surface shadow and a close button on every dialog; the design system has no shadow and a close control on viewers only | `engineering-requirements` review |
| L2-REQ-066/067 ([top bar](top-bar.md) D-7) | CMS navigation links and "Member Login" are not in any mock (the landing bars show "Sign In" and "Get Started") | L2 or mock update |
| L2-REQ-071 AC1 ([card](card.md) D-13, [avatar](avatar.md) D-14) | Single-column board cards at XS/SM versus the landing mocks' two columns at 640 px; the card renders in both | Product decision, then mock |
| L2-REQ-025 ([filter chips](filter-chips.md) D-13) | Public maintenance chips say "Done" and omit "Received"; admin and L2 say "Received" and "Completed" | Page copy or L2 |
| L2-REQ-061 AC3 ([form field](form-field.md) D-7) | Asks for a chevron on selects; the native control's chevron satisfies it | None needed; noted |
| Design system [form-field](../../design-system/components/form-field.html), responsive foundation ([form field](form-field.md) D-8) | `.form-row` never stacks in the mocks; the CRD stacks it below 640 px for 320 px reflow | Design-system page |
| Design system [list-item](../../design-system/components/list-item.html) ([list item](list-item.md) D-7) | Content section says titles truncate; `components.css` and the reflow rule say wrap | Design-system page |
| Design system [table](../../design-system/components/table.html) ([table](table.md) D-4) | "Keep username and actions visible" cannot hold at 320 px; the CRD scrolls the table inside a labelled region | Design-system page |
| Design system [pagination](../../design-system/components/pagination.html) ([pagination](pagination.md) D-8) | Summary and controls do not fit on one row below about 400 px; the CRD wraps them | Design-system page |
| Design system [search-bar](../../design-system/components/search-bar.html) ([search bar](search-bar.md) D-4) | Calls the list pages' bare search inputs form fields; the CRD treats them as search bars | Design-system page |
| Design system [avatar](../../design-system/components/avatar.html) ([avatar](avatar.md) D-4) | No image form, but L2-REQ-016 sets avatar assets; the CRD specifies `.avatar-img` | `components.css` rule |
| Design system [badge](../../design-system/components/badge.html) ([badge](badge.md) D-6) | Says count markers are unmapped while the list-item page renders the unread count as an info badge | Design-system page |
| `components.css` ([table](table.md) D-5, [list item](list-item.md) D-11, [stepper](stepper.md) D-5, [filter chips](filter-chips.md) D-6, [dialog](dialog.md) D-16, [description list](description-list.md) D-9, [spinner](spinner.md) D-5, [sidebar](sidebar.md) D-8) | Rules the CRDs require that the stylesheet lacks: `.table-scroll`, `.list-item-text`, `.step-label`, chip-row wrapping, `.modal-actions` wrapping, label width in `.info-row`, `.visually-hidden`, `.user-name` and `.user-role` | Add to `components.css` with the first slice of each component |
