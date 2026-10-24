# Coop design system

The design system for the **Coop admin site**, the back office where staff and board members of a housing co-operative for retired women look after maintenance requests, documents, members, roles, the board and the co-op's public website. Open [index.html](index.html) locally to browse it.

On 20 October 2026 this system replaced Coop's earlier one, which was extracted from both apps' mocks, used green and Outfit, and had a light theme only. The visual language (violet accent, rounded system fonts, 24–32px radii, pill buttons, stroke icons, light and dark themes) is **adopted as-is from the Shelfie design system**. Its components, examples, copy and sources were rewritten from the Coop admin mocks in [docs/mocks](../mocks/README.md) (20 pages, 19 dialogs, 9 notifications) using the `extracting-design-systems` method. The public app is out of scope.

The admin mocks in `docs/mocks` were rebuilt on this system on 20 October 2026 and load its `tokens.css` and `components.css`; they show the target design. Since 20 October 2026 the running Angular admin uses these classes, icons and dialog structure ([ADR 0009](../adr/0009-admin-loads-the-design-system.md)). Since 21 October 2026 it draws them with the Angular components in `frontend/projects/components/src/lib`, one per component with its own template and styles, and loads `tokens.css` and the library's `styles/foundations.scss` instead of `components.css` ([ADR 0010](../adr/0010-design-system-components-in-the-library.md)). Each component page names its Angular component, selector and inputs under Code. The move covered visual design and accessibility semantics; the behaviour and copy items in the [drift log](#drift-from-the-implemented-admin) are still open.

## Foundations

| Page | Covers |
|---|---|
| [Color](foundations/color.html) | Ramps, semantic roles, both themes, every contrast pair with live ratios |
| [Typography](foundations/typography.html) | Rounded system stack, nine sizes, weights, line heights, role shorthands, measure; the type-size open question |
| [Spacing](foundations/spacing.html) | 4px scale, inside vs between |
| [Layout](foundations/layout.html) | Breakpoints, 4/8/12 columns, gutters, margins, the admin shell (sidebar from 768px, tab bar below) |
| [Elevation](foundations/elevation.html) | Four shadows, surface hierarchy, z-order |
| [Shape](foundations/shape.html) | Radii (24px cards, 32px sheets, pill buttons), border widths, avatar sizes |
| [Motion](foundations/motion.html) | Durations, easings, loading loops, choreography, reduced motion |
| [Iconography](foundations/iconography.html) | 2px-stroke SVG icons, three sizes, a 30-icon sheet, the Material Icons mapping |
| [Theming](foundations/theming.html) | Light, dark, follow the device, contrast overrides, adding a theme, `tokens.json` |
| [Responsive](foundations/responsive.html) | Mobile first, reflow at 320 CSS px (400% zoom), the 768px shell switch, per-component rules |
| [Accessibility](foundations/accessibility.html) | WCAG 2.2 AA commitments for an older audience, targets, focus, what is not verified |
| [Content](foundations/content.html) | A plain, warm admin voice; casing, verbs, dates, error and empty formulas, microcopy |

## Components

| Component | Group | Variants | States | Source mocks |
|---|---|---|---|---|
| [Button](components/button.html) | Actions | primary, secondary (default), ghost, danger; leading icon; block · sm/md/lg | default, hover, focus, active, disabled, loading | admin-pages, admin-page-remove, admin-page-editor, admin-login, admin-user-delete, admin-profile, admin-settings |
| [Icon button](components/icon-button.html) | Actions | ghost, secondary, danger; optional tooltip · sm/md/lg | default, hover, focus, active, disabled, loading | admin-users, admin-documents, admin-document-viewer, admin-pages, admin-messaging |
| [Link](components/link.html) | Actions | inline, standalone, trailing icon, new tab, error-summary link | default, hover, focus, visited | admin-login, admin-dashboard, admin-pages, admin-maintenance |
| [Menu](components/menu.html) | Actions | labelled or icon trigger; button and link items; divider (core; not used in the admin yet) | trigger default, hover, focus, expanded; item hover, focus | admin-pages, admin-board, admin-dashboard (where a menu was not used) |
| [Form field](components/form-field.html) | Inputs | label, optional, help, help + error | default, hover, focus, invalid, read-only, disabled | admin-login, admin-register, admin-change-password, admin-user-create, admin-maintenance-create, editors |
| [Text field](components/text-field.html) | Inputs | text, password, date, URL, e-mail; show/hide password · sm/md/lg | default, hover, focus, invalid, read-only (saving), disabled | admin-login, admin-register, admin-change-password, admin-user-create, admin-invitation-create |
| [Search field](components/search-field.html) | Inputs | visible label, visually hidden label | empty, hover, focus, with text (clear), disabled; no-results message | admin-users, admin-documents, admin-messaging, admin-assets |
| [Textarea](components/textarea.html) | Inputs | plain, optional, with help | default, hover, focus, invalid, read-only, disabled | admin-maintenance-create, admin-content-editor, admin-page-editor |
| [Select](components/select.html) | Inputs | value chosen, "Choose…" placeholder option · md/sm | default, hover, focus, invalid, disabled | admin-user-create/edit, admin-invitation-create, admin-maintenance-create, admin-document-create, admin-settings |
| [Checkbox](components/checkbox.html) | Inputs | single, with description, required, group with indeterminate "all" | unchecked, checked, indeterminate, hover, focus, invalid, disabled | admin-login, admin-register, admin-document-create |
| [Radio group](components/radio-group.html) | Inputs | plain, card with descriptions (core; not used in the admin yet) | unchecked, checked, hover, focus, invalid, disabled | option sets from admin-document-create, admin-maintenance-create |
| [Switch](components/switch.html) | Inputs | in a table cell (privilege grid), with a label | off, on, hover, focus, disabled, not saved (reverts) | admin-roles |
| [Form layout](components/form-layout.html) | Inputs | actions row, sign-in page, form beside a preview, error summary, danger zone | default, invalid, saving, failed | admin-login, admin-register, admin-change-password, admin-user-create, admin-settings |
| [Photo picker](components/photo-picker.html) | Inputs | from the device, from the Assets library | no photo, with photo, focus, uploading, too large, wrong file, failed, disabled | admin-photo-picker, admin-director-editor, admin-profile |
| [Sidebar navigation](components/sidebar.html) | Navigation | grouped links (Dashboard, Website, Community, Operations, Access, Settings) with section headings, in `.app-shell`; member variant | default, hover, focus, current | admin-dashboard, admin-maintenance, admin-roles, admin-settings, admin-profile |
| [Top bar](components/top-bar.html) | Navigation | admin phone header (brand + My profile link); core with `.topbar__nav` | brand and avatar default, hover, focus, current | admin-dashboard, admin-maintenance, admin-profiles |
| [Tab bar](components/tab-bar.html) | Navigation | four tabs + More (opens every section in a dialog), with a count | default, hover, focus, current, More open | admin-dashboard, admin-maintenance, admin-documents, admin-messaging, admin-profile |
| [Tabs](components/tabs.html) | Navigation | underline, underline with counts, pill filters · 44px/36px | default, hover, focus, selected, disabled | admin-settings, admin-maintenance, admin-documents |
| [Breadcrumb](components/breadcrumb.html) | Navigation | 2–3 items (core; not used in the admin yet) | default, hover, focus, current | admin-maintenance, admin-messaging |
| [Pagination](components/pagination.html) | Navigation | numbered with summary | default, hover, focus, current, disabled; hidden at one page | admin-users |
| [Step indicator](components/step-indicator.html) | Navigation | dots + "Step N of 3" | to come, current, done | admin-onboarding |
| [Skip link](components/skip-link.html) | Navigation | one | off screen, focus | admin-users, admin-dashboard, admin-login |
| [Layout primitives](components/layout.html) | Containers and overlays | app shell, page header, stack, cluster, grid and spans, sticky aside, auth layout, container | responsive only | admin-users, admin-assets, admin-maintenance, admin-dashboard, admin-login |
| [Divider](components/divider.html) | Containers and overlays | rule (`hr`), labelled | not interactive | admin-photo-picker, admin-maintenance, admin-dashboard |
| [Card](components/card.html) | Containers and overlays | request, document, asset (title link); page, director, block (actions); flush | default, title-link hover and focus, active, loading, empty | admin-maintenance, admin-documents, admin-assets, admin-pages, admin-board, admin-profiles |
| [Dialog](components/dialog.html) | Containers and overlays | destructive, form, viewer; bottom sheet under 640px | default, busy, invalid, failed, stacked | admin-user-create/edit/delete, admin-page-remove, admin-director-remove, admin-content-editor, admin-document-viewer, admin-asset-detail |
| [Tooltip](components/tooltip.html) | Containers and overlays | name echo, description (core; not used in the admin yet) | hidden, hover, focus, dismissed | intended for icon buttons in admin-users, admin-documents |
| [Table](components/table.html) | Data display | framed, flush in a card, row actions + pagination, read-only, switch matrix | default, row hover, action focus, truncated, loading, empty, no results | admin-users, admin-invitations, admin-roles |
| [List](components/list.html) | Data display | two-line with badge, simple, with avatar and unread count, current item | default, link hover/focus, current, unread, loading, empty, no results | admin-dashboard, admin-messaging, admin-profiles |
| [Description list](components/description-list.html) | Data display | vertical, horizontal | value, "Not given", long value, link value, loading | admin-asset-detail, admin-profile, admin-maintenance |
| [Avatar](components/avatar.html) | Data display | initials, photo · sm/md/lg/xl | initials, photo, uploading, photo failed | admin-users, admin-profiles, admin-profile, admin-board, admin-messaging |
| [Logo mark](components/logo-mark.html) | Data display | sidebar brand (32px), sign-in tile (64px) | brand link default, hover, focus | admin-dashboard, admin-login, admin-landing |
| [Badge](components/badge.html) | Data display | neutral, info, warning, success, danger, count | static | admin-maintenance, admin-dashboard, admin-users, admin-invitations, admin-messaging |
| [Chip](components/chip.html) | Data display | filter chip (`aria-pressed`) | default, hover, focus, pressed, disabled | admin-maintenance, admin-documents |
| [Metric card](components/metric-card.html) | Data display | four dashboard metrics with icon tints; link form; bare `.stat` | default, zero, loading, not available, hover, focus | admin-dashboard, admin-dashboard-unread |
| [Picture list](components/picture-list.html) | Data display | library, choose one, attached photos · standard/compact | default, current, hover, focus, uploading, failed, empty, no results | admin-assets, admin-asset-detail, admin-asset-upload, admin-photo-picker |
| [Toast](components/toast.html) | Feedback | info, success, warning, danger; with action; stacked (core; not used in the admin) | entering, timed, leaving, stacked | wording from admin-*-saved, admin-notice-sent |
| [Alert and banner](components/alert.html) | Feedback | success, danger (with Try again), info, warning, banner | default, action focus, shown, cleared | admin-*-saved, admin-login, admin-board, admin-pages, admin-website errors |
| [Inline message](components/inline-message.html) | Feedback | field help, field error, inline status | default, invalid, saving, saved | admin-user-create, admin-change-password, admin-content-editor |
| [Progress](components/progress.html) | Feedback | uploading, complete · default/lg | starting, uploading, complete, failed | admin-asset-upload, admin-photo-picker |
| [Spinner](components/spinner.html) | Feedback | loading row, inline status, busy button · sm/md/lg | loading, loaded, failed | admin-board, admin-pages, admin-website, admin-documents, admin-maintenance, admin-messaging |
| [Skeleton](components/skeleton.html) | Feedback | text, title, circle, block (core; not used in the admin yet) | loading, loaded | admin-dashboard, admin-users |
| [Empty state](components/empty-state.html) | Feedback | first use, no results, nothing selected, error · full/compact | default, action focus, error | admin-users, admin-documents, admin-maintenance, admin-assets, admin-messaging |
| [Error page](components/error-page.html) | Feedback | not found, no access, something went wrong, offline (core; not used in the admin yet) | default, focus, retrying | none; nearest admin-board, admin-pages, admin-website errors |
| [Site tree](components/site-tree.html) | Navigation | column beside a screen, cards on the Website landing | default, hover, focus, current, add | admin-website, admin-board |
| [Publish bar](components/publish-bar.html) | Feedback | everything published, unpublished changes | default, publishing, failed (in the dialog) | admin-website, admin-page-editor |
| [Section list](components/section-list.html) | Data display | home sections, fixed menu and footer, page banner and body blocks with Add | default, hover, focus, selected, hidden, moved | admin-page-editor |
| [Placement note](components/placement-note.html) | Feedback | one sentence per section | static | admin-page-editor |
| [Linked summary](components/linked-summary.html) | Data display | with items, empty | link states | admin-page-editor (notices, board, linked-empty) |
| [Preview pane](components/preview-pane.html) | Containers and overlays | home, website page | default, reloading, expired link | admin-page-editor, public-landing (preview) |
| [Block card](components/block-card.html) | Data display | Heading, Paragraph, Bullet list, Photo, Link button, Existing content | static | admin-page-editor (page, page-existing) |

### Left out on purpose

- **Shelfie-only pieces**: book cover, cover picker, cover gallery, book card, chapter row, sticker, sticker picker, swatch picker, streak, trophy, achievement badge, celebration, question and answer, chat bubble, feedback note, plus the e-mail foundation and the marketing-page pattern. Their tokens (cover pastels and tints, cover sizes), CSS, scripts (`aurora.js`) and images were not carried over.
- **Shelfie generic components the admin does not use and that are not core**: hero, accordion, combobox, activity feed, suggestion.
- **Public app components** (for example the old system's bottom tab bar for members): the public app is out of scope.
- **Added for Coop admin**: sidebar navigation, tabs, pagination, checkbox, select, search field, icon button, spinner, description list, tooltip, divider and metric card, and on 24 October 2026 the Website area pieces: site tree, publish bar, section list, placement note, linked summary, preview pane and block card. They are written in the same visual language and are new to this system.

## Patterns

| Pattern | Covers |
|---|---|
| [Forms](patterns/forms.html) | Labels, validation timing, error summary, busy submit, destructive confirmation; the New maintenance request dialog |
| [Feedback and loading](patterns/feedback-and-loading.html) | Loading text, skeletons, busy buttons, upload progress, success and failure alerts |
| [Empty and error states](patterns/empty-and-error-states.html) | First use, no results, could not load; copy formulas and recovery |
| [Navigation and page structure](patterns/navigation.html) | The admin shell: sidebar from 768px, tab bar with More below, page header, tabs and pill filters |
| [Dialogs and overlays](patterns/dialogs-and-overlays.html) | Form, confirmation, result, viewer and stacked dialogs; bottom sheets on phones |
| [Lists and tables](patterns/lists-and-tables.html) | Users table, search, filters, documents and maintenance lists, pagination |
| [Notifications](patterns/notifications.html) | Inline saved messages in a polite live region; waiting counts; when a toast would fit |
| [Content and tone](patterns/content-and-tone.html) | The admin voice and the voice staff write in for members; verbs, dates, names, formulas |
| [Wizard step](patterns/wizard-step.html) | Admin onboarding, one step at a time |

## Tokens

- `tokens/tokens.css` is the source of truth: primitives, semantic tokens, and light and dark themes.
- `tokens/tokens.json` is the DTCG export, generated by `tokens_to_json.py`.
- `tokens/contrast-pairs.json` lists every foreground/background pair the components rely on, checked in both themes.
- `assets/components.css` holds the component CSS. Every value comes from a token, and it has `data-state` hooks for the documentation. It is the design reference for the mocks and these pages; the Angular implementation is the `components` library in `frontend/projects/components`, whose component stylesheets carry the same rules (ADR 0010).

## Drift from the implemented admin

Each row records where the implemented Angular admin (as captured in `docs/mocks` before 20 October 2026) differs from this system. The admin mocks now show the resolutions; [Status in the app](#status-in-the-app) says which the app has reached. The full per-component lists are in each page's **Sources** section.

| # | Mock | Issue | Resolution in this system |
|---|---|---|---|
| D1 | all admin screens | Green accent `#3d8a5a` (white label 4.2:1, fails AA), Outfit web font, light theme only, co-op logo in its own fixed palette | Violet accent, rounded system fonts, light and dark themes, logo drawn with token fills |
| D2 | all admin screens | Material Icons font; ligature names are read aloud ("add Add User") | Inline 2px-stroke SVG icons with `aria-hidden`; mapping on the Iconography page |
| D3 | all admin screens | Buttons `.btn-primary/-secondary/-danger/-danger-outline` with 8px corners; Title Case labels; busy state swaps the label without `aria-busy` | `.btn--primary/--ghost/--danger`, pill corners, sentence case, label kept with `aria-busy` |
| D4 | all admin screens | Eight unscaled radii, off-grid spacing (6, 10, 14px), one faint shadow for everything, ad hoc z-indexes | Radius, 4px spacing, four-level elevation and z-order tokens |
| D5 | all admin screens | Mostly 14px text, about 40px controls, pale 1.3:1 field borders, `outline: none` with a faint focus glow | 16px body, 44px controls, `--color-border-strong`, one 2px focus ring |
| D6 | all shell screens | Desktop-first `max-width: 768px` queries; at 768px and below the 13-link sidebar stacks above the page *and* a tab bar shows on some pages; the tab bar shows on sign-in | Mobile first; sidebar from 768px; below it a tab bar with four destinations and **More**, which opens every section in a dialog; no tab bar when signed out |
| D7 | admin-dashboard, every screen with the tab bar | Tab bar (Home, Requests, Documents, Messages, Profile) and sidebar disagree on names and routes; current item marked by `.active` only | Dashboard, Requests, Documents, Messages, More; `aria-current="page"`; one address per section |
| D8 | admin-login, admin-register, admin-change-password, user and maintenance dialogs | `<label>` without `for`, text copied into `aria-label`; errors not linked; no `aria-invalid`; some invalid states show only a red border | `<label for>`, `.field__error` linked by `aria-describedby`, `aria-invalid`, error summary |
| D9 | many forms | Errors state the rule ("X is required"); "Invalid…", "Failed to…", "Are you sure…?" | Errors say what to do; failures say what to try; confirmations name the thing |
| D10 | admin-users, admin-documents, admin-assets, admin-messaging | `.search-input` with no label, `type="text"`, no clear button; no-results copies the empty text and loses the query | `.search` with a label, `type="search"` and a clear button; separate no-results state with Clear search |
| D11 | admin-users, admin-documents | `.icon-btn` Edit/Delete named only "edit"/"delete", 32px targets | Icon buttons named with their row ("Delete mira.fern"), 44px |
| D12 | admin-maintenance, admin-documents, admin-assets, admin-messaging | Cards and conversation rows are `div role="link"` without `href`; Delete sits inside the link card | Real links on titles; actions beside the link |
| D13 | admin-maintenance, admin-documents, admin-settings | Four tab and filter styles, none with tab or pressed semantics | `.tabs` (APG tabs) and `.tabs--pill` / `.chip[aria-pressed]` |
| D14 | admin-users | Pagination: « » only, current page by colour, no landmark; "Showing 0-0 of 0" when empty | `nav.pagination`, words, `aria-current`; hidden at one page or none |
| D15 | admin-users, sidebar | Roles shown as stored keys ("SystemAdministrator"); role names differ by screen ("Admin", "Staff"); avatars in random inline colours | Plain role names everywhere; one accent-subtle avatar pair |
| D16 | admin-roles | `.privilege-toggle` checkboxes named "privilege-read" on every row; save on change; API errors swallowed | `.switch` (`role="switch"`) named by column and row; reverts with an alert if the save fails |
| D17 | user, maintenance, asset and viewer dialogs | `.modal-overlay` with no dialog role, name or focus containment; three dialog CSS systems; centred cards on phones | One `.dialog` with role, `aria-modal` and a label; bottom sheet under 640px |
| D18 | delete dialogs | "Confirm Delete" with a bare "Delete", nothing named | The title names the thing; outcome buttons; focus starts on the safe button |
| D19 | admin-board, admin-pages, admin-website, admin-maintenance, admin-documents, admin-messaging | Per-screen spinners and alert classes; spinning icons with no words or live region | One `.spinner` / `.loading` with text in `role="status"`; one `.alert` |
| D20 | admin-asset-upload | Progress bar has no role or value and stays at 0; Upload stays enabled | `role="progressbar"` with a value; busy footer; complete and failed states |
| D21 | admin-*-saved notifications | Inline success has no live region; shown even when the save fails; required errors stay visible after success | `.alert--success` in `role="status"`, only after the server confirms; errors cleared |
| D22 | admin-users, admin-documents, admin-maintenance, admin-assets | Empty states: an icon and one line, no heading or action; empty and no-results identical | `.empty` with heading, reason and action; separate first-use and no-results |
| D23 | admin-dashboard | Metric cards are not links; counts show 0 while loading or on failure; "Open requests" falls back to the total | `a.card.metric-card`; skeleton while loading, "Not available" on failure; open requests only |
| D24 | admin-onboarding | No `h1` or `main`; unit choice is a clickable `div`; focus does not move between steps | `h1` with focus moved to it; a radio group in a fieldset |
| D25 | admin-messaging, admin-maintenance | Unnamed icon-only New conversation and Back buttons; photo links open new tabs without saying so | Named buttons; same-tab links or an "opens in a new tab" hint |
| D26 | all admin screens | Raw transition times, no `prefers-reduced-motion` | Duration and easing tokens, zeroed under reduced motion |
| D27 | admin-settings | "Theme Customization" edits the *public website's* colours, with no contrast check | Treated as website content; this system's themes must pass `check_contrast.py` |
| D28 | admin-maintenance | Maintenance statuses are New, Received, Started and Completed; the code also accepts "Complete" and "Done" | These four words everywhere: New (warning), Received (neutral), Started (info), Completed (success) |
| D29 | admin-member-* | The admin showed every member all thirteen sections, though most refuse them | Sidebar **member** variant: Dashboard, Maintenance, Documents, Messages, My profile; office sections left out, not disabled (L2-REQ-112) |
| D30 | admin-website, admin-pages, admin-board, admin-assets | Four unrelated sidebar links (Website, Pages, Board, Assets) for one public website; a flat list of thirteen links | One **Website** sidebar entry and a [site tree](components/site-tree.html) inside it; the sidebar grouped as Dashboard, Website, Community, Operations, Access, Settings |
| D31 | admin-website, admin-pages, admin-board | Every save went live at once ("Changes are live as soon as you save"); no way to try a change safely | A draft and a published copy of the site content; the [publish bar](components/publish-bar.html) with Preview site, Publish and Discard changes; pages and the board list still save at once |
| D32 | admin-website, admin-content-editor | Blocks as cards in two groups, each opening a dialog; the public order lived in code | The page editor screen: a [section list](components/section-list.html) in public order with Hide, Move up and Move down, the section form beside it, and a preview |
| D33 | admin-website | Placement explained only by group headings and block names ("Hero", "At a glance") | A [placement note](components/placement-note.html) under each section heading; plain names ("Welcome banner", "Numbers at a glance") |
| D34 | admin-content-editor | "What's on" and "Meet the board" edited headings only; nothing said what visitors would see or where to change it | A [linked summary](components/linked-summary.html) with the count, the first items and Manage notices or Manage directors |
| D35 | admin-website | No preview; the public site was reachable only through a constant used for photo thumbnails | A [preview pane](components/preview-pane.html) in the editor and Preview site in the publish bar, both through a short-lived preview link |
| D36 | admin-page-editor | The page body was one textarea of simple HTML | A page is a banner plus body blocks ([block card](components/block-card.html)); old HTML becomes one Existing content block |
| D37 | admin-director-editor | A director's photo was a typed address | The photo picker, as everywhere else |

### Status in the app

On 20 October 2026 the admin moved onto this system without changing behaviour or copy.

- **Resolved:** D1, D2, D3 (classes, pill corners, `aria-busy`), D4, D5, D8 (labels, linked errors, `aria-invalid`), D11, D12, D13, D17, D18 (alert dialogs, focus on the safe button), D19, D20 (progress bar role and value), D25 (named buttons), D26.
- **Partly resolved:**
  - D6 and D7: the tab bar is drawn once by the layout, marks the current item with `aria-current` and is gone from sign-in. Its destinations, names and the More dialog are still open, so the sidebar stays in flow above the page below 768px.
  - D10: searches are labelled and typed; the clear button and the separate no-results state are open.
  - D14: pagination is a named `nav` with `aria-current`; words and hiding at one page are open.
  - D16: privileges are named switches; reverting a failed save is open.
  - D21: success messages sit in a live region; showing them only after the server confirms is open.
  - D22: empty states use `.empty`; the separate first-use and no-results states are open.
  - D24: the unit choice is a radio group; the `h1` and moving focus are open.
- **Resolved on 21 October 2026:** D29, the role-filtered sidebar.
- **Open:** D9 (error and confirmation wording), D15 (plain role names, Title Case labels), D23 (metric links, loading and "Not available"), D27, D28 (status words), and the sentence-case labels in D3.
- **Website area (D30 to D37):** resolved in the admin on 24 October 2026 with the content management re-imagined work; the mocks in `docs/mocks` show the resolutions and the admin implements them (see `docs/detailed-designs/admin-app/website-area/`).

### Open questions

- **Type size for this audience.** The system keeps Shelfie's scale as-is: 16px body, 14px labels and table cells, 12px captions. The co-op's users are older, so the scale may need to grow. The typography and accessibility foundations discuss this.
- **Tab bar labels at 320px.** At a 320 CSS px viewport (400% zoom) the five 12px tab labels nearly touch ("Documents", "Messages"). Nothing overflows, but shorter labels or larger, two-line tabs may read better for this audience.
- **Content decisions** in the drift log, such as role names, "Heating and cooling" for "HVAC" and date formats, need product sign-off before the app changes.
- **Out-of-scope behaviour bugs** found while reading the mocks: onboarding never saves the chosen unit; the asset Download button does nothing; the public-site theme editor allows any colour. These are recorded only.

## Verification

Run on 2026-10-20 from the repository root.

| Check | Command | Result |
|---|---|---|
| Contrast, both themes | `python .claude/skills/extracting-design-systems/scripts/check_contrast.py docs/design-system/tokens/tokens.css` | 156 passed, 0 failed, 0 unresolved (81 pairs; some pairs apply to one theme only) |
| Token export | `python .claude/skills/extracting-design-systems/scripts/tokens_to_json.py docs/design-system/tokens/tokens.css` | 284 tokens written to `tokens/tokens.json` |
| Structure | `python .claude/skills/extracting-design-systems/scripts/check_design_system.py docs/design-system` | 66 pages (12 foundations, 44 components, 9 patterns, index), 0 errors, 0 warnings |
| Leftover Shelfie content | `grep` for child-app words across the folder | No child-app content. "Shelfie" appears only in footers, provenance lines, drift notes and this README |
| Reflow and screenshots | Chromium (Playwright) at 320, 360 and 1280px, both themes | All 66 pages loaded in Chromium at 320 and 1280px in both themes, plus the review set at 360px: no horizontal page scroll and no script errors. Reviewed by eye: index, color, button, table, sidebar, tab bar and the navigation pattern. Fixed: privilege heading wording, and role keys in the sidebar examples |
| Admin mocks on the system | `check_mocks.py docs/mocks`; Chromium at 320, 768 and 1280px, both themes | 144 admin mocks rebuilt on `tokens.css` and `components.css`; checker at its baseline (1 public error, 43 warnings); no overflow, no script errors, every `data-mock-href` resolves |

Not verified by tooling: a screen-reader pass, `forced-colors` rendering, and real 400% browser zoom. Reflow was checked as a 320 CSS px viewport. The accessibility foundation lists these as manual checks to run when the components exist in Angular.

## Changelog

- **2026-10-24**: Added the Website area components for content management re-imagined: site tree, publish bar, section list, placement note, linked summary, preview pane and block card, with their CSS in `components.css`; the sidebar page now describes the grouped sidebar. Drift D30 to D37 record what the earlier admin did. No tokens changed.
- **2026-10-21**: Added the sidebar's member variant (five areas, "My profile") for members, who now use the admin site (ADR 0016, drift D29). No new tokens or components.
- **2026-10-21**: The admin's presentation components are now built once in the Angular `components` library (`frontend/projects/components/src/lib`) and the admin no longer loads `components.css` (ADR 0010). Each component page names its Angular component under Code. No tokens or designs changed, and the drift items stay open.
- **2026-10-20**: The Angular admin now loads this system (ADR 0009). Added the status of each drift item in the app.
- **2026-10-20**: Rebuilt the 144 admin mocks in `docs/mocks` on this system (light and dark); removed their captured stylesheets.
- **2026-10-20**: Replaced the earlier Coop design system (light only, extracted from both apps' mocks) with the Shelfie design system, adopted as-is visually and rewritten for the Coop admin site. Removed Shelfie-only tokens, CSS, pages and assets. Added sidebar navigation, tabs, pagination, checkbox, select, search field, icon button, spinner, description list, tooltip, divider and metric card. Added a dark-theme focus-ring offset, a hoverable tooltip, row-header table cells, `a.avatar`, tab bar buttons, and the phone top bar inside the app shell.
