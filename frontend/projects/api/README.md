# Coop API library

Angular library in the [frontend workspace](../../README.md) for the service
contracts and injection tokens that the public and admin applications use to
talk to the Coop API. It currently contains only the generated scaffold
(`ApiService`); the applications still call the API through their own
`core/services`.

## Development

From `frontend/`:

```powershell
npm run build -- api
npm test -- --project api
```

Put each class, interface, type alias, and enum in its own kebab-case file and
export the public surface from `src/public-api.ts`.
