# NDRS Roadmap

Tracks the planned development arc. Each version lands only after the previous is stable. See `AGENTS.md` §8 for the rationale.

---

## v14.2605.1 (first stable)

Promote the current beta after a round of in-session testing.

- [ ] Verify all 14 conditions render correctly across DE and EN.
- [ ] Verify the Exhaustion table renders with correct mod values.
- [ ] Verify the calendar grid wraps cleanly at narrow widths.
- [ ] Confirm `tools/ndrs-validate.mjs --audit-2024` is clean.
- [ ] Test Only-Sheet button injection with `only-sheet` installed.
- [ ] Test Actor Directory header button when Only-Sheet is *not* installed.
- [ ] Test journal-button deeplinks (`.ndrs-open-btn` with `data-ndrs-tab`).
- [ ] Test `Shift + R` keybinding (default and rebound).
- [ ] Smoke test under FANG-fantasy and FANG-cyberpunk themes (NDRS stays fantasy in both).

## v14.2605.2

- [ ] Tag filter chip bar above the card grid (combat / social / exploration / new-2024).
- [ ] Print stylesheet (`@media print`) for tablet/table screenshots.
- [ ] Compact-mode toggle (titles only, denser grid).
- [ ] Add FR, ES, PT-BR language stubs (English-fallback).

## v14.2606.x

- [ ] Populate `scripts/data/phb-links.de.js` with UUIDs from the German PHB compendium.
- [ ] Populate `scripts/data/phb-links.en.js` if a maintained English PHB module is available.
- [ ] Activate the "Im PHB öffnen" / "Open in PHB" button in the modal when the matching module is active.
- [ ] Hide the button gracefully when no PHB module is installed.

## v14.2607.x — Combat Rules tab

- [ ] Cover (half / three-quarters / total).
- [ ] Surprise & initiative details.
- [ ] Two-Weapon Fighting deep-dive (interactions with weapon mastery).
- [ ] Critical hits and the 2024 damage-doubling rule.
- [ ] Cover & range interactions for ranged attacks.

## v14.2608.x — Exploration & Travel tab

- [ ] Travel pace and per-hour distance.
- [ ] Vision and light (bright / dim / darkness, lightly / heavily obscured).
- [ ] Short rest, long rest, interruption rules.
- [ ] Foraging, watch shifts, encounters per day.

## v14.2609.x — Spell Mechanics tab

- [ ] Concentration rules and the concentration check formula.
- [ ] Components (V / S / M) and what each requires.
- [ ] Counterspell mechanics in 2024.
- [ ] Ritual casting.
- [ ] Spell scrolls and how the Magic action interacts.

## v14.2610.x — Tools & Skills tab

- [ ] Skill use vignettes (one per skill: typical DC, common pitfalls).
- [ ] Tool proficiencies and what each unlocks mechanically.
- [ ] Help interaction with skills (when can you genuinely help).

## Stretch (undated)

- [ ] GM custom notes per rule entry (world-scope setting + socket relay).
- [ ] Simple Calendar bridge.
- [ ] Add IT, PL, RU, CS, NL languages.
- [ ] Pop-out compact view for a secondary monitor.
- [ ] Theme-aware print export to PDF.

---

## Out of scope (will not be implemented)

- Character sheet replacement (use the dnd5e system sheets).
- Spell list / item / monster browser (use the PHB compendium browser).
- Dice rolling or condition application (use the dnd5e system or FANG).
- Encounter builder or initiative tracker.
- Homebrew rule editor (custom notes is the only authored surface, and only as a stretch feature).
