# Mock verification

Run on 2026-10-13 against the source in `frontend/projects/public` and
`frontend/projects/admin`. The 37 component files were byte-identical to the
earlier `apps/coop-*` copies, so the recapture reproduces the same UI.

## Counts

| Kind | Screens |
|---|---|
| Pages | 27 (10 public, 17 admin) |
| Dialogs | 17 |
| Notifications | 6 |
| **Total** | **50 screens, 154 state files** |

## Coverage check

```powershell
python .claude/skills/writing-html-mocks/scripts/check_mocks.py docs/mocks --write
```

Result: 50 screens, 154 mocks, 4 errors, 0 warnings. All four are the same
intentional exception.

- **Two `h1` elements:** the admin dashboard component renders a page title and
  a greeting as separate `h1` elements. It affects `admin-dashboard` default,
  empty and partial, plus the `admin-dashboard-unread` notification. The source
  is retained as shipped, per the "current UI only" decision.

## Rendering check

```powershell
python .claude/skills/writing-html-mocks/scripts/screenshot_mocks.py docs/mocks --theme light
```

All 462 screenshots (154 mocks at 360, 768 and 1280 wide) were written to the
ignored `.cache/mocks/`. Representative pages and dialogs were compared with the
running applications and matched.

- **Phone overflow:** 77 admin mocks are wider than 360 px, from 402 px to
  673 px. The running admin app overflows by the same amounts, for example
  462 px for Users and 673 px for Messaging. This is existing product
  behaviour and was not changed. No public mock overflows.
- **Keyboard:** the skip link is the first tab stop on a page, followed by the
  form fields and links in source order. Review chrome is reachable by keyboard.
- **Dark theme:** not implemented in the product, so not captured.

## Notes

The earlier capture used paths one level too deep, a mis-encoded separator and a
wrong metadata key. These were fixed in `scripts/capture.py` and
`scripts/export-dom.js`, then every file was regenerated. The manifest now
carries a specific reason for each `not_applicable` state.
