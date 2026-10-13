# Coop implementation mocks

Open [index.html](index.html) directly from disk. Each file is a static rendering
of an implemented Angular screen or state. Expand the **review states** panel
in the bottom-right corner to browse related states, dialogs, and notifications.
Use `?chrome=0` to hide review controls. Product navigation links work locally;
forms never send requests or save data.

## Cast and catalog

All sample records are fictional. The reference date is **13 October 2026**.
Mira Fern (`mira.fern`, `mira@example.invalid`) has Member and BoardMember
profiles. Tavi Moss and Neri Vale are fellow board members; Oren Reed is a
member. The invented address is **101 Fictional Court**, unit 101. No real
cooperative or address is represented.

The shared catalog contains four maintenance requests (kitchen tap, hallway
light, courtyard gate, window latch), a courtyard gathering notice, a shared
spaces bylaw, a draft maintenance report, one conversation, two document assets,
and active, expired, and used invitation examples. Fixture tokens and passwords
are inert text. The complete fixture and state inventory is in
[scripts/scenarios.py](scripts/scenarios.py).

## Scope and provenance

The user selected **current UI only**. The implementation takes precedence over
the HTML-mocks skill's suggested future capabilities and generic state matrix.
Both apps are covered: 10 public routes and 17 admin route presentations. The
public landing page and the website page screens are the exceptions described
under *Proposal* below: they are hand-written design references that the
applications implement, and `scripts/capture.py` does not capture them.
Admin `/profile` and `/profiles` render the same component in different shells;
both are captured. Admin `/messaging` redirects to `/messages`. Both wildcard
routes redirect to the landing page and do not implement a 404 screen.

Every manifest entry records its source component, original route, existing
requirement IDs, and parent page for overlays. Requirement links describe
relevance, **not a claim that the implementation satisfies the requirement**.
Detailed designs and the previous `.pen` artifacts were already absent from the
working tree when this set was produced; they have not been restored.

Captures run the original development builds. The capture browser intercepts
all API requests with an error response, then supplies deterministic fictional
view-model values through Angular's development inspection API. Reactive forms
and selected component methods render the original templates. This includes
intermediate states that cannot be held still through ordinary clicks. Source
files and production APIs are never modified or called.

Rendered HTML retains source class names and Angular style encapsulation
attributes; Angular scripts and bindings are removed. Deduplicated compiled
styles in `assets/styles/` are shared between states. `assets/tokens.css`
records the public foundation. Source hard-coded values and differences in
admin styling are preserved intentionally. These are extracted styles, not a
new design system. Fonts are bundled locally for offline viewing.

Small review-only additions include labels for otherwise unnamed controls,
keyboard access to links between static examples, a main landmark where absent,
and a visually hidden review heading where the source has no `h1`. Existing
multiple `h1` elements and product focus/overlay behavior are retained and
reported during verification. The review panel is outside the product UI.

## Known implementation gaps and assumptions

- **Theme:** no dark palette or dark-mode switch is implemented. `?theme=dark`
  intentionally retains the same light product appearance. Screenshot checks
  cover the implemented light appearance at phone, tablet, and desktop sizes.
- **Authentication:** successful login goes to the dashboard; successful
  registration goes to onboarding (admin first attempts login). They have no
  separate success screen. Both forgot-password submit handlers are stubs.
- **Loading and errors:** retain implemented spinners rather than introducing
  skeletons. Several fetch failures become an empty list or leave the previous
  data unchanged. Missing error states are explained in the manifest; no new
  error banners, offline behavior, 403/500 pages, or notification center is added.
- **Public profile:** edit and password forms expand inline. Saving a profile
  also reports success after an API failure. Password success closes its form.
  Avatar upload can update the image but has no explicit progress/error UI.
- **Admin profiles:** edits stay open after save, including failed saves that
  display success. Switching profiles opens editing. Inline password changes
  have no mismatch check or visible failure state.
- **Admin users:** the edit dialog submits through `addUser()`/`createUser()`.
  Pagination is two users per page. Several fields have only touched-invalid
  styling, with no explanatory validation text.
- **Maintenance:** public photo selection is a stub. Admin Receive can change
  status locally after a server failure; its button remains visible for all
  statuses. Edit Description has no handler. No extra lifecycle dialogs are
  invented. Failed creates/comments have no distinct visible error state.
- **Documents:** admin Create closes/reloads even on failure; its type/status
  controls are not included in the save payload. The dormant edit title branch
  has no implemented entry action, so it is not presented as an edit flow.
- **Messaging:** admin Start New Conversation only closes the dialog and clears
  the recipient. A public failed send clears the input without adding a message.
  Neither app supplies a new failure notification.
- **Assets and invitations:** asset Download has no handler. Upload progress
  becomes zero and never advances through progress events. Asset deletion opens
  a second overlay over the detail dialog. Failed uploads/invitation creation
  close the dialog without feedback. Invitation copying has no copied indicator.
- **Settings:** Content and Account tabs only have descriptive text. Theme
  saving reports success even if the API fails because values are stored locally.
  `errorMsg` has a template branch but no assignment that makes it nonempty.
- **Change password:** after admin success, the reset form retains `submitted`,
  causing required-field errors to remain visible alongside success.
- **Accessibility/responsiveness:** source dialogs do not implement focus traps,
  inert backgrounds, or general Escape dismissal. Existing breakpoint behavior,
  mobile overflow, blank sections, and inert product controls are documented,
  not silently redesigned. Review chrome has independent keyboard navigation.

`not_applicable` means **no distinct implemented presentation in this snapshot**,
not that the product should never need the state. The generic skill checklist
is therefore assessed as source fidelity plus a gap record, not future UX
completeness. No ATDD or tests for these design artifacts are introduced.

## Proposal: the public site reimagined for OWN

`pages/public-landing/` is the one exception to "current UI only". The earlier
capture of the implemented landing page was replaced by this hand-written
proposal, made to show Older Women's Network Housing
Co-operative Inc. (OWN) what their CMS-driven public home page could be. The
public app's `LandingComponent` now implements it (see
`docs/detailed-designs/public-app/show-home-page/`); the mock remains the design
reference and changes first when the design changes. Open
[default.html](pages/public-landing/default.html) or the phone navigation
state [menu.html](pages/public-landing/menu.html). Use `?theme=dark` for
the dark appearance and `?chrome=0` to hide the review chrome, including the
purple "Edited in admin" tags that show which CMS block owns each section.

**Website pages.** The office adds, edits and removes content pages from the
admin "Pages" screen (`L2-REQ-080`), and each page appears in the header
navigation (`L2-REQ-082`) and renders at `/pages/{slug}` (`L2-REQ-083`,
`L2-REQ-084`). These screens are hand-written design references in the same
way as the landing page: `pages/public-page/` (default, loading, error,
not-found) extends `assets/own-site.css` with the banner and reading column;
`pages/admin-pages/`, `dialogs/admin-page-editor/`, `dialogs/admin-page-remove/`
and `notifications/admin-page-saved/` reuse the captured admin shell and
`assets/admin-pages.css`. The landing navigation shows the sample page "How
to apply" after the home page sections, and every captured admin sidebar
carries the "Pages" link. The dialogs are native `<dialog>` elements, so focus
is trapped, Escape closes and the page behind is inert; the editor shows
inline errors with a summary, a busy save, and a failed save that keeps the
entered values.

**Board of Directors.** The office keeps the "Meet the board" list from the
admin "Board" screen (`L2-REQ-085`): `pages/admin-board/` (default, loading,
empty, error), `dialogs/admin-director-editor/` (default, invalid, busy,
failed, edit), `dialogs/admin-director-remove/` and
`notifications/admin-board-saved/` are hand-written on the same captured admin
shell with `assets/admin-board.css`. Each director shows the portrait or
initials, name and role with Move up, Move down, Edit and Remove, in the order
the home page shows them, and every captured admin sidebar carries the "Board"
link. The sample directors are the fictional board of the landing proposal.

**Structure.** The page order follows the warm, photo-led shape of PAL Toronto's
About page as inspiration only (no text, images, branding or name is copied):
header with CMS navigation and Member sign in; hero; three "at a glance"
numbers; who we are with three short values; a six-photo gallery; two
building-and-community rows; what's on (CMS notices); the board; one member
quote; a visit-or-apply band with a large phone number; and a CMS footer. Every
block maps to an existing CMS concept: hero (`L2-REQ-068`), HTML body and
supplementary sections (`L2-REQ-070`), board and notices (`L2-REQ-053`), and the
generic content page shape (`L2-REQ-072`).

**Foundation.** `assets/own-site.css` is self-contained: warm cream canvas,
terracotta accent, sage and plum supporting tones, Outfit from the bundled
fonts, body text at 19–20 px, 48–56 px targets, a 3 px focus ring, and light
and dark themes. Every pair used for text passes WCAG 2.2 AA: text on canvas
14.9:1, muted text 6.8:1, white on the terracotta button 5.1:1, terracotta text
on canvas 6.0:1, white on sage 6.1:1; in dark, text on canvas 15.1:1, muted
9.4:1, dark text on the terracotta button 7.0:1. The page reflows to one column
at 320 CSS px with no horizontal scroll.

**Illustrations.** `assets/own/` holds original SVG scenes (building, rooftop
garden, tea, choir, lobby, knitting circle, portraits) standing in for the
Co-op's own photographs, which the CMS asset library would supply. The public
app ships the same files under `frontend/projects/public/public/own/`; replace
both copies together when the photographs arrive.

**Fictional content.** Board members (Rosalind Achebe, Margit Halvorsen,
Dolores Quintero, June Okonkwo-Baptiste), the quoted member Beatrix, the events,
the 555 phone number and the `.example` e-mail address are invented. The
neighbourhood is named without a street address. The counts (142 homes, opened
1997) are the Co-op's public figures and should be confirmed with them before
the pitch.

**Open questions.** Which CMS pages sit in the primary navigation (About us,
Living here, What's on and Contact are proposed as anchors here); whether
"How to apply" becomes its own CMS page; and which real photographs replace the
illustrations.

## Reproduce and verify

From the repository root, install the locked frontend dependencies once and start
the development servers in separate terminals:

```powershell
cd frontend
npm ci
npm run start:public -- --port 4311 --host 127.0.0.1
```

```powershell
cd frontend
npm run start:admin -- --port 4312 --host 127.0.0.1
```

Then, from the repository root:

```powershell
python -m pip install playwright pillow
python -m playwright install chromium
python docs/mocks/scripts/capture.py --source-screenshots
$mockSkill = '.claude/skills/writing-html-mocks'
python "$mockSkill/scripts/check_mocks.py" docs/mocks --write
python "$mockSkill/scripts/screenshot_mocks.py" docs/mocks --theme light
```

`--only public-login` limits capture to matching screen IDs during maintenance.
The manifest and state definitions are reviewed inputs; inspect implementation
changes before recapturing. Captured HTML works without Angular, a development
server, an API, or an internet connection. Generated caches are ignored.

Verification results and intentional checker exceptions are recorded in
[verification.md](verification.md). The next design activity is extracting a
design system from these references, with an explicit decision about correcting
the documented implementation gaps.

## Coverage

<!-- coverage:start -->

Legend: ✅ mock exists · ➖ not applicable (reason in manifest) · ❌ missing

### Pages

| Screen | default | loading | empty | error | menu | invalid | submitting | mismatch | partial | notices | bylaws | reports | no-results | new | started | done | chat | chat-empty | read | profile | unit | unit-selected | success | edit | password | password-invalid | password-error | received | detail-new | detail-received | detail-started | detail-completed | comments | comments-empty | board-edit | page-2 | no-privileges | member | content | account | not-found | Requirements |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Public · Landing (`public-landing`) | [✅](pages/public-landing/default.html) | ➖ | ➖ | ➖ | [✅](pages/public-landing/menu.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-053`, `L2-REQ-068`, `L2-REQ-070`, `L2-REQ-072` |
| Public · Login (`public-login`) | [✅](pages/public-login/default.html) | ➖ | ➖ | [✅](pages/public-login/error.html) |  | [✅](pages/public-login/invalid.html) | [✅](pages/public-login/submitting.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-007`, `L2-REQ-076` |
| Public · Register (`public-register`) | [✅](pages/public-register/default.html) | ➖ | ➖ | [✅](pages/public-register/error.html) |  | [✅](pages/public-register/invalid.html) | [✅](pages/public-register/submitting.html) | [✅](pages/public-register/mismatch.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-001`, `L2-REQ-044`, `L2-REQ-077` |
| Public · Forgot Password (`public-forgot-password`) | [✅](pages/public-forgot-password/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-001` |
| Public · Dashboard (`public-dashboard`) | [✅](pages/public-dashboard/default.html) | ➖ | [✅](pages/public-dashboard/empty.html) | ➖ |  |  |  |  | [✅](pages/public-dashboard/partial.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-009`, `L2-REQ-030`, `L2-REQ-038` |
| Public · Documents (`public-documents`) | [✅](pages/public-documents/default.html) | [✅](pages/public-documents/loading.html) | [✅](pages/public-documents/empty.html) | ➖ |  |  |  |  |  | [✅](pages/public-documents/notices.html) | [✅](pages/public-documents/bylaws.html) | [✅](pages/public-documents/reports.html) | [✅](pages/public-documents/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-035` |
| Public · Maintenance (`public-maintenance`) | [✅](pages/public-maintenance/default.html) | [✅](pages/public-maintenance/loading.html) | [✅](pages/public-maintenance/empty.html) | ➖ |  |  |  |  |  |  |  |  | [✅](pages/public-maintenance/no-results.html) | [✅](pages/public-maintenance/new.html) | [✅](pages/public-maintenance/started.html) | [✅](pages/public-maintenance/done.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-021`, `L2-REQ-025`, `L2-REQ-030` |
| Public · Messaging (`public-messaging`) | [✅](pages/public-messaging/default.html) | [✅](pages/public-messaging/loading.html) | [✅](pages/public-messaging/empty.html) | ➖ |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/public-messaging/chat.html) | [✅](pages/public-messaging/chat-empty.html) | [✅](pages/public-messaging/read.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-036`, `L2-REQ-037`, `L2-REQ-038` |
| Public · Onboarding (`public-onboarding`) | [✅](pages/public-onboarding/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/public-onboarding/profile.html) | [✅](pages/public-onboarding/unit.html) | [✅](pages/public-onboarding/unit-selected.html) | [✅](pages/public-onboarding/success.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-014` |
| Public · Profile (`public-profile`) | [✅](pages/public-profile/default.html) | ➖ | [✅](pages/public-profile/empty.html) | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/public-profile/edit.html) | [✅](pages/public-profile/password.html) | [✅](pages/public-profile/password-invalid.html) | [✅](pages/public-profile/password-error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-015`, `L2-REQ-016`, `L2-REQ-018`, `L2-REQ-019` |
| Admin · Landing (`admin-landing`) | [✅](pages/admin-landing/default.html) | ➖ | [✅](pages/admin-landing/empty.html) | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-053`, `L2-REQ-068`, `L2-REQ-070` |
| Admin · Login (`admin-login`) | [✅](pages/admin-login/default.html) | ➖ | ➖ | [✅](pages/admin-login/error.html) |  | [✅](pages/admin-login/invalid.html) | [✅](pages/admin-login/submitting.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-007`, `L2-REQ-076` |
| Admin · Register (`admin-register`) | [✅](pages/admin-register/default.html) | ➖ | ➖ | [✅](pages/admin-register/error.html) |  | [✅](pages/admin-register/invalid.html) | [✅](pages/admin-register/submitting.html) | [✅](pages/admin-register/mismatch.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-001`, `L2-REQ-044`, `L2-REQ-077` |
| Admin · Forgot Password (`admin-forgot-password`) | [✅](pages/admin-forgot-password/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-001` |
| Admin · Dashboard (`admin-dashboard`) | [✅](pages/admin-dashboard/default.html) | ➖ | [✅](pages/admin-dashboard/empty.html) | ➖ |  |  |  |  | [✅](pages/admin-dashboard/partial.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-009`, `L2-REQ-030`, `L2-REQ-035`, `L2-REQ-038` |
| Admin · Documents (`admin-documents`) | [✅](pages/admin-documents/default.html) | [✅](pages/admin-documents/loading.html) | [✅](pages/admin-documents/empty.html) | ➖ |  |  |  |  |  | [✅](pages/admin-documents/notices.html) | [✅](pages/admin-documents/bylaws.html) | [✅](pages/admin-documents/reports.html) | [✅](pages/admin-documents/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-035` |
| Admin · Maintenance (`admin-maintenance`) | [✅](pages/admin-maintenance/default.html) | [✅](pages/admin-maintenance/loading.html) | [✅](pages/admin-maintenance/empty.html) | ➖ |  |  |  |  |  |  |  |  | [✅](pages/admin-maintenance/no-results.html) | [✅](pages/admin-maintenance/new.html) | [✅](pages/admin-maintenance/started.html) | [✅](pages/admin-maintenance/done.html) |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-maintenance/received.html) | [✅](pages/admin-maintenance/detail-new.html) | [✅](pages/admin-maintenance/detail-received.html) | [✅](pages/admin-maintenance/detail-started.html) | [✅](pages/admin-maintenance/detail-completed.html) | [✅](pages/admin-maintenance/comments.html) | [✅](pages/admin-maintenance/comments-empty.html) |  |  |  |  |  |  |  | `L2-REQ-021`, `L2-REQ-025`, `L2-REQ-030` |
| Admin · Messaging (`admin-messaging`) | [✅](pages/admin-messaging/default.html) | [✅](pages/admin-messaging/loading.html) | [✅](pages/admin-messaging/empty.html) | ➖ |  |  |  |  |  |  |  |  | [✅](pages/admin-messaging/no-results.html) |  |  |  | [✅](pages/admin-messaging/chat.html) | [✅](pages/admin-messaging/chat-empty.html) | [✅](pages/admin-messaging/read.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-036`, `L2-REQ-037`, `L2-REQ-038` |
| Admin · Onboarding (`admin-onboarding`) | [✅](pages/admin-onboarding/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-onboarding/profile.html) | [✅](pages/admin-onboarding/unit.html) | [✅](pages/admin-onboarding/unit-selected.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-014` |
| Admin · Profile (`admin-profile`) | [✅](pages/admin-profile/default.html) | ➖ | [✅](pages/admin-profile/empty.html) | ➖ |  | [✅](pages/admin-profile/invalid.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-profile/edit.html) | [✅](pages/admin-profile/password.html) |  |  |  |  |  |  |  |  |  | [✅](pages/admin-profile/board-edit.html) |  |  |  |  |  |  | `L2-REQ-015`, `L2-REQ-016`, `L2-REQ-018`, `L2-REQ-019` |
| Admin · Profiles (`admin-profiles`) | [✅](pages/admin-profiles/default.html) | ➖ | [✅](pages/admin-profiles/empty.html) | ➖ |  | [✅](pages/admin-profiles/invalid.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-profiles/edit.html) | [✅](pages/admin-profiles/password.html) |  |  |  |  |  |  |  |  |  | [✅](pages/admin-profiles/board-edit.html) |  |  |  |  |  |  | `L2-REQ-015`, `L2-REQ-016`, `L2-REQ-018`, `L2-REQ-019` |
| Admin · Users (`admin-users`) | [✅](pages/admin-users/default.html) | ➖ | [✅](pages/admin-users/empty.html) | ➖ |  |  |  |  |  |  |  |  | [✅](pages/admin-users/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-users/page-2.html) |  |  |  |  |  | `L2-REQ-001`, `L2-REQ-002`, `L2-REQ-003`, `L2-REQ-013`, `L2-REQ-057` |
| Admin · Roles (`admin-roles`) | [✅](pages/admin-roles/default.html) | ➖ | [✅](pages/admin-roles/empty.html) | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-roles/no-privileges.html) | [✅](pages/admin-roles/member.html) |  |  |  | `L2-REQ-010`, `L2-REQ-011`, `L2-REQ-012` |
| Admin · Assets (`admin-assets`) | [✅](pages/admin-assets/default.html) | ➖ | [✅](pages/admin-assets/empty.html) | ➖ |  |  |  |  |  |  |  |  | [✅](pages/admin-assets/no-results.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-040`, `L2-REQ-041`, `L2-REQ-042` |
| Admin · Invitations (`admin-invitations`) | [✅](pages/admin-invitations/default.html) | ➖ | [✅](pages/admin-invitations/empty.html) | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-043`, `L2-REQ-044` |
| Admin · Settings (`admin-settings`) | [✅](pages/admin-settings/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/admin-settings/content.html) | [✅](pages/admin-settings/account.html) |  | `L2-REQ-045`, `L2-REQ-046` |
| Admin · Change Password (`admin-change-password`) | [✅](pages/admin-change-password/default.html) | ➖ | ➖ | [✅](pages/admin-change-password/error.html) |  | [✅](pages/admin-change-password/invalid.html) | [✅](pages/admin-change-password/submitting.html) | [✅](pages/admin-change-password/mismatch.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-004` |
| Public · Page (`public-page`) | [✅](pages/public-page/default.html) | [✅](pages/public-page/loading.html) | ➖ | [✅](pages/public-page/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | [✅](pages/public-page/not-found.html) | `L2-REQ-072`, `L2-REQ-073`, `L2-REQ-082`, `L2-REQ-083`, `L2-REQ-084` |
| Admin · Pages (`admin-pages`) | [✅](pages/admin-pages/default.html) | [✅](pages/admin-pages/loading.html) | [✅](pages/admin-pages/empty.html) | [✅](pages/admin-pages/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-080` |
| Admin · Board (`admin-board`) | [✅](pages/admin-board/default.html) | [✅](pages/admin-board/loading.html) | [✅](pages/admin-board/empty.html) | [✅](pages/admin-board/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `L2-REQ-085` |

### Dialogs

| Screen | default | busy | invalid | empty | failed | edit | Requirements |
|---|---|---|---|---|---|---|---|
| Public · Document Viewer (`public-document-viewer`) | [✅](dialogs/public-document-viewer/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-035` |
| Public · Maintenance Create (`public-maintenance-create`) | [✅](dialogs/public-maintenance-create/default.html) | ➖ | [✅](dialogs/public-maintenance-create/invalid.html) |  |  |  | `L2-REQ-021` |
| Public · Maintenance Detail (`public-maintenance-detail`) | [✅](dialogs/public-maintenance-detail/default.html) | ➖ | ➖ | [✅](dialogs/public-maintenance-detail/empty.html) |  |  | `L2-REQ-028`, `L2-REQ-029`, `L2-REQ-030` |
| Public · Profile Switcher (`public-profile-switcher`) | [✅](dialogs/public-profile-switcher/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-018` |
| Admin · Document Viewer (`admin-document-viewer`) | [✅](dialogs/admin-document-viewer/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-035` |
| Admin · Maintenance Create (`admin-maintenance-create`) | [✅](dialogs/admin-maintenance-create/default.html) | ➖ | [✅](dialogs/admin-maintenance-create/invalid.html) |  |  |  | `L2-REQ-021` |
| Admin · New Conversation (`admin-new-conversation`) | [✅](dialogs/admin-new-conversation/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-036` |
| Admin · User Create (`admin-user-create`) | [✅](dialogs/admin-user-create/default.html) | ➖ | [✅](dialogs/admin-user-create/invalid.html) |  |  |  | `L2-REQ-001` |
| Admin · User Edit (`admin-user-edit`) | [✅](dialogs/admin-user-edit/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-002` |
| Admin · User Delete (`admin-user-delete`) | [✅](dialogs/admin-user-delete/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-003` |
| Admin · Asset Upload (`admin-asset-upload`) | [✅](dialogs/admin-asset-upload/default.html) | [✅](dialogs/admin-asset-upload/busy.html) | ➖ |  |  |  | `L2-REQ-040` |
| Admin · Asset Detail (`admin-asset-detail`) | [✅](dialogs/admin-asset-detail/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-041` |
| Admin · Asset Delete (`admin-asset-delete`) | [✅](dialogs/admin-asset-delete/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-042` |
| Admin · Invitation Create (`admin-invitation-create`) | [✅](dialogs/admin-invitation-create/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-043` |
| Admin · Invitation Created (`admin-invitation-created`) | [✅](dialogs/admin-invitation-created/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-043` |
| Admin · Document Create (`admin-document-create`) | [✅](dialogs/admin-document-create/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-031` |
| Admin · Document Delete (`admin-document-delete`) | [✅](dialogs/admin-document-delete/default.html) | ➖ | ➖ |  |  |  | `L2-REQ-034` |
| Admin · Page Editor (`admin-page-editor`) | [✅](dialogs/admin-page-editor/default.html) | [✅](dialogs/admin-page-editor/busy.html) | [✅](dialogs/admin-page-editor/invalid.html) |  | [✅](dialogs/admin-page-editor/failed.html) | [✅](dialogs/admin-page-editor/edit.html) | `L2-REQ-080` |
| Admin · Page Remove (`admin-page-remove`) | [✅](dialogs/admin-page-remove/default.html) | [✅](dialogs/admin-page-remove/busy.html) | ➖ |  |  |  | `L2-REQ-080` |
| Admin · Director Editor (`admin-director-editor`) | [✅](dialogs/admin-director-editor/default.html) | [✅](dialogs/admin-director-editor/busy.html) | [✅](dialogs/admin-director-editor/invalid.html) |  | [✅](dialogs/admin-director-editor/failed.html) | [✅](dialogs/admin-director-editor/edit.html) | `L2-REQ-085` |
| Admin · Director Remove (`admin-director-remove`) | [✅](dialogs/admin-director-remove/default.html) | [✅](dialogs/admin-director-remove/busy.html) | ➖ |  |  |  | `L2-REQ-085` |

### Notifications

| Screen | info | success | warning | danger | Requirements |
|---|---|---|---|---|---|
| Public · Profile Saved (`public-profile-saved`) | ➖ | [✅](notifications/public-profile-saved/success.html) | ➖ | ➖ | `L2-REQ-015` |
| Admin · Profile Saved (`admin-profile-saved`) | ➖ | [✅](notifications/admin-profile-saved/success.html) | ➖ | ➖ | `L2-REQ-015` |
| Admin · Profiles Saved (`admin-profiles-saved`) | ➖ | [✅](notifications/admin-profiles-saved/success.html) | ➖ | ➖ | `L2-REQ-015` |
| Admin · Theme Saved (`admin-theme-saved`) | ➖ | [✅](notifications/admin-theme-saved/success.html) | ➖ | ➖ | `L2-REQ-045` |
| Admin · Password Saved (`admin-password-saved`) | ➖ | [✅](notifications/admin-password-saved/success.html) | ➖ | ➖ | `L2-REQ-004` |
| Admin · Dashboard Unread (`admin-dashboard-unread`) | [✅](notifications/admin-dashboard-unread/info.html) | ➖ | ➖ | ➖ | `L2-REQ-038` |
| Admin · Page Saved (`admin-page-saved`) | ➖ | [✅](notifications/admin-page-saved/success.html) | ➖ | ➖ | `L2-REQ-080` |
| Admin · Board Saved (`admin-board-saved`) | ➖ | [✅](notifications/admin-board-saved/success.html) | ➖ | ➖ | `L2-REQ-085` |

<!-- coverage:end -->
