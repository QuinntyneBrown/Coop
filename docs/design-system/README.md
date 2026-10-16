# Coop design system

Extracted from [docs/mocks](../mocks/README.md) on 13 October 2026. Open [index.html](index.html) locally.

**Scope.** This system documents only what the implemented apps do. It has one light appearance, no dark
theme, and no components, states or breakpoints that the mocks do not show. Where the mocks fall short of
WCAG 2.2 AA, the page states the system's requirement and the difference is logged below. The mocks
themselves stay verbatim.

## Foundations

| Page | Covers |
|---|---|
| [Color](foundations/color.html) | Palette, semantic roles, status colours and every checked contrast pair. |
| [Typography](foundations/typography.html) | Outfit, the size scale, weights and text roles. |
| [Spacing](foundations/spacing.html) | The 4px scale and the inside and between rules. |
| [Layout](foundations/layout.html) | Breakpoints, sidebar and dialog widths, and the app shells. |
| [Elevation](foundations/elevation.html) | Three shadows and the z-order layers. |
| [Shape](foundations/shape.html) | Radii and border widths. |
| [Motion](foundations/motion.html) | Durations, easing and the spinner. |
| [Iconography](foundations/iconography.html) | The Material Icons the product uses and how to label them. |
| [Theming](foundations/theming.html) | Token tiers, component tokens and tokens.json. Light only. |
| [Responsive](foundations/responsive.html) | What the product does at 640, 768 and 1024 pixels. |
| [Accessibility](foundations/accessibility.html) | WCAG 2.2 AA commitments and the gaps found in the mocks. |
| [Content](foundations/content.html) | Voice, casing and the product's real microcopy. |

## Components

| Component | Variants | States | Source mocks |
|---|---|---|---|
| [Button](components/button.html) | Primary, secondary, outline, danger, sign out; small, default, large, block | default, hover, focus, active, disabled, busy | pages/public-login, dialogs/admin-user-delete |
| [Icon button](components/icon-button.html) | Icon only | default, hover, focus, active, disabled | pages/admin-users, pages/public-dashboard |
| [Form field](components/form-field.html) | Text, password, select, textarea; hint; row | default, focus, invalid, disabled, read-only | pages/public-register, dialogs/admin-user-create |
| [Checkbox](components/checkbox.html) | Labelled checkbox, role privilege toggle | default, focus, checked, disabled | pages/admin-roles, pages/public-register |
| [Search bar](components/search-bar.html) | Search bar with icon | default, focus-within | pages/admin-documents, pages/admin-messaging |
| [Sidebar navigation](components/sidebar.html) | Admin sidebar, public drawer | default, hover, focus, current | pages/admin-dashboard, pages/public-dashboard |
| [Top bar](components/top-bar.html) | Admin top bar, public top bar | default | pages/public-dashboard, pages/admin-dashboard |
| [Bottom tab bar](components/bottom-tab-bar.html) | Phone navigation | default, hover, focus, current | pages/public-dashboard |
| [Tabs](components/tabs.html) | Segmented tab buttons | default, hover, focus, selected | pages/admin-settings, pages/admin-maintenance |
| [Filter chips](components/filter-chips.html) | Filter buttons, filter tabs | default, hover, focus, pressed | pages/public-maintenance, pages/public-documents |
| [Pagination](components/pagination.html) | Page buttons with count | default, hover, focus, current, disabled | pages/admin-users |
| [Stepper](components/stepper.html) | Step dots | default, current, completed | pages/public-onboarding, pages/admin-onboarding |
| [Card](components/card.html) | Static, interactive, quick action | default, hover, focus, selected | pages/public-maintenance, pages/public-dashboard |
| [Dialog](components/dialog.html) | Confirm, form, viewer, detail | default, invalid, stacked | dialogs/* |
| [Table](components/table.html) | Table card with header row | default, row hover | pages/admin-users |
| [List item](components/list-item.html) | Conversation, profile, notice, asset | default, hover, focus, selected | pages/admin-profiles, pages/admin-messaging |
| [Description list](components/description-list.html) | Label and value rows | default | dialogs/admin-asset-detail |
| [Avatar](components/avatar.html) | Initials; small and large | default | pages/admin-users, pages/admin-profile |
| [Badge](components/badge.html) | Neutral, success, info, warning, danger | default | pages/admin-users, pages/public-maintenance |
| [Metric card](components/metric-card.html) | Icon, label and count | default | pages/public-dashboard, pages/admin-dashboard |
| [Alert](components/alert.html) | Success, danger, form error | default | notifications/* |
| [Empty state](components/empty-state.html) | Icon and message | default | pages/public-maintenance, pages/admin-assets |
| [Spinner](components/spinner.html) | Page spinner | spinning | pages/*/loading.html |

## Patterns

| Pattern | Covers |
|---|---|
| [Forms](patterns/forms.html) | Label above field, errors under the field, button row. |
| [Dialogs](patterns/dialogs.html) | When to open a dialog, confirm and form shapes, stacked overlays. |
| [Navigation and app shell](patterns/navigation.html) | Admin and public app shells, drawer and tab bar. |
| [Feedback and empty states](patterns/feedback.html) | Success alerts, field errors, empty states and loading. |

## Tokens

- `tokens/tokens.css`: source of truth for colour, type, space, shape, elevation, motion, layout and z-order.
- `tokens/tokens.json`: DTCG export generated from `tokens.css` with `tokens_to_json.py`.
- `tokens/contrast-pairs.json`: every foreground and background pairing the components use, checked by `check_contrast.py`.
- `assets/components.css`: component styles. Class names match the implemented apps.

## Drift found in the mocks

| Where | Issue | Resolution |
|---|---|---|
| Public and admin CSS | Public CSS uses tokens (var(--primary)); admin CSS repeats the same values as literals. | One token set; component classes read tokens only. |
| Buttons, nav, avatars | White text on #3D8A5A is 4.22:1, below the 4.5:1 AA minimum for normal text. The active tab label #3D8A5A on the page canvas is 3.83:1. | Accent is #2D6B44 (6.4:1). #3D8A5A stays as --color-brand for logo and decorative marks. |
| Danger colour | Two reds: #DC2626 in tokens and rgb(220, 53, 69) in 19 places. The sign-out label on its hover tint is 4.14:1. | One red, #DC2626 for fills and borders; #991B1B for text (--color-danger-fg). |
| Success and warning tints | Badges use 10% alpha tints and status badges use solid tints. Text on the 10% tints measures 3.27:1 (info), 2.86:1 (warning), 3.33:1 (success) and 3.93:1 (danger). | One set of status tints per tone. Text uses the 800/700 shades and passes 4.5:1. |
| Priority badge 'low' | Single-use indigo (#E0E7FF, #3730A3). Purple #8B5CF6 appears once, in one stylesheet. | Mapped to the info tone. No indigo or purple in the system. |
| Secondary text | rgba(26, 25, 24, 0.8) used 57 times; its contrast changes with the surface behind it. | --color-fg-muted (#5A5853, 7.1:1 on white). |
| Spacing | 10px (47 uses), 14px (38), 6px (26), 2px (11) are off the 4px grid. | Snapped to 8, 12, 16, 8 and 4 respectively; scale in tokens. |
| Font sizes | 10, 11, 13, 15, 22px outside a scale; 11px tab labels. | 12, 14, 16, 18, 20, 24px. Nothing below 12px. |
| Radii | 3, 6, 10, 14, 20px and 50% alongside the 8, 12, 16 tokens. | Six radii: 4, 8, 12, 16, 24 and full. |
| Focus indicator | Inputs set outline: none and change border colour only; a 10% green ring on some. | A 2px solid outline with 2px offset on every control (3.83:1 or better against the page and cards). |
| Dialogs | No focus trap, inert page, Escape handling or aria-modal in the source. | Documented as requirements on the dialog page. Not implemented in the mocks. |
| Live regions | Success and error messages have no role=status or role=alert. | Documented as requirements on the alert page. |
| Document structure | Pages with two h1 elements: admin-dashboard default, empty and partial, and the admin-dashboard-unread notification. | Fixed: the admin dashboard top bar was removed (#155), leaving the greeting as the one h1. |
| User avatars | Initials sit on arbitrary inline colours. White on amber is 2.15:1 and white on blue is 3.68:1. | One accent background for all avatars. |
| Class names | Standalone .error-message and the field-level .form-group .error-message share a name. | Block form renamed .error-message-block; field form is .field-error. |
| Dark theme | None implemented (docs/mocks/README.md). | Not specified. Light only. |

## Verification

Run on 13 October 2026 from the repository root.

| Check | Result |
|---|---|
| `check_contrast.py docs/design-system/tokens/tokens.css` | 45 pairs pass, 0 fail (light theme) |
| `check_design_system.py docs/design-system` | 40 pages (23 components, 4 patterns), 0 errors, 0 warnings |
| `tokens_to_json.py` | 138 tokens exported to `tokens/tokens.json` |
| Horizontal overflow scan, 360 and 1280 px, all 40 pages | None. Tables and anatomy figures scroll inside their own frames |
| Screenshot review at 360 and 1280 px | Index, button, dialog, table, color and sidebar reviewed. Fonts, focus rings and dialog demos render correctly |
| `check_mocks.py docs/mocks` | 4 errors, all existing: a second `h1` on three admin-dashboard states and the admin-dashboard-unread notification. Fixed later by removing the admin dashboard top bar (#155) |

**Not done.** The mocks are not linked to `tokens.css` or `components.css`. They stay verbatim captures of the
implementation, so the differences between them and the system are the drift table above.
The Angular `components` library still does not use these tokens or classes.
No dark theme exists in the product, so none is specified or tested. Keyboard behaviour on the pages is
documented as requirements where the mocks lack it (dialog focus trap, tab roles, drawer escape). It has not
been tested in a running app.
