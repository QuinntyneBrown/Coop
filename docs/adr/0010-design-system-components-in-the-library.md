# 0010. The design system's components live in the components library

- Status: Accepted
- Date: 2026-10-21
- Supersedes: the "CSS source" part of
  [0009](0009-admin-loads-the-design-system.md)

## Context

ADR 0009 had the admin load `docs/design-system/assets/components.css`
globally, and every admin template wrote the design system's markup by
hand: `<button class="btn btn--primary">`, `<div class="field">` with its
label, help and error, the `.dialog > .dialog__panel` structure and so on.
The same markup was repeated across twenty screens, and the Angular
`components` library in `frontend/projects/components` was still an empty
scaffold.

Building the presentation components once in that library needs four
choices: where their styles live, what happens to `components.css`, how the
apps resolve the library, and where the icon lives.

## Decision

- **Where styles live.** Each presentation component the admin uses is an
  Angular component in `frontend/projects/components/src/lib/<name>/`, with
  its class, a separate `.html` template and a separate `.scss` file, and is
  exported from `public-api.ts`. Its `.scss` holds the rules from
  `components.css` that style that component, in their order there, with
  `:host` for the component's own block. Styles are encapsulated (Angular's
  emulated encapsulation), so they keep their meaning only on the
  component's host. Rules that style a component inside another
  (`.btn .icon`, `.sidebar__nav .nav-link`) sit in the inner component's
  file as `.btn :host`. Modifiers are written `:host(:where(.btn--primary))`
  so they keep the specificity they had in `components.css`.
- **Selectors.** Components use attribute selectors on the native element,
  for example `button[libButton]`, `input[libTextField]` and
  `dialog[libDialog]`. The host stays the native button, input, link or
  dialog, so its role, keyboard behaviour, form binding (`formControlName`,
  `ngModel`), `routerLink`, `aria-*` and `data-testid` attributes all work
  as before. The host keeps the mocks' class names (`btn`, `btn--primary`)
  and inputs choose the modifiers (`variant="primary"`).
- **Foundations.** The rules that style plain elements and page layout, not
  a component (the base element styles, links, the focus ring,
  `.visually-hidden`, the text utilities, `.stack`, `.cluster`, `.grid`,
  `.page-header`, `.auth-layout`, `fieldset`, `.form-actions`), move to
  `frontend/projects/components/src/styles/foundations.scss`, which apps
  load globally. Layout used by one admin screen (`.wizard`, `.metric-grid`,
  `.app-shell`) moves into that screen's own `.scss`.
- **components.css.** `docs/design-system/assets/components.css` stays in
  the design system as the design reference that the mocks and the design
  system's pages load. The library is the implementation. The admin no
  longer loads `components.css`; its `angular.json` styles are
  `docs/design-system/tokens/tokens.css`, the library's `foundations.scss`
  and `projects/admin/src/styles.scss` (the form-control font reset). The
  native-dialog adapter moves from `styles.scss` into the library's dialog
  component.
- **How apps resolve `components`.** The workspace `tsconfig.json` maps
  `components` to `projects/components/src/public-api.ts`, the library's
  source. `ng serve`, `ng build`, `ng test` and the Playwright web servers
  therefore compile the library with the app and need no library build
  first. `ng build components` still builds the package with ng-packagr and
  stays in `npm run build`. Publishing it to npm is out of scope.
- **Icons.** The icon component (`svg[libIcon]`) and `icon-name.ts` move to
  `frontend/projects/components/src/lib/icon/`. The admin's
  `shared/components/icon.component.*` and `icon-name.ts` are removed.
- **Dialogs and overlays.** Dialogs stay native `<dialog>` elements opened
  with `showModal()`, now `dialog[libDialog]`. `@angular/cdk` is still not
  added.

## Consequences

- A design change to a component is made in the library's `.scss` and,
  so the mocks match, in `components.css`. The two must be kept in step
  until the mocks are generated from the library.
- Library styles load after the app's global styles. An app rule that
  adjusts a library component uses a descendant selector
  (`.page-actions .search`), which emulated encapsulation keeps more
  specific than the library's own rules, so it still wins.
- A screen's template names the components it uses (`libButton`,
  `libFormField`), and the compiler checks their inputs.
- The library is tested with vitest (`ng test components`), one spec per
  component folder. The admin Playwright suite is the regression net for the
  app.
- Components the admin does not use (toast, tooltip, menu, breadcrumb,
  skeleton, banner, input group, error page) are not built. The public app
  does not use the library yet.
