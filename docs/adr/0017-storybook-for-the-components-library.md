# 0017. Storybook for the components library

- Status: Accepted
- Date: 2026-10-21

## Context

ADR 0010 moved the design system's presentation components into the
`components` library in `frontend/projects/components`. The only places to
see one of them were the admin screens that use it and the static pages in
`docs/design-system/components/`, which load `components.css` rather than
the library. There was no way to render a library component on its own, try
its inputs, or check its accessibility outside an admin screen.

Adding Storybook needs five choices: the builder, where stories live, how
controls get their inputs, which global styles a story loads, and whether
Storybook runs in CI.

## Decision

- **Builder.** The official `@storybook/angular` framework, Storybook
  10.6.3, which supports Angular 22. Its Angular CLI builders need
  `@angular-devkit/build-angular` (webpack), which is added as a dev
  dependency next to `@angular/build`. The apps keep building with
  `@angular/build`. The Angular packages move to 22.2.3 so the two
  builders resolve together. The Vite-based Analog integration was not
  chosen because it is third-party and adds Analog and Vite packages.
- **Targets and scripts.** The `components` project in `angular.json` has
  `storybook` (port 6006) and `build-storybook` (to
  `dist/storybook/components`) targets, run with `npm run storybook` and
  `npm run build-storybook` from `frontend/`. The configuration is in
  `frontend/projects/components/.storybook/`.
- **Stories.** Each library folder has one `<folder>.stories.ts` beside its
  components and spec, titled by the design system index's groups
  (Foundations, Actions, Inputs, Navigation, Containers and overlays, Data
  display, Feedback). A story's template writes the native host element
  with its attribute selector (`<button libButton>`), as an app template
  does. Stories cover the variants and states that the component implements
  on its design-system page, with fictional copy. `tsconfig.lib.json`
  excludes `*.stories.ts`, so `ng build components` leaves them out.
- **Controls.** Compodoc is off. Each story file writes its `argTypes` by
  hand, with the options from the component's union types.
- **Global styles.** Stories load what the admin loads:
  `docs/design-system/tokens/tokens.css`, the library's
  `styles/foundations.scss`, and `.storybook/preview.scss`, a copy of the
  admin's form-control font reset. Dark mode follows the operating system
  through `tokens.css`; there is no theme toolbar.
- **Addons.** `@storybook/addon-docs` (an autodocs page per component) and
  `@storybook/addon-a11y` (the axe panel, for WCAG 2.2 AA). No other
  addons, sample stories or Storybook lint plugin.
- **CI.** Storybook runs locally only. It is not part of `npm run build`,
  `npm test` or the CI workflow.

## Consequences

- A component can be viewed, its inputs changed, and its accessibility
  checked without running the admin or the API.
- A new or changed component also needs its `.stories.ts` updated. Nothing
  in CI catches a story that no longer compiles or renders, so run
  `npm run build-storybook` after changing a component.
- Stories render in Storybook's JIT mode, so a template mistake in a story
  shows at runtime, not in `build-storybook`. `npm run storybook` runs
  Angular in development mode and logs such mistakes (for example NG0303,
  an unknown input) in the browser console. `build-storybook` runs in
  production mode, which hides them.
- The webpack toolchain adds about 560 dev packages to `package-lock.json`,
  and `npm audit` reports more dev-only advisories through it
  (`webpack-dev-middleware`, `launch-editor`). None of it ships in the apps.
- `argTypes` are kept by hand, so they must follow changes to a component's
  inputs.
- Storybook collects anonymous usage telemetry unless it is turned off with
  `core.disableTelemetry` in `.storybook/main.ts` or the
  `STORYBOOK_DISABLE_TELEMETRY` environment variable.
