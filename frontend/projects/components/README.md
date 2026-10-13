# Coop components library

Angular library in the [frontend workspace](../../README.md) for the
design-system components shared by the public and admin applications. It
currently contains only the generated scaffold (`ComponentsComponent`); the
applications still render their own markup.

Components here should follow the visual classes and accessible state semantics
of the mocks in [`docs/mocks`](../../../docs/mocks/README.md) and use design
tokens by role rather than hard-coded colours.

## Development

From `frontend/`:

```powershell
npm run build -- components
npm test -- --project components
```

Put each class, interface, type alias, and enum in its own kebab-case file, use
separate template and style files, and export the public surface from
`src/public-api.ts`.
