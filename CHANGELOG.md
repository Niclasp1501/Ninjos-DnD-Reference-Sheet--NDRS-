# Changelog

All notable changes to NDRS are documented in this file.
Versioning follows the FANG scheme: `<foundry-major>.<YYMM>.<patch>` (see `AGENTS.md`).

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
