# Changelog

All notable changes to NDRS are documented in this file.
Versioning follows the FANG scheme: `<foundry-major>.<YYMM>.<patch>` (see `AGENTS.md`).

---

## [14.2609.2] — The window stays on the screen

### Fixed
- On a tablet the window opened wider and taller than the screen and ran off
  the bottom edge: the lower part of the content was unreachable. Moving it
  did not help, because its title bar was already at the top, and the only
  remedy — dragging the bottom edge up — was itself off-screen. NDRS opened
  at 1100 pixels wide, which is wider than an iPad in landscape.
- `scripts/fensterpassen.js` now caps width and height against the visible
  area, keeps the whole window inside it rather than just its top-left
  corner, and re-checks after every draw and whenever the viewport changes
  — rotating a tablet, an on-screen keyboard opening, a split screen.
  Anything that does not fit scrolls instead of being cut off.

### Note
- The code for this shipped in the repository on 7 September without a
  version of its own, so it reached neither the server nor the package. It
  does now.

### Changed
- `styles/ninjo-marke.css` carries the shared brand tokens, loaded before the
  module’s own stylesheet so the module’s tokens can point at it.

---

## [14.2609.1] — Welcome window, and a button that finds both sheet views

### Added
- A welcome window on first start, following the pattern shared by the other
  modules: what NDRS does, three points on how to use it, and a pointer to
  the Forge. Shown to the GM only, remembered per device, and “don’t show
  again” is respected — dismissing or pressing Escape counts as “later”.
  The logo ships inside the module rather than being fetched from the
  website, so the first impression is never an empty box.

### Changed
- NDRS registers its button with the sheet view of Ninjo’s In-Person Tools
  through its API (`api.sheetView.registerButton`) instead of only watching
  for Sheet Only’s bar. Both paths stay: with Sheet Only the button shows up
  there as before. The `onlySheetButton` setting governs both.
- The welcome window carried `fa-book-open`, the icon dropped in 14.2608.3
  for being indistinguishable from Sheet Only’s journal button. It now uses
  `fa-rectangle-list` like every other place the module represents itself.

### Note on the version number
- The work above sat under `14.2608.4` while it was being written. That is an
  August number and it was cut in September, so it moved to `14.2609.1`
  before any of it was tagged or published. No release ever carried
  `14.2608.4`.

---

## [14.2608.3] — Distinguishable Only-Sheet button

### Changed
- The button NDRS injects into the Only-Sheet bar used `fa-book-open`, which
  sat directly beside Only-Sheet's own journal button (`fa-book`). At that
  icon size the two were nearly indistinguishable, so the quickest way into
  the reference sheet looked like a second journal button.
- NDRS now identifies itself with `fa-rectangle-list` in all three places it
  represents itself: the Only-Sheet bar, the Actor Directory button and the
  window title. The icon reads as a reference card rather than a book, and it
  exists in the free Font Awesome set as well, so it survives outside Foundry.
- The "Open in the Player's Handbook" button inside a card keeps
  `fa-book-open`: it does open a book, and it never appears next to the
  Only-Sheet bar.

---

## [14.2608.2] — Sidebar button fix

### Fixed
- The Actor Directory button wrapped its label onto two lines in the narrow
  sidebar, leaving it twice as tall as the controls around it. Smaller type,
  tighter padding and a single-line layout with an ellipsis fallback; the
  icon now carries the gold accent.

---

## [14.2608.1] — Review pass

A critical review of the module, with the findings verified against the
Foundry client source rather than assumed.

### Fixed
- Scroll position was reset on every re-render, so opening a card, typing in
  the search box or pinning a favourite jumped the list back to the top.
- Escape closed the whole window instead of the open card. It now dismisses
  the dialog first, then the search, before Foundry's global dismiss applies.
- Search matched only titles, subtitles and tags; it now also covers
  summaries, examples and notes, and spans every tab instead of one.
- Favourites are now pinned to the top of their section instead of only
  being tinted gold.
- Cards were unreachable by keyboard. They are now focusable buttons with
  Enter/Space activation and a visible focus ring; the detail dialog has
  proper dialog semantics and takes focus.
- The calendar's fixed three-column month grid overflowed in narrow windows.
  Layout now steps down to two columns and one, and honours
  prefers-reduced-motion.
- The Actor Directory button had no styling of its own.
- Handbook links no longer stay hidden when the window was opened before the
  index finished building, and are resolved only for the card being shown.

### Changed
- Page numbers removed from source citations. They were placeholders (all
  conditions shared one page), and the dialog presented them as verified.
  The book is still cited; a page may be added once actually checked.
- Hardcoded greys replaced by semantic CSS tokens.

### Tooling
- The 2024 rules audit never checked anything: it looked for language keys
  containing the entry id, which never matches the actual key names. Fixed —
  and it immediately caught that the Influence entry had lost its framing as
  an explicit action, now restored in both languages.
- Added `tools/ndrs-smoke-test.mjs`, which runs the render logic against
  stubbed Foundry globals. It caught a missing calendar constant that would
  have shipped every month without its day grid.

---

## [14.2605.1] — First stable release

First public release on GitHub and the Foundry package registry.
Rule text follows the official German dnd5e 2024 translation (Rules Glossary).

### Added
- Foundry VTT v13/v14 module skeleton (ApplicationV2 + HandlebarsApplicationMixin).
- Four core tabs: Round Actions (Action / Bonus / Reaction), Movement, Conditions (incl. 2024 Exhaustion table), Homebrew Calendar.
- Full content set: 12 actions, 4 bonus actions, 4 reactions, 8 movement entries, 14 conditions + 6-level exhaustion, 12-month calendar with 5 holidays + leap-year holiday.
- Full-text search across the active tab (with Esc to clear).
- Per-user favorites stored as a user flag.
- FT/M unit toggle in the footer; instant rerender of unit-aware entries.
- "Neu 2024" / "New 2024" gold badges on cards whose mechanics changed in the 2024 PHB.
- Detail modal with Summary / Example / Notes sections and source citation footer.
- Only-Sheet button injection (configurable on/off).
- Actor Directory header button.
- Journal-button delegated click pattern (`.ndrs-open-btn` with optional `data-ndrs-tab`).
- Keybinding `Shift + R` to toggle the window.
- Module API: `open`, `close`, `toggle`, `gotoTab`, `setSearch`.
- Localization: full `de.json` and `en.json`.
- Validator (`tools/ndrs-validate.mjs`) with `--audit-2024` mode.
- Documentation: `README.md`, `DEVELOPER_GUIDE.md`, `AGENTS.md`, `CONTENT-INVENTORY.md`, `TODO.md`.
- MIT license.

### Notes
- Optional Player's Handbook cross-references: when a supported handbook module is active, expanded cards show a link to the matching page. No hardcoded UUIDs — pages are matched by name at runtime.
- The homebrew calendar uses Harptos month and holiday names; rename them freely in `lang/*.json` for your own setting.
