# Avatar

| Field | Value |
|---|---|
| Selector | `coop-avatar` |
| Library path | `frontend/projects/components/src/lib/avatar/` |
| Status | planned |
| Traces to | L2-REQ-014, L2-REQ-016, L2-REQ-070, L2-REQ-071 |
| Design system | [`avatar.html`](../../design-system/components/avatar.html) |
| Source mocks | [`pages/admin-dashboard/default`](../../mocks/pages/admin-dashboard/default.html), [`pages/admin-users/default`](../../mocks/pages/admin-users/default.html), [`pages/admin-profile/default`](../../mocks/pages/admin-profile/default.html), [`pages/admin-profiles/default`](../../mocks/pages/admin-profiles/default.html), [`pages/public-profile/default`](../../mocks/pages/public-profile/default.html), [`pages/public-profile/empty`](../../mocks/pages/public-profile/empty.html), [`pages/public-landing/default`](../../mocks/pages/public-landing/default.html), [`pages/admin-landing/default`](../../mocks/pages/admin-landing/default.html), [`pages/admin-messaging/chat`](../../mocks/pages/admin-messaging/chat.html), [`pages/public-messaging/default`](../../mocks/pages/public-messaging/default.html) |
| Rendering | [`avatar.html`](avatar.html) |

## Purpose and scope

An avatar marks a person, or a conversation, with a filled circle: the initials of the signed-in member in the sidebar footer, of each user in the admin users table, of a board member on the landing page cards, of the conversation subject in the messaging list, and the large mark on the profile pages. When a profile has an avatar image (a digital asset, L2-REQ-016) the circle shows the image instead of the initials; when the avatar is cleared the initials return.

It is decorative. The person's name is always printed next to it, or the avatar sits inside a labelled control, so by default it is hidden from assistive technology.

Use something else instead when:

- the circle is a document type or asset thumbnail: the `.icon-tile` of [list item](list-item.md) and [card](card.md);
- the control is the upload button beside the avatar: [icon button](icon-button.md) (`icon="upload"`, "Upload photo");
- the field is the onboarding "Profile Photo (optional)" upload area: [form field](form-field.md).

Out of scope:

- Computing initials from a name. The feature's view model derives "MF" from "Mira Fern" and "C" from "Courtyard gathering" and passes `initials` (D-6).
- Uploading, cropping or clearing the image, and resolving the asset identifier to a URL. The profile page owns the file input and passes `src`.
- Any click behaviour. If an avatar must be clickable it is wrapped in a button or link that carries the label (design-system page).
- The board card grid and its column count ([card](card.md), landing page; D-14).

## Usage

Every `.user-avatar`, `.avatar-circle`, `.member-avatar`, `.conv-avatar`, `.chat-avatar` and `.avatar-placeholder` in `docs/mocks` (119 uses on 89 screens) is one of the configurations below. The design system resolves the five classes and the three per-user colours to `.avatar` with one accent fill (D-5, D-9).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| every admin screen, sidebar footer (`.user-avatar` 32 px) | `size="sm"`, `initials="M"`, decorative | "M" beside "mira.fern" and "Member" | default | sidebar surface |
| `pages/admin-users/*` user cell (`.user-avatar` 36 px, blue, amber or red) | `size="md"` (default), decorative | "M", "T", "N", "O" beside the username | default | card (table) |
| `pages/admin-profile/*`, `pages/admin-profiles/*`, `notifications/admin-profile-saved/success`, `notifications/admin-profiles-saved/success` (`.avatar-circle` 100 px) | `size="lg"`, decorative | "MF"; "M" on `empty` | default | card |
| `pages/public-profile/*`, `dialogs/public-profile-switcher/default`, `notifications/public-profile-saved/success` avatar section (`.avatar-placeholder` 96 px, person icon) | `size="lg"`, `initials="MF"`, `src` when the profile has an avatar asset; beside the upload icon button | "MF", or the image | initials, image, image cleared | card |
| `pages/public-landing/default`, `pages/admin-landing/default` board cards (`.member-avatar` 60 or 64 px) | `size="lg"`, decorative, centred above the name | "MF" Treasurer, "TM" President, "NV" Secretary | default | card |
| `pages/admin-messaging/*`, `pages/public-messaging/*`, `dialogs/admin-new-conversation/default` conversation list (`.conv-avatar` 42 px) and chat header (`.chat-avatar` 38 px) | `size="md"`, decorative | "C" beside "Courtyard gathering" | default | surface (list item) |

Every row is buildable with the API below: three sizes, initials, an optional image and an optional accessible name.

## Anatomy

1. **Container** — `.avatar` (+ `.avatar-sm` or `.avatar-lg`). Inline-flex circle, `--avatar-size` wide and tall, `--radius-full`, `--color-accent` fill, `flex-shrink: 0`.
2. **Initials** — the text node: one or two capital letters in `--text-label` at `--font-weight-semibold`, `--color-fg-on-accent`; `--font-size-2xl` in the large size. Shown when there is no image or the image failed.
3. **Image (optional)** — `<img class="avatar-img" alt="">` filling the circle (`object-fit: cover`, radius inherited). Shown when `src` is set and has loaded; replaces the initials (D-4).

Host: `coop-avatar` is `display: inline-flex` with `flex-shrink: 0` and carries no classes of its own; `.avatar`, the size class and the ARIA attributes go on the inner `<span>` (D-5).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `initials` | `string` | — | yes | Rendered uppercased and cut to the first two characters (grapheme clusters): "mf" → "MF", "MFX" → "MF". Also the fallback while an image loads or after it fails. |
| `name` | `string \| null` | `null` | no | When set, the circle gets `role="img"` and `aria-label="{name}"`; when `null` it gets `aria-hidden="true"`. Set it only where no adjacent text names the person (D-11). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | `sm` adds `.avatar-sm` (2rem), `lg` adds `.avatar-lg` (6.25rem), `md` adds nothing (2.25rem). |
| `src` | `string \| null` | `null` | no | URL of the profile's avatar asset. When set, renders the image form; `null` renders initials. An image that fails to load falls back to initials (D-10). |

All inputs are signal inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The avatar is static. A load failure is handled inside the component (D-10) and not reported; the page learns about upload failures from its own request. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Initials and the image come from inputs so the component can switch between them and enforce the two-character rule. |

Translation: `name` is the only string input and carries data (a person's name), so the component holds no copy (design-system content rule; there is no L2 requirement for translation).

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Initials | — | Every avatar in the mocks: one accent fill, white initials. The design system defines no other colour. |
| Image | `src` set | A profile whose avatar asset is set (L2-REQ-016 AC1); the same circle, filled by the photo. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| sm | `.avatar-sm` | `--avatar-size` = 2rem | — (text centred) | `--text-label` at `--font-weight-semibold` |
| md | — | `--avatar-size` = 2.25rem | — | `--text-label` at `--font-weight-semibold` |
| lg | `.avatar-lg` | `--avatar-size` = 6.25rem | — | `--text-label` at `--font-size-2xl`, `--font-weight-semibold` |

Width always equals height. The mocks' 38, 42, 60, 64 and 96 px circles map to md (38, 42) and lg (60, 64, 96, 100) per the design-system page (D-7, D-8).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Initials | `src` null | Accent circle with initials | Hidden (`aria-hidden="true"`), or named by `name` |
| Image | `src` set and loaded | The photo fills the circle; initials not rendered | As above; the `<img>` has `alt=""` |
| Image failed | `src` set, `error` event | Initials, as if `src` were null | As above |
| Cleared | `src` returns to null | Initials return (L2-REQ-016 AC2) | As above |

The avatar has no hover, focus, active, disabled, loading or selected state: it is not a control. The design-system page shows the initials state only; the image states are specified here for L2-REQ-016 (D-4).

## Markup

```html
<!-- rendered: sizes, initials, decorative -->
<span class="avatar avatar-sm" aria-hidden="true">M</span>
<span class="avatar" aria-hidden="true">MF</span>
<span class="avatar avatar-lg" aria-hidden="true">MF</span>
```

```html
<!-- rendered: image form -->
<span class="avatar avatar-lg" aria-hidden="true"><img class="avatar-img" src="/api/assets/8f2c…" alt=""></span>
```

```html
<!-- rendered: named, where no adjacent text names the person -->
<span class="avatar" role="img" aria-label="Mira Fern">MF</span>
```

```html
<!-- rendered: in its usual places -->
<div class="sidebar-footer"><span class="avatar avatar-sm" aria-hidden="true">M</span><div><span>mira.fern</span><br><span>Member</span></div></div>
<td><div class="user-cell"><span class="avatar" aria-hidden="true">T</span><span>tavi.moss</span></div></td>
<div class="board-member-card card"><span class="avatar avatar-lg" aria-hidden="true">TM</span><h3>Tavi Moss</h3><p>President</p></div>
```

```html
<!-- consumer -->
<coop-avatar size="sm" [initials]="initialsOf(user)"></coop-avatar>
<coop-avatar [initials]="initialsOf(user)"></coop-avatar>
<coop-avatar size="lg" [initials]="initialsOf(profile)" [src]="profile.avatarUrl"></coop-avatar>
<coop-avatar initials="C"></coop-avatar>
```

The classes and attributes above are part of the contract: the e2e page objects locate the sidebar, table and profile avatars by `.avatar`, its size class and the `<img>` inside it.

## Design

- Size `--avatar-size` (2rem, 2.25rem, 6.25rem by size) as both width and height; `flex-shrink: 0` so a long name beside it wraps instead of squashing the circle.
- Initials `--text-label` (medium 14 px) raised to `--font-weight-semibold`; `lg` sets `--font-size-2xl` (24 px). Centred by flex; no padding.
- Shape `--radius-full`; no border.
- Image: `width: 100%; height: 100%; object-fit: cover; border-radius: inherit; display: block` on `.avatar-img`, so a non-square photo is cropped to the circle, not distorted. This rule is the component's and is listed as a design-system addition (D-4).
- Motion: none. Switching between initials and image is a plain swap.
- Layer: none; the avatar sits in the flow of its footer, cell, card or list item.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--avatar-size` | 2.25rem | `.avatar-sm` (2rem), `.avatar-lg` (6.25rem) |

The block reads `--color-accent` and `--color-fg-on-accent` directly and declares no colour tokens of its own.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Initials | `--color-fg-on-accent` | `--palette-white` | `--palette-white` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Initials on the circle (14 px and 24 px) |
| `--color-accent` | `--color-bg-surface` | 3:1 | Circle edge on a card or the sidebar |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Circle edge on the page |

The initials are decorative text and the circle edge is decorative, so neither is required to meet a minimum; both clear it anyway, which is why the design system replaced the mocks' per-user amber and blue fills (white on amber is below 4.5:1, D-9). Under `forced-colors: active` the fill flattens to `Canvas` and the initials to `CanvasText`; the component adds no colour of its own.

## Responsive behaviour

- The avatar does not change size at any breakpoint (design-system page).
- `flex-shrink: 0` keeps the circle round beside long text: the conversation title "Courtyard gathering" and its preview wrap at 320 px while the 36 px circle holds.
- On board member cards the large avatar is centred above the name by the card; whether the landing grid shows one or two columns at 320 px (D-14), a 100 px circle fits inside each card without clipping.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom the circle scales with the page (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: not a target. The 32 px small size is below `--target-min` only because the avatar is never the control itself (design-system page).

## Accessibility

### Role and pattern

Presentational `<span>`; no WAI-ARIA widget pattern. Decorative by default (`aria-hidden="true"`) because the name is adjacent; `role="img"` with `aria-label` only when `name` is set.

### Keyboard

| Key | Action |
|---|---|
| Not applicable | The avatar takes no focus and handles no keys. When wrapped in a control, that control owns the shared focus ring. |

### Focus

None.

### Labelling

- Default: `aria-hidden="true"`; the adjacent text ("mira.fern", "Tavi Moss", "Courtyard gathering") is what a screen reader reads.
- Named: `role="img"` and `aria-label="Mira Fern"` when `name` is set; the inner `<img>` keeps `alt=""` so the name is not read twice.
- Where the avatar stands alone inside a control, the control's `aria-label` names the person and the avatar stays hidden (design-system page).
- Initials are never the accessible name: they are decoration, and "MF" read aloud is noise.

### Announcements

None. Setting or clearing the image changes nothing for assistive technology; the profile page's status region reports the upload result ([alert](alert.md)).

### Motion

None. No property transitions; `prefers-reduced-motion` changes nothing.

## Content and internationalisation

- Initials are the first letter of the first name and of the last name, in capitals: "MF" for Mira Fern, "TM" for Tavi Moss, "NV" for Neri Vale, "O" for a single-word name, "C" for the conversation "Courtyard gathering". Never more than two characters; never a whole name.
- Always print the full name beside the avatar; the initials do not replace it.
- Translatable inputs: none. Data values: `initials`, `name`, `src`.
- Scripts without upper case render as given; the two-character cut counts grapheme clusters, so a name in a script with combining marks keeps its first two letters intact (D-6).

## Performance

- Change detection: `OnPush`, signal inputs; the displayed initials and the class list are `computed`; the image-failed flag is a `signal` set by the `error` event.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the circle has a fixed size from `--avatar-size`, so an image loading inside it, failing, or being cleared never shifts the layout.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK, no HTTP (the consumer resolves `src`).

## Acceptance criteria

### Rendering

- **AC-1** Given `<coop-avatar size="sm" initials="M">` in the sidebar footer beside "mira.fern", when it renders, then the DOM holds `<span class="avatar avatar-sm" aria-hidden="true">M</span>`, a 2rem circle with a `--color-accent` fill and `--color-fg-on-accent` initials. (L2-REQ-014)
- **AC-2** Given `size="lg"` and `initials="MF"` on the admin profile page for Mira Fern, when it renders, then it has `.avatar.avatar-lg`, is 6.25rem across and sets the initials at `--font-size-2xl`. (L2-REQ-014)
- **AC-3** Given the users table rows for mira.fern, tavi.moss, neri.vale and oren.reed with no `size`, when they render, then each is a 2.25rem `.avatar` with the same `--color-accent` fill and no per-user colour. (L2-REQ-014)
- **AC-4** Given `initials="mf"` and `initials="MFX"`, when they render, then the text is "MF" in both cases. (L2-REQ-014)

### Image

- **AC-5** Given Mira Fern's profile has an avatar asset and `src` is its URL, when the large avatar renders, then the DOM holds `<span class="avatar avatar-lg" aria-hidden="true"><img class="avatar-img" src="…" alt=""></span>`, the image fills the circle and no initials are rendered. (L2-REQ-016)
- **AC-6** Given that avatar, when the profile's avatar is cleared and `src` becomes `null`, then the `<img>` is removed and the initials "MF" are shown again. (L2-REQ-016)
- **AC-7** Given `src` set to a URL that fails to load, when the `error` event fires, then the initials "MF" are shown and no broken-image icon is visible. (L2-REQ-016)
- **AC-8** Given a 400 × 300 px image, when it renders in the large avatar, then it is cropped to the 6.25rem circle with `object-fit: cover` and not distorted. (L2-REQ-016)

### Board member cards

- **AC-9** Given the board card for Tavi Moss, President, when it renders, then a `.avatar.avatar-lg` reading "TM" sits centred above the heading "Tavi Moss" and the title "President". (L2-REQ-070)
- **AC-10** Given the public landing page, whose mock draws a person icon in each board card, when the cards render with this component, then each shows initials ("MF", "TM", "NV") and no icon. (L2-REQ-070)

### Screen readers

- **AC-11** Given the decorative avatar beside "mira.fern" in the sidebar footer, when the footer is read by assistive technology, then "mira.fern" and "Member" are read and "M" is not. (L2-REQ-014)
- **AC-12** Given `name="Mira Fern"` on an avatar with no adjacent text, when queried by assistive technology, then its role is img and its name is "Mira Fern"; with `src` also set the inner image has an empty `alt` and the name is read once. (L2-REQ-016)

### Theming

- **AC-13** Given any size, when the page sets `data-theme="dark"`, then the avatar renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-014)

### Responsive

- **AC-14** Given the users table user cell at 320 px with the username "mira.fern", when measured, then the avatar is a 2.25rem circle (`flex-shrink: 0`) and the username wraps or the table card scrolls inside itself; the circle is never squashed. (L2-REQ-014)
- **AC-15** Given the board member cards at 320 px, when measured, then each large avatar is 6.25rem across, centred in its card, and nothing clips or scrolls horizontally. (L2-REQ-071)

### Performance

- **AC-16** Given the users table with ten avatars, when one row's `src` changes, then only that avatar re-renders (`OnPush` with signal inputs) and the row's height does not change. (L2-REQ-016)

## Implementation notes

- Folder `frontend/projects/components/src/lib/avatar/`: `avatar.component.ts`, `avatar.component.html`, `avatar.component.css`, `avatar-size.ts` (type alias); export from `public-api.ts`.
- The template renders the `<span>` with `[class.avatar-sm]`, `[class.avatar-lg]`, `[attr.aria-hidden]` (true when `name` is null) and `[attr.role]`/`[attr.aria-label]` (when `name` is set); inside it `@if (src() && !failed()) { <img class="avatar-img" [src]="src()" alt="" (error)="failed.set(true)"> } @else { {{ shownInitials() }} }`. An effect resets `failed` to false whenever `src` changes.
- `shownInitials` uses `Intl.Segmenter` (grapheme) to take two clusters, then `toLocaleUpperCase()`.
- `.avatar-img` (`width: 100%; height: 100%; object-fit: cover; border-radius: inherit; display: block`) lives in `avatar.component.css` until `components.css` adds it (D-4).
- No CDK primitive; composes nothing. [Sidebar](sidebar.md), [table](table.md), [list item](list-item.md), [card](card.md) (board member card) and the profile pages compose it; the profile page places the [icon button](icon-button.md) "Upload photo" beside it.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Does the avatar show an image when the design-system page says "no photos"?* Yes. L2-REQ-016 requires a profile avatar to be set from a digital asset and cleared to null, and the public profile mock already has an upload button and `accept="image/*"` input; the design-system page documents only what the mocks captured. The image form is the same circle filled by the photo, with initials as the fallback, and the `.avatar-img` rule is listed for `components.css` to adopt.
- **D-5** *`<span>` or `<div>`?* `<span>`. The design-system page's code sample uses `<div>` but its sidebar, table and list-item pages render `<span class="avatar">`, and a span is valid inside the inline contexts the avatar sits in (a table cell's user cell, a list row). The look is identical because `.avatar` is `inline-flex`.
- **D-6** *Who computes the initials?* The consumer. Deriving "MF" from first and last name, or "C" from a conversation subject, is view-model logic that AGENTS.md keeps beside the feature; the component only enforces the design-system rule of at most two capital characters, counted as grapheme clusters so no script loses a letter.
- **D-7** *Which size do board member cards use?* `lg`. The design-system page says the mocks' 60 and 64 px circles are not added to the scale and to use large or default; the card leads with the avatar as its feature (L2-REQ-070 AC2), and a 36 px list mark would read as a row, not a card. A 100 px circle fits a 320 px card in either column count.
- **D-8** *Which size do the conversation list and chat header use?* `md`. The mocks' 42 and 38 px circles are closest to the 36 px default, and the list-item page renders the conversation avatar as the default `.avatar`.
- **D-9** *Are the users table's per-user colours kept?* No. The design-system page resolves them to the single accent fill because white on the mock's amber fails 4.5:1; the username beside the avatar distinguishes the rows.
- **D-10** *What happens when an image fails?* The initials show, with no event. The circle must never be empty or show a broken-image icon, and the profile page already learns the outcome of an upload from its own request.
- **D-11** *When is `name` set?* Only where nothing adjacent names the person. Every usage in the mocks has the name beside the avatar, so the default is decorative; the input exists for the shared contract and for a control that shows the avatar alone.
- **D-12** *Is the onboarding "Profile Photo (optional)" area an avatar?* No. It is a file field with a label and an upload target; the form field CRD owns it. The profile page's upload button is an icon button placed beside this component.
- **D-13** *Is there a placeholder icon when a profile has no image?* No. The public profile and public landing mocks draw a person outline; the design-system page defines initials as the only content, and initials are always available because a profile has a first and last name (L2-REQ-014 AC1).
- **D-14** *How many columns do board cards have at XS and SM?* Not decided here. L2-REQ-071 AC1 says a single column at XS/SM; the landing mocks and the responsive foundation show two columns at 640 px and below. The avatar fits both, so this CRD specifies the avatar inside a card of either width and leaves the grid to the card and landing-page work, where the conflict must be settled.
