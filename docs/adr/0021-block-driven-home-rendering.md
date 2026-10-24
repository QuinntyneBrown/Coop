# 0021. The public home page renders an ordered list of sections by kind

- Status: Accepted
- Date: 2026-10-24

## Context

The public home page's section order was fixed in
`landing.component.html`, and the site content held one named object per
block (`home.hero`, `home.glance`, …). Content could change every word but
could not reorder or hide a section; that was a release. The proposal
`docs/proposals/content-management-reimagined.md` asks for an ordered list
with a `kind` per section and a `hidden` flag (L2-REQ-122), rendered by the
existing templates, with the built-in defaults still the fallback
(L2-REQ-100).

## Decision

- `home` holds `sections`: an ordered list where each entry has a `kind`
  (`hero`, `glance`, `about`, `gallery`, `features`, `notices`, `board`,
  `quote`, `visit`), an optional `hidden` flag and that kind's values. The
  values of each kind are unchanged from the former named objects.
- At most one section of each kind. The kinds are the nine that exist; a
  new kind is a new requirement, not content.
- The API's `HomeContentDto` holds `List<HomeSectionDto> Sections`, with
  System.Text.Json polymorphism on `kind` (`JsonPolymorphic` and
  `JsonDerivedType` on `HomeSectionDto`; out-of-order metadata allowed so
  clients need not write `kind` first). `SaveSiteContentValidator` applies
  each kind's rules through `SetInheritanceValidator`, rejects an unknown
  kind (model binding refuses it) and a repeated kind.
- The startup seed rewrites a stored `SiteContent` or `SiteContentDraft`
  entry in the earlier shape into `sections` in the default order, once,
  and the rewrite is safe to re-run. The API still seeds on startup
  (`AGENTS.md`); this is the migration path until EF migrations exist.
- The public `HomeContent` becomes `{ sections: HomeSection[] }` with a
  discriminated `kind`. `SITE_DEFAULTS.home.sections` is the default list.
  `mergeHomeSections` lays each published section over the default of its
  kind value by value, keeps the published order and `hidden`, drops an
  unknown kind, and falls back to the default list when `sections` is
  missing or not a list.
- `LandingComponent` iterates the merged list and switches on `kind` with
  the former section templates. Hidden sections are skipped. Each section
  carries a stable id (`top`, `glance`, `about`, `life`, `features`,
  `events`, `board`, `quote`, `visit`) for menu links, footer links and the
  preview pane.
- Header and footer keep their shape; they are not sections.

## Consequences

- Reordering or hiding a section is content and needs no release.
- Hiding a section does not remove the menu or footer links that point to
  it; the office edits those under Menu and footer, and the mocks show
  the hidden state with the link removed.
- Clients that read `home.hero` and its siblings stop working; the admin,
  the public app, the CLI tests and the Playwright mock move to `sections`
  in the same change.
- Position-based styling stays: value-card colours and feature-row sides
  follow position within their section, not the section's place on the
  page.
