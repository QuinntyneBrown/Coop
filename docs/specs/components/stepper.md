# Stepper

| Field | Value |
|---|---|
| Selector | `coop-stepper` |
| Library path | `frontend/projects/components/src/lib/stepper/` |
| Status | planned |
| Traces to | L2-REQ-014 |
| Design system | [`stepper.html`](../../design-system/components/stepper.html) |
| Source mocks | [`pages/public-onboarding/default`](../../mocks/pages/public-onboarding/default.html), [`pages/public-onboarding/profile`](../../mocks/pages/public-onboarding/profile.html), [`pages/public-onboarding/unit`](../../mocks/pages/public-onboarding/unit.html), [`pages/public-onboarding/unit-selected`](../../mocks/pages/public-onboarding/unit-selected.html), [`pages/public-onboarding/success`](../../mocks/pages/public-onboarding/success.html), [`pages/admin-onboarding/default`](../../mocks/pages/admin-onboarding/default.html), [`pages/admin-onboarding/profile`](../../mocks/pages/admin-onboarding/profile.html), [`pages/admin-onboarding/unit`](../../mocks/pages/admin-onboarding/unit.html), [`pages/admin-onboarding/unit-selected`](../../mocks/pages/admin-onboarding/unit-selected.html) |
| Rendering | [`stepper.html`](stepper.html) |

## Purpose and scope

The stepper shows where a new member is in the short, linear onboarding flow that creates her profile (L2-REQ-014): a centred row of small dots, one per step, with the text "Step 2 of 4" beneath. Completed dots are faint accent, the current dot is accent and slightly larger, upcoming dots are grey. It is a progress indicator, not a control: people move with the "Back", "Next" and "Skip" buttons on the step, and the dots never respond to clicks.

Use something else instead when:

- the person must choose between views at will: [tabs](tabs.md);
- progress is a single long operation: [spinner](spinner.md).

Out of scope:

- Moving between steps, validating the profile form and selecting the unit. The onboarding page owns the flow and its "Back", "Next", "Skip" and "Go to Dashboard" buttons ([button](button.md)).
- Moving focus to the step heading when the step changes. The design-system page requires it; the page does it because it owns the heading.
- The step heading and description ("Set up your profile", "Tell us a little about yourself."); the stepper does not repeat the step name visibly.

## Usage

Every `.step-indicator` in `docs/mocks` (9 uses on 9 screens) is one of the configurations below. The public mocks wrap the dots in `.step-dots` with a `.step-label`; the admin mocks use a flat row with an `.active.current` ring. The design system unifies both on the ordered list below.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/public-onboarding/default` | 4 steps, `current` 1 | "Step 1 of 4"; steps "Welcome", "Set up your profile", "Select your unit", "All set" | current + 3 upcoming | page |
| `pages/public-onboarding/profile` | 4 steps, `current` 2 | "Step 2 of 4" | 1 completed, current, 2 upcoming | page |
| `pages/public-onboarding/unit`, `unit-selected` | 4 steps, `current` 3 | "Step 3 of 4" | 2 completed, current, 1 upcoming | page |
| `pages/public-onboarding/success` | 4 steps, `current` 4 | "Step 4 of 4" | 3 completed, current | page |
| `pages/admin-onboarding/default` | 3 steps, `current` 1 | "Step 1 of 3"; steps "Welcome to Your Cooperative!", "Set Up Your Profile", "Select Your Unit" | current + 2 upcoming | card |
| `pages/admin-onboarding/profile` | 3 steps, `current` 2 | "Step 2 of 3" | 1 completed, current, 1 upcoming | card |
| `pages/admin-onboarding/unit`, `unit-selected` | 3 steps, `current` 3 | "Step 3 of 3" | 2 completed, current | card |

Every row is buildable with the API below: a list of step names and a 1-based current step.

## Anatomy

1. **List** — `.step-indicator`, an `<ol>` named by `aria-label`. Centred flex row, `--space-3` gap, `--space-8` margin below, no list markers.
2. **Dot** — `.step-dot`, an `<li>`. 0.625rem (10 px) circle (`--radius-full`), `--color-border-strong` fill for an upcoming step. Holds the visually hidden step name (D-4).
3. **Completed dot** — `.step-dot.completed`: `--color-accent` at 0.5 opacity.
4. **Current dot** — `.step-dot[aria-current="step"]`: `--color-accent`, scaled 1.2.
5. **Label** — `.step-label`, a `<p role="status">` reading "Step 2 of 4" in `--text-body-sm` `--color-fg-muted`, centred under the dots (D-5).

Host: `coop-stepper` is `display: block`; the list and the label are rendered inside it and carry the classes.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `steps` | `string[]` | — | yes | The step names in order, one per dot: `['Welcome', 'Set up your profile', 'Select your unit', 'All set']`. Rendered visually hidden inside each dot; never shown. Three or four entries in the product. |
| `current` | `number` | — | yes | The current step, 1-based. Clamped to `1 … steps.length`. Dots before it are completed, after it upcoming. |
| `label` | `string` | — | yes | `aria-label` of the list: "Onboarding progress". |
| `stepLabel` | `string` | `'Step {n} of {total}'` | no | Template for the visible label; `{n}` and `{total}` are replaced. The default is the mocks' exact wording. |
| `labelTestId` | `string \| null` | `null` | no | Rendered as `data-testid` on the label paragraph (`onboarding-current-step`), because the paragraph is rendered by the component (D-8). |

Booleans: none. All inputs are signal inputs. The English default is overridable through `stepLabel`, so a translated app passes its own string (design-system content rule; there is no L2 requirement for translation).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The stepper is not interactive; the page changes `current` when its own buttons advance the flow. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Step names and the label are inputs; nothing is projected. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Dots with label | — | The only variant. Three steps (admin) or four (public) use the same markup. The admin mocks' `.active.current` ring is not rendered (design-system drift; D-6). |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | dots 0.625rem, current scaled 1.2 (0.75rem) | — | label `--text-body-sm` |

The row is as wide as its dots and gaps (about 78 px for four dots) and is centred by the list.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Upcoming dot | index > `current` | `--color-border-strong` circle | List item with the hidden step name |
| Current dot | index = `current` | `--color-accent` circle, `transform: scale(1.2)` | `aria-current="step"`; name read with "current step" |
| Completed dot | index < `current` | `--color-accent` at 0.5 opacity | List item with the hidden step name; its position before the current item conveys completion (D-4) |
| Step change | `current` changes | Colour and scale transition over `--duration-slow` | The label's `role="status"` announces "Step 3 of 4" |
| Hover, focus, active, disabled | — | None; the dots are not interactive and never take focus | — |

## Markup

```html
<!-- rendered: public flow, step 2 of 4 -->
<ol class="step-indicator" aria-label="Onboarding progress">
  <li class="step-dot completed"><span class="visually-hidden">Welcome</span></li>
  <li class="step-dot" aria-current="step"><span class="visually-hidden">Set up your profile</span></li>
  <li class="step-dot"><span class="visually-hidden">Select your unit</span></li>
  <li class="step-dot"><span class="visually-hidden">All set</span></li>
</ol>
<p class="step-label" role="status">Step 2 of 4</p>
```

```html
<!-- rendered: admin flow, last step -->
<ol class="step-indicator" aria-label="Onboarding progress">
  <li class="step-dot completed"><span class="visually-hidden">Welcome to Your Cooperative!</span></li>
  <li class="step-dot completed"><span class="visually-hidden">Set Up Your Profile</span></li>
  <li class="step-dot" aria-current="step"><span class="visually-hidden">Select Your Unit</span></li>
</ol>
<p class="step-label" role="status">Step 3 of 3</p>
```

The first step differs only in having no completed dot. The e2e onboarding page object locates the stepper by the `data-testid` the page puts on the host (`onboarding-step-indicator`) and the label by the one `labelTestId` renders on the paragraph (`onboarding-current-step`, D-8).

```html
<!-- consumer -->
<coop-stepper [steps]="stepNames" [current]="step()" label="Onboarding progress" data-testid="onboarding-step-indicator" labelTestId="onboarding-current-step"></coop-stepper>
```


## Design

- List: `display: flex`, `align-items: center`, `justify-content: center`, gap `--space-3`, `margin-bottom: --space-8`, `padding: 0`, `list-style: none`.
- Dot: `width` and `height` 0.625rem, `border-radius: --radius-full`; transitions `background-color` and `transform` over `--duration-slow` with `--ease-standard`.
- Current: `transform: scale(1.2)`; the row's height is set by the unscaled dots, so the scale overflows the box by 1 px without shifting anything.
- Label: `--text-body-sm`, `--color-fg-muted`, `text-align: center`, `margin: calc(-1 * var(--space-8) + var(--space-3)) 0 var(--space-8)` so it sits `--space-3` under the dots and the pair keeps the list's `--space-8` space below (D-5). `.step-label` is not yet in `components.css`; the rendering applies it as a specimen-only style and the first slice adds the rule.
- Layer: none; it sits at the top of the onboarding card or page.

Component tokens: none. `.step-indicator` and `.step-dot` consume semantic tokens directly in `components.css`.

## Colour

The product ships one light appearance (D-2); the Dark column repeats the light primitive.

| Part | Token | Light | Dark |
|---|---|---|---|
| Upcoming dot | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-500` |
| Current dot | `--color-accent` | `--palette-green-700` | `--palette-green-700` |
| Completed dot | `--color-accent` at 0.5 opacity | `--palette-green-700` | `--palette-green-700` |
| Label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-600` |
| Card behind (admin) | `--color-bg-surface` | `--palette-white` | `--palette-white` |
| Page behind (public) | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-50` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Upcoming dot on the admin card (non-text) |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Upcoming dot on the public page |
| `--color-accent` | `--color-bg-surface` | 3:1 | Current dot on the card |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Current dot on the page |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Label on the card |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Label on the page |

The completed dot (accent at 0.5 opacity on white, about 2.2:1) is below the 3:1 non-text minimum; it is acceptable only because the label and the list order carry the information, so the dots are never rendered without the label (design-system page). Under `forced-colors: active` the opacity and scale survive but the colours become `CanvasText`; the component adds a `--border-width-hairline` `CanvasText` edge to every dot and a solid `CanvasText` fill to the current dot under that media query (D-7).

## Responsive behaviour

- No media rule targets the stepper (design-system page). Four dots and the label are about 78 px wide and fit at every width; the row is centred.
- The onboarding page keeps the step actions clear of the bottom tab bar with its own bottom padding; the stepper adds nothing.
- At 320 px nothing scrolls horizontally or clips, and at 400 % zoom the dots and label stay visible and the label wraps if a translated string needs to (AGENTS.md reflow rule; WCAG 1.4.10).
- Targets: none; the stepper is not interactive.

## Accessibility

### Role and pattern

An `<ol>` of step items with `aria-current="step"` on the current one ([WAI-ARIA `aria-current`](https://www.w3.org/TR/wai-aria-1.2/#aria-current), value `step`), named by `aria-label`, followed by a `role="status"` label. There is no ARIA widget: nothing is focusable or operable. The mocks hide nothing and expose nothing; the list semantics, step names, label and live region are design-system requirements, and the exposed list is this CRD's choice over the design-system's `aria-hidden` dots (D-4).

### Keyboard

| Key | Action |
|---|---|
| None | The dots are not focusable and have no keyboard behaviour. The page's "Back", "Next" and "Skip" buttons move the flow with ordinary <kbd>Tab</kbd> and <kbd>Enter</kbd>. |

### Focus

Nothing in the stepper takes focus. When the step changes, the page moves focus to the new step's heading (design-system requirement owned by the page); the stepper's status announcement then precedes the heading.

### Labelling

- The list is named "Onboarding progress" (`label`).
- Each dot's accessible name is its step name from `steps`, rendered in a `.visually-hidden` span; the current dot also carries `aria-current="step"`.
- The visible label "Step 2 of 4" is the text of the status paragraph; it is never hidden from assistive technology.
- Progress is never colour alone: the current dot is larger, the label states the number, and the names state the step (WCAG 1.4.1).

### Announcements

The label is `role="status"`: when `current` changes, "Step 3 of 4" is announced politely once. It is in the DOM from first render, so the initial step is not announced twice when the page also moves focus to its heading.

### Motion

`background-color` and `transform` transition over `--duration-slow` (300 ms). Under `prefers-reduced-motion: reduce` tokens.css shortens `--duration-slow` to 0.01 ms, so the current dot changes without visible movement; the component adds no animation.

## Content and internationalisation

- Visible label: "Step {n} of {total}": "Step 1 of 4", "Step 3 of 3". The total is the length of `steps` and is the same on every step.
- Step names are the step headings the page shows: public "Welcome", "Set up your profile", "Select your unit", "All set"; admin "Welcome to Your Cooperative!", "Set Up Your Profile", "Select Your Unit". Each is a short phrase; the page keeps them consistent with its headings.
- Translatable inputs: `steps`, `label`, `stepLabel`. Data values: `current`.
- A French label ("Étape 2 sur 4") is the same length; a long translated step name is hidden text and cannot affect layout.

## Performance

- Change detection: `OnPush`, signal inputs; the dot states are one `computed` over `steps` and `current`.
- Perf-test scenario: none; the workspace has no perf-test project (D-3).
- Composite scenarios: none.
- Layout stability: the row's height is fixed by the 10 px dots and the label by one line of `--text-body-sm`; the scale transform does not affect layout, so a step change shifts nothing below.
- Weight: imports `@angular/core` and `@angular/common` only; no CDK.

## Acceptance criteria

### Rendering

- **AC-1** Given `steps` of four names and `current` 2, when it renders, then the DOM holds an `ol.step-indicator[aria-label="Onboarding progress"]` with four `li.step-dot` items, the first with `.completed`, the second with `aria-current="step"`, the third and fourth with neither. (L2-REQ-014)
- **AC-2** Given the same inputs, when it renders, then the paragraph `.step-label[role="status"]` reads exactly "Step 2 of 4" and is visible under the dots. (L2-REQ-014)
- **AC-3** Given the admin flow with three names and `current` 3, when it renders, then the first two dots are `.completed`, the third is current, the label reads "Step 3 of 3" and no `.active` or `.current` class is emitted. (L2-REQ-014)
- **AC-4** Given `current` 1, when it renders, then no dot is `.completed`, the first dot is current and the label reads "Step 1 of 4". (L2-REQ-014)
- **AC-5** Given each dot, when inspected, then it contains a `.visually-hidden` span with its step name ("Set up your profile") and shows no visible text. (L2-REQ-014)
- **AC-6** Given `labelTestId="onboarding-current-step"`, when it renders, then the label paragraph carries `data-testid="onboarding-current-step"`. (L2-REQ-014)

### States

- **AC-7** Given the current dot, when measured, then its fill is `--color-accent` at full opacity and it is scaled 1.2 (12 px) while the upcoming dots are 10 px in `--color-border-strong` and the completed dots are 10 px in `--color-accent` at 0.5 opacity. (L2-REQ-014)
- **AC-8** Given `current` changes from 2 to 3 after the profile step is saved, when change detection runs, then the second dot becomes `.completed`, the third gains `aria-current="step"`, the colours and scale transition over `--duration-slow`, and the label reads "Step 3 of 4". (L2-REQ-014)
- **AC-9** Given `current` 9 with four steps, when it renders, then the fourth dot is current and the label reads "Step 4 of 4". (L2-REQ-014)

### Keyboard and focus

- **AC-10** Given the onboarding profile step, when <kbd>Tab</kbd> is pressed from the top of the page, then focus never lands on a dot or on the label and reaches the "First Name" field directly. (L2-REQ-014)

### Screen readers

- **AC-11** Given the public flow at step 2, when a screen reader reads the stepper, then it announces "Onboarding progress, list, 4 items", "Welcome", "Set up your profile, current step", "Select your unit", "All set" and then "Step 2 of 4". (L2-REQ-014)
- **AC-12** Given `current` changes from 2 to 3, when the label updates, then assistive technology announces "Step 3 of 4" once without moving focus. (L2-REQ-014)

### Theming

- **AC-13** Given any stepper, when the page sets `data-theme="dark"`, then it renders with the same light tokens because no dark theme is defined, and no hard-coded colour appears in its styles. (L2-REQ-014)

### Responsive

- **AC-14** Given the four-step stepper at 320 px and 400 % zoom, when measured, then the dots stay centred on one row, the label is fully visible beneath them and the page does not scroll horizontally. (L2-REQ-014)

### Motion

- **AC-15** Given `prefers-reduced-motion: reduce`, when `current` advances, then the dot colours and scale change with a 0.01 ms transition and nothing animates. (L2-REQ-014)

### Performance

- **AC-16** Given the onboarding page with the stepper above the profile form, when a form field's value changes, then the stepper does not re-render (`OnPush` with signal inputs), and a `current` change re-renders only the two dots whose state changed and the label text. (L2-REQ-014)

## Implementation notes

- Folder `frontend/projects/components/src/lib/stepper/`: `stepper.component.ts|html|css`, `step-state.ts` (the `'completed' | 'current' | 'upcoming'` type alias); export from `public-api.ts`.
- The template renders `@for (name of steps(); track $index)` with the class and `aria-current` from the computed state, then the label paragraph.
- `.visually-hidden` is defined in the component's own stylesheet (the design-system `ds.css` rule is documentation chrome, not product CSS); `.step-label` is added to `components.css` in the first slice (D-5).
- The forced-colours edge rule (D-7) lives in the component stylesheet under `@media (forced-colors: active)`.
- No CDK primitive; composes nothing. The public and admin onboarding pages compose it above their step content.
- The first slice updates `prefix` to `coop` in `frontend/angular.json` and the selector rules in `frontend/projects/components/eslint.config.js` (D-1).

## Decisions

- **D-1** *Which selector prefix?* `coop-`. The workspace's `lib` prefix in `angular.json` and the components ESLint config is the Angular generator default, not a product choice; the first implementation slice changes both to `coop`.
- **D-2** *What does the dark rendering show?* The same light tokens. The design-system README and tokens.css define no dark theme ("Not specified. Light only."); the CRD renders the required dark block without inventing colours.
- **D-3** *Which perf-test scenario?* None. The workspace has no perf-test project; the Performance section specifies change detection, layout stability and weight only.
- **D-4** *Are the dots decorative (`aria-hidden`, as the design-system code shows) or an exposed list?* An exposed `<ol>` with a visually hidden step name in each item and `aria-current="step"` on the current one. The design-system page offers both forms and says to use the list if the dots are ever exposed; exposing them lets a screen-reader user hear what the remaining steps are, not only how many, and keeps the visible "Step 2 of 4" as a plain status. Completion is conveyed by position in the list, so no extra "completed" text is needed.
- **D-5** *Where does the label sit and what class does it carry?* Centred under the dots as `.step-label`, the public mocks' class, with a negative top margin that reuses the list's `--space-8` space below. The design-system page puts the label beside the dots in its code sample but renders it beneath in every example; the mocks render it beneath, and a stacked label is what fits at 320 px.
- **D-6** *Is the admin `.current` ring rendered?* No. The design system resolves the admin and public drift on the public form (completed, current, upcoming) and the shared stylesheet has no ring; the scale and the label already mark the current step.
- **D-7** *How do the dots survive forced colours?* Every dot gets a `CanvasText` hairline edge and the current dot a solid `CanvasText` fill. Forced colours flatten the accent and grey to one colour, so without an edge the upcoming dots vanish and without a fill the current one is indistinguishable.
- **D-8** *How does the e2e page object find the label?* Through a `labelTestId` input rendered on the paragraph. The onboarding page object reads `onboarding-current-step` for the text "Step n of N" and `onboarding-step-indicator` on the container; the host attribute covers the container and the input covers the inner paragraph.
