# Show the public site in English and French

## Overview

The public site was written in English only. Visitors can now read it in
French. The office writes the French beside the English in the admin's
Website area, and the English shows wherever no French was written
(`L1-REQ-024`, `L2-REQ-129` to `L2-REQ-131`, ADR 0023). The languages are
fixed: English is the site's language and French is the only other one.

The French travels with the content it translates. Every object of the site
content or of a website page that holds text visitors read may carry an
`fr` object with the French of its own values, keyed by the English value's
name. Because the French sits on its own item, it moves when the office
reorders items, and it is saved, previewed, published and discarded with
the English (`L2-REQ-121`). No endpoint, table or column is added.

The feature belongs to the public-app subsystem of Coop. It also touches
the API's content DTOs and the admin's page editor
(`../../admin-app/website-area/`).

Terms used in this design:

- **French text** — the value of a key in an `fr` object: a text, or a list
  of texts for a checklist
- **fixed label** — a word of the public site that is not content, such as
  "Skip to content" or "Menu"; the public app holds it in both languages
- **language bar** — the strip above the site header with the button that
  names the other language

## Description

### Content shape

```json
{ "kind": "hero", "title": "A home of our own.", "fr": { "title": "Un chez-soi bien à nous." },
  "primaryAction": { "label": "Book a visit", "href": "/#visit", "fr": { "label": "Réservez une visite" } } }
```

Only text visitors read has French: link addresses, choices, photo
addresses and sizes and `hidden` are the same in both languages. A page's
own French (`title`, `heroImageAlt`) is in the page's `fr`.

### API

`TranslatableDto` (`Coop.Application/CMS/Dtos/`) holds `Fr`, a
`Dictionary<string, JsonElement>?` left out of the JSON when null. The header,
the footer, a link, every home section (through `HomeSectionDto`), a value
card, a figure, a feature row, a gallery photo, a photo, every page block
(through `PageBlockDto`) and `PageDto` derive from it. `CreatePageRequest`
and `UpdatePageRequest` take `Fr` for the page.

`FrenchText` (`CMS/SiteContent/FrenchText.cs`) serializes the request,
finds every `fr` object and accepts only texts and lists of texts of at most
2000 characters. `SaveSiteContentValidator`, `CreatePageValidator` and
`UpdatePageValidator` apply it, so a bad value answers 400 with "Keep each
French text under 2000 characters." (`L2-REQ-129` AC3).

`PageSections` writes a page's `Sections` column as the bare list of blocks
when the page has no French of its own, and as
`{ "blocks": [...], "fr": {...} }` when it has some; it reads both forms.
The production SQLite file is kept between deployments and has no
migrations (ADR 0022), so no column is added. The command-line tool's
export and import carry the `fr` objects because they use the same DTOs.

### Public application

- `LanguageService` (`core/services/language.service.ts`) holds the
  language: `?lang=en|fr` when the address has it, else the choice stored
  under `coop.language` in `localStorage`, else English. Every storage call
  is wrapped so a browser that refuses storage still switches. An effect
  keeps `<html lang>` in step. `labels` is the matching entry of `UI_TEXT`
  (`core/language/ui-text.ts`, typed by `UiLabels`).
- `translate(value, language)` (`core/language/translate.ts`) walks the
  content. In French, a non-empty French text replaces the English value of
  the same name, and a non-empty list of texts replaces an English list.
  Every `fr` object is dropped from the result. In English it only drops
  them.
- `mergeContent` keeps a published object's `fr` when it lays the content
  over `SITE_DEFAULTS`, so the built-in English defaults stay the last
  fallback (`L2-REQ-100`). `SiteContentService.content` becomes
  `computed(() => translate(state(), language()))`.
- `SiteHeaderComponent` draws the language bar above the sticky header,
  with a button named in the other language and marked with its `lang`. The
  button is at least 3rem tall at every width, and the phone menu does not
  need to be opened. Pressing it toggles the language and sets a visually
  hidden polite status. The button stays in place, so focus stays on it.
  The header's website pages, the content page's page and the tab title go
  through `translate` too.
- The fixed labels of the header, the home page's section labels, the
  content page's loading, error and not-found states and the preview banner
  read `labels()`.

### Admin application

The page editor draws, below each text, paragraph or checklist field, a
field labelled "{label} in French" (`frenchLabel`) marked `lang="fr"` and
bound to the item's `fr` object. Below each photo description it draws
"Photo description in French". The banner of a website page has "Page
title in French" and "Photo description in French". A note at the top of
the form explains the French fields (`L2-REQ-130`).

`toDraft` gives every item and photo an `fr` object and turns French
checklists into one text. `fromDraft` trims the French, splits checklists
and drops empty French with `frenchOf`. `writeSection` drops a home
section's saved `fr` when the edited value has none. `validateBlock` gives
a French text its English field's length limit at the path `…fr.{key}`
(`frenchPath`). Choosing a new photo clears its French description with
the English one. The Website area itself stays in English.

### Tests

`backend/tests/Coop.Api.Tests/FrenchTextTests.cs` covers saving, publishing
and reading the French of the site content and of a page, content without
French, and the refused values. `Coop.Cli.Tests/ContentCommandTests.cs`
imports content with French. The Playwright `public` project covers the
language bar, the fallback, the fixed labels, the remembered choice,
`?lang=`, a website page and 320 CSS px in `e2e/tests/public/language.spec.ts`.
The `admin` project covers the French fields in
`e2e/tests/admin/french.spec.ts`. The mock API stores and returns a page's
`fr` the way the API does.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-REQ-129` | `L1-REQ-024` | The API shall accept, store and return the French text of the site content and of website pages, and shall refuse French text that is not text or is too long. |
| `L2-REQ-130` | `L1-REQ-024` | The page editor shall show, below each text the visitors read, an optional field for its French text, and shall save it with the English. |
| `L2-REQ-131` | `L1-REQ-024`, `L1-REQ-020` | The public site shall let a visitor switch between English and French on every page that has the site header, shall remember the choice, and shall show the English text wherever the French is missing. |

## Diagrams

The PlantUML sources are in `diagrams/`. Render them with PlantUML as the
other designs do.

- `diagrams/class.puml` — `TranslatableDto` and the DTOs that derive from
  it, `FrenchText`, `PageSections`, the public `LanguageService`,
  `translate` and `UI_TEXT`, and the admin's draft helpers.
- `diagrams/sequence-switch-language.puml` — the site loads in the
  remembered language, the visitor presses "Français", and the content and
  labels show in French with the English filling in.
