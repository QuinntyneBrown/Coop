# 0009. The admin loads the design system from docs

- Status: Accepted; the "CSS source" part is superseded by
  [0010](0010-design-system-components-in-the-library.md)
- Date: 2026-10-20

## Context

On 20 October 2026 the admin adopted a new design system in
`docs/design-system`, and the admin mocks were rebuilt on it. The Angular
admin still used its own green, Outfit-based styles: SCSS variables,
`--adm-*` tokens copied into several components, the Material Icons font,
and two ways of drawing dialogs (native `<dialog>` on four screens, an
`@if` overlay with no dialog role or focus containment on six). The
design system's drift log listed every difference.

Moving the app onto the system needs three choices: where the app gets the
CSS, how dialogs are built, and how icons are drawn.

## Decision

- **CSS source.** The admin's `angular.json` loads
  `docs/design-system/tokens/tokens.css` and
  `docs/design-system/assets/components.css` before
  `projects/admin/src/styles.scss`. Nothing is copied into `frontend/`, so
  the design system stays the single source. `styles.scss` keeps only what
  the running app needs and the system does not cover: a form-control font
  reset and the native-dialog adapter below. Components use the system's
  classes and attributes, and their own styles hold layout glue with token
  values only.
- **Theme.** The app does not set `data-theme`, so it follows the device's
  light or dark setting, the system's documented default.
- **Dialogs.** Every admin dialog is a native `<dialog class="dialog">`
  opened with `showModal()`, which gives the focus trap, Esc and focus
  return without a new library. Inside it the mocks' `.dialog__panel`
  structure is kept. The adapter in `styles.scss` resets the browser's
  dialog styles, hides closed dialogs and paints `::backdrop` with
  `--color-bg-backdrop`. `@angular/cdk` is not added.
- **Icons.** Icons are inline stroke SVGs from the system's icon sheet,
  drawn by `svg[appIcon]` (`shared/components/icon.component.*`) with the
  names in `icon-name.ts`. The Material Icons and Outfit web fonts are no
  longer loaded.

## Consequences

- A change to `docs/design-system` changes the admin on its next build.
  Contrast and reflow checks on the system therefore protect the app too.
- The admin build depends on files outside the Angular workspace. Moving or
  renaming those two stylesheets breaks the build.
- The move covers visual design and accessibility semantics only. The
  drift items that change behaviour or copy stay open in the design-system
  README until they have requirements and designs. These are the tab bar's
  More dialog, error wording, search clear buttons, pagination rules,
  reverting a failed switch, new loading, empty and not-available states,
  role names and status words.
- Until the More dialog exists, the sidebar stays in flow above the page
  below 768px, so every section is reachable on a phone.
