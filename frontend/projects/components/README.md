# Coop components library

Angular library in the [frontend workspace](../../README.md) with the
presentation components of the design system in
[`docs/design-system`](../../../docs/design-system/README.md), which the admin
application uses for every screen. The public application does not use it yet.
The decisions are in
[ADR 0010](../../../docs/adr/0010-design-system-components-in-the-library.md)
and the component list, with the components left in the apps and why, is in
the [detailed design](../../../docs/detailed-designs/admin-app/components-library/README.md).

Each folder in `src/lib/` holds one design-system component and its parts. A
component's selector is an attribute on the native element it draws
(`button[libButton]`, `input[libTextField]`, `dialog[libDialog]`), so the host
keeps its role, keyboard behaviour and form binding, and carries the design
system's class names. Its `.scss` holds the matching rules from
`docs/design-system/assets/components.css` with design tokens by role.
`src/styles/foundations.scss` holds the global base styles and layout
primitives; apps load it after `docs/design-system/tokens/tokens.css`.

Apps import the components from `'components'`, which the workspace
`tsconfig.json` maps to `src/public-api.ts`.

## Development

From `frontend/`:

```powershell
npx ng build components
npx ng test components --watch=false
npx ng lint components
```

Put each class, interface, type alias, and enum in its own kebab-case file, use
separate template and style files, and export the public surface from
`src/public-api.ts`. Keep business rules out of these components; they do not
use the `api` project.
