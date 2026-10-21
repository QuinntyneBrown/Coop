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

## Landing page replaced

On 13 October 2026 the captured `public-landing` mocks (default, empty) were
replaced by the hand-written OWN proposal (default, menu) described in the
README. Its stylesheet `assets/styles/a7b0d893cb707d60.css` was used only by
the capture and was removed. The capture script skips the public landing so a
recapture does not overwrite the proposal. Counts are unchanged: 50 screens,
154 state files.

## Website pages added

On 13 October 2026 the page management screens were added as hand-written
design references: `public-page` (4 states), `admin-pages` (4 states),
`admin-page-editor` (5 states), `admin-page-remove` (2 states) and
`admin-page-saved` (1 state), 16 files in all, plus the "How to apply" link
in the landing navigation and the "Pages" link in every captured admin
sidebar. `check_mocks.py docs/mocks --write` now reports 55 screens, 170
mocks and the same four intentional dashboard `h1` errors. The new screens
were screenshotted at 360 and 1280 px: the public page and its not-found
state reflow to one column, the admin list stacks its cards and actions, and
the dialogs become bottom sheets under 640 px.

## Public login removed

On 21 October 2026 the `public-login` screen and its four states (default,
error, invalid, submitting) were removed: the public site no longer has a
login screen (L2-REQ-101). Every public mock link that led to it now opens
`admin-login` instead: "Member sign in" in the header, phone menu and footer
of `public-landing` and `public-page`, "Report a repair" in those footers (a
signed-out visitor is sent to the admin login), the register and
forgot-password "Sign in" links, and Log Out on the public profile mocks.
"Documents and bylaws" in those footers now opens `public-documents`, the
screen its route shows. The links keep their classes and look. The capture
scripts no longer capture a public login and map the admin login address to
`admin-login`. `check_mocks.py docs/mocks --write` now reports 63 screens and
214 mocks; its one error (the `public-maintenance-create` busy state) and its
warnings were already reported before this change.

## Members move to the admin site

On 21 October 2026 the public member screens were removed, because members
now do everything that needs signing in on the admin site (L2-REQ-102,
L2-REQ-103): the pages `public-dashboard`, `public-maintenance`,
`public-messaging`, `public-profile`, `public-onboarding`, `public-register`
and `public-forgot-password`, the dialogs `public-maintenance-create`,
`public-maintenance-detail` and `public-profile-switcher`, and the
notification `public-profile-saved`. `public-documents` and
`public-document-viewer` lost the signed-in parts of their layout (the bell,
the menu button, the member sidebar and the phone tab bar); the top bar keeps
the logo. Their layout stylesheet and the three photo, picture and notice
stylesheets that only the removed screens used were removed or trimmed. The
footer's "Report a repair" already opened `admin-login`.

The member view of the admin site was added as six hand-written screens on
the design system (`admin-member-dashboard`, `-maintenance`,
`-maintenance-create`, `-documents`, `-messaging` and `-profile`, 37 files).
They were screenshotted at 360, 768 and 1280 px in light and dark: the menu
moves above the content under 768 px, the create dialog becomes a bottom
sheet on a phone with Cancel and Send request in view, and no mock scrolls
sideways. `check_mocks.py docs/mocks --write` now reports 58 screens, 193
mocks and 0 errors; its warnings are the `admin-maintenance` requirement
metadata already reported before this change.
