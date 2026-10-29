# 0023. French text is stored beside the English, in an `fr` object per item

- Status: Accepted
- Date: 2026-10-29

## Context

The public site must be readable in English and French, with the office
writing the French in the admin's Website area and the English showing
wherever the French is missing (L1-REQ-024, L2-REQ-129 to L2-REQ-131). The
site content is one JSON document with a draft and a published copy
(ADR 0018). Its lists can be reordered, and website pages are rows in the
`Pages` table with their body blocks held as JSON. The database has no EF
migrations. The API creates the database with `EnsureCreated`, and the
production SQLite file is kept between deployments (ADR 0022), so a new
column or table would not reach the production database.

Options considered:

- A second, French copy of the whole site content and of each page. The
  copies drift apart as soon as the office adds, moves or removes an item
  in English, and matching items by position mixes up their texts.
- A table of translations keyed by content path. This is a schema change
  and needs a migration, and a path such as `home.sections.2.title` points
  to another section after a reorder.
- An `fr` object on each item that holds text, beside its English values.

## Decision

- Each object of the site content or of a page that holds text visitors
  read may carry `fr`: an object with the French text of the object's own
  values, keyed by the English value's name, for example
  `{ "title": "Welcome home", "fr": { "title": "Bienvenue chez vous" } }`. A
  checklist's French is a list of texts. Values that are not text (link
  addresses, choices, photo addresses and sizes, `hidden`) have no French.
- English is the site's language and French is the only other one. The
  languages are not content. A third language is a new requirement.
- In the API, the DTOs that hold text derive from `TranslatableDto`, which
  adds `Fr` (`Dictionary<string, JsonElement>?`, left out of the JSON when
  null). One rule, `FrenchText`, walks the request's JSON, finds every
  `fr` object, and refuses a value that is not text or a list of texts, or
  a text over 2000 characters. The English rules are unchanged.
- A page's own French (its title and photo description) is stored in the
  `Sections` column. The column then holds `{ "blocks": [...], "fr": {...} }`
  instead of the bare list of blocks. A page without French keeps the bare
  list, and both forms are read. No column is added.
- The public site lays the French over the English when it renders: a
  non-empty French text replaces its English value. Anything else (no `fr`,
  an empty text, a value of the wrong type) keeps the English value, and
  the built-in English defaults stay the last fallback (L2-REQ-100).
- The admin editor shows an optional French field below each text field and
  removes empty French texts before saving.

## Consequences

- French moves with its item when the office reorders, adds or removes
  items, and it is drafted, previewed, published and discarded with the
  English, with no new endpoint.
- Content without `fr` reads as before, so no data is rewritten.
- The site content's DTOs and the public types each gain an optional `fr`.
  The public `mergeContent` keeps `fr` objects it would otherwise drop.
- The `Sections` column holds two shapes. `PageSections` is the only code
  that reads or writes it.
- The board list's names and titles, the documents and the admin site stay
  in English.
