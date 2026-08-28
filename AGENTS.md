# Agent Notes — NDRS

Operational rules for contributors and AI agents working on **Ninjo's DnD Reference Sheet (NDRS)**. Companion to `DEVELOPER_GUIDE.md`. Where the guide covers *what* the module looks like and *how* it is structured, this file covers *how* we work on it.

---

## 1. Versioning

NDRS uses the FANG version scheme:

```
<foundry-major>.<YYMM>.<patch>
```

Rules:

- `<foundry-major>` is the primary Foundry VTT major version targeted (e.g., `14`).
- `<YYMM>` is the release year and month (e.g., `2605` for May 2026).
- `<patch>` starts at `1` each new month, increments for each additional stable release that month.
- Git tags use the module version with a `v` prefix, e.g., `v14.2605.1`.
- Versions never decrease.

Beta releases derive from the upcoming stable base version:

```
14.2605.2-beta.<run>
```

A persistent beta install link is the `beta-latest` GitHub prerelease manifest. Both channels share the same module id (`ndrs`). One channel per world — no parallel stable+beta installs in the same world.

The first internal milestone is `0.1.0` (skeleton, not released).
The first public beta is `14.2605.1-beta.1`.
The first stable is `14.2605.1`.

---

## 2. Strict 2024-Rules Discipline

NDRS is a **D&D 5.5 (2024 PHB)** reference. The 2014 rules are explicitly out of scope. Mixing them in silently is the single biggest content risk this module faces — older material is widely available online and easy to paste in accidentally.

### 2.1 Required for Every Rule Entry

- `source.book` is set, typically `"PHB 2024"`.
- `source.page` is optional. Set it only when the page has actually been checked in the book; an approximate or shared page number is worse than none, because the modal presents it as a citation.
- Card text is **our own concise summary**, not copied prose from any rulebook.
- Examples reference 2024 mechanics (e.g., the 2024 exhaustion scale, the new Influence action, the new Study action, Grapple/Shove as Unarmed-Strike options).
- If the rule changed between 2014 and 2024, set `new2024: true` and add a `notesKey` that names the change in one sentence.

### 2.2 Forbidden Phrasings (2014 leftovers)

The 2024-audit greps for these patterns. They almost always indicate a 2014-era summary slipped in. If a match is genuinely necessary (e.g., a historical note in `notesKey`), wrap the sentence with an `<!-- audit-ok: 2014-reference -->` HTML comment.

German triggers:

- "1 Stufe Erschöpfung pro" + "Stufe" (old linear exhaustion language)
- "Nachteil auf Attributswürfe" as the *only* exhaustion effect at level 1
- "Hilfe-Aktion" + "Vorteil" without mention of the 5-foot/1.5-meter reach requirement
- "Verstecken" + "unsichtbar" without referencing the Invisible *condition* (2024 ties them explicitly)
- "Wahnsinnig" as a condition name (not a 2024 condition)
- Any reference to a 2014 page number (PHB 2014 typically cited as "PHB" with no year)

English triggers:

- "level of exhaustion" + "disadvantage on ability checks" as the level-1 effect
- "Help action" + "within 5 feet" without mentioning the ally-vs-creature distinction
- "Hide action" + "until you attack or cast a spell" without referencing the Invisible condition
- "Stealth check" + "DC 10 passive Perception" as the only contest framing
- "Player's Handbook" without a year qualifier when used as a source

### 2.3 Required Phrasings (per affected entry)

For specific rule entries, the audit *requires* certain 2024 markers:

| Entry | Must contain (any language) |
|---|---|
| `exhaustion` | "−2" or "minus 2" or "−1,5 m" or "−5 ft" or "6 Stufen" or "6 levels" |
| `influence` | mention as an explicit action (not just "social check") |
| `study` | mention as an explicit action with Intelligence-based skills |
| `hide` | references the **Invisible condition** |
| `grapple` | described as an option of the **Unarmed Strike** action |
| `shove` | described as an option of the **Unarmed Strike** action |
| `unconscious` | mentions the **Prone** condition link (you fall Prone) |
| `jump` | uses 2024 jump-distance formula (Strength score for long, 3 + Str mod for high) |

The validator (`tools/ndrs-validate.mjs --audit-2024`) checks both lists against `lang/de.json` and `lang/en.json` per affected entry id.

### 2.4 When in Doubt

If you cannot confirm a rule against the 2024 PHB:

1. Mark the entry as `draft: true` in the data module (excluded from production builds).
2. Open an issue with the title `[2024-verify] <ruleId>` and cite the page you consulted.
3. Do not ship until verified.

---

## 3. Source Material — Read-Only Access

The following directories are **reference only**. NDRS never writes to them, copies files out of them, or imports their content verbatim.

- `F:\KI-Agenten-Workspace\Ninjo´s DnD5e55 Spielerhandbuch-Deutsch\` — German PHB compendium (Foundry packs). Used as research cross-check when summarizing rules.
- The official English D&D 2024 PHB (your own copy / publisher channels). Used as the authoritative rules source.

Rules:

- Read packs through Foundry's API at runtime (`fromUuid`) if needed for future deeplinks. Never `Edit` or `Write` files in the source folder.
- Card summaries are **our prose**, not paraphrases that approach the source wording. Aim for substantively different phrasing and structure.
- Examples must be original (invented scenarios, not lifted from the rulebook's own examples).
- If a rule cannot be summarized cleanly in our own words, that is a signal it needs more thought, not closer paraphrasing.

---

## 4. Foundry Patterns

### 4.1 Journal Buttons and Links

When NDRS injects buttons or links inside Foundry journal pages, do not rely on a single sheet-render hook. Foundry v13/v14 renders journal pages through multiple sheet paths, and saved journal HTML can outlive the renderer that originally produced it.

Use this pattern:

- Give the element a module-specific class, e.g., `ndrs-open-btn`.
- Prefer a plain `<a>` or `<button>` with your own class. Avoid depending on Foundry's `content-link` behavior unless the element is a real document link with a valid `data-uuid`.
- Install one global delegated click listener in `Hooks.once("ready")`, capture phase.
- The handler resolves the closest matching element, calls `preventDefault()` and `stopPropagation()`, then calls the module API.
- Specific render hooks may be added as progressive enhancement, never as the only attachment path.

Example handler:

```js
function _ndrsOpenFromJournalButton(event) {
  const button = event?.target?.closest?.(".ndrs-open-btn");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  const api = game.modules.get("ndrs")?.api;
  if (!api?.open) return;

  api.open();
  const tab = button.dataset?.ndrsTab;
  if (tab) api.goto(tab);
}

Hooks.once("ready", () => {
  if (window._ndrsJournalButtonFixInstalled) return;
  document.addEventListener("click", _ndrsOpenFromJournalButton, true);
  window._ndrsJournalButtonFixInstalled = true;
});
```

Saved journal content stays simple:

```html
<a class="ndrs-open-btn" data-ndrs-tab="conditions" style="cursor:pointer">
  Zustände im Cheat-Sheet öffnen
</a>
```

### 4.2 Only-Sheet Integration

Mirror FANG's approach with a `MutationObserver` on `#so-main-buttons`. Inject `ndrs-so-btn` once when the container appears. Match Only-Sheet's `button` class for visual consistency. NDRS only **adds** a button; it never replaces existing Only-Sheet buttons (unlike FANG's optional actor-replacement).

### 4.3 ApplicationV2 Only

NDRS targets Foundry v13 and v14, and uses `foundry.applications.api.ApplicationV2` with `HandlebarsApplicationMixin`. No legacy `Application` class, no `FormApplication`. No jQuery in module code (Foundry still ships it, but we don't depend on it).

### 4.4 Keybinding

Register `Shift+R` as the default toggle keybinding (`openCheatSheet`). Users may rebind. The handler toggles render/close on the singleton app instance.

---

## 5. Localization Discipline

- Every user-visible string lives in `lang/de.json` and `lang/en.json`. No exceptions.
- New strings are added to both files in the same commit.
- The validator (`tools/ndrs-validate.mjs`) fails if either file is missing a key the other has.
- Empty string values fail the validator.
- Other languages (FR, ES, PT-BR, IT, PL, RU, CS, NL) are added starting in v14.2605.2 following FANG's coverage.

---

## 6. Peer Review Checklist (Content Changes)

Before merging any PR that adds or edits a rule entry:

1. `source.book` is set; any `source.page` given has been verified against the 2024 PHB.
2. Card subtitle is one sentence, ≤ 100 characters.
3. Summary is in our own words, 3–6 sentences (validator warns above 8).
4. Example is original (not lifted) and uses 2024 mechanics.
5. If the rule changed in 2024, `new2024: true` and `notesKey` explains the change.
6. The entry's lang keys exist in both `de.json` and `en.json`.
7. `node tools/ndrs-validate.mjs --audit-2024` passes for the touched entry.
8. No forbidden 2014 phrases (§2.2) appear without an `audit-ok` comment.
9. Required 2024 phrasings (§2.3) appear if the entry is on the list.

---

## 7. Peer Review Checklist (Code Changes)

Before merging any PR that touches `scripts/` or `styles/`:

1. New UI uses NDRS CSS variables, not hardcoded colors.
2. No hardcoded strings in JS or HBS; everything goes through `game.i18n.localize`.
3. ApplicationV2 patterns followed (no legacy class extensions).
4. Module loads cleanly in Foundry v13 and v14 with no console errors.
5. Cheat-Sheet opens via keybinding, Only-Sheet button, and Actor Directory button.
6. No writes to actors, items, journals, or the source PHB folder.
7. `node tools/ndrs-validate.mjs` passes.

---

## 8. Stretch Features — Activation Order

Features beyond v1 land in this order. Each lands only after the previous one is stable and reviewed.

1. **v14.2605.2** — Tag filter chips, "Neu 2024" badges, print stylesheet.
2. **v14.2606.x** — PHB deeplinks. Activate `phbUuid` field and "Im PHB öffnen" modal button when `dnd-players-handbook-deutsch` (DE) or the equivalent English PHB module is active. UUIDs live in `scripts/data/phb-links.{de,en}.js`, populated incrementally.
3. **v14.2607.x** — Combat Rules tab (cover, surprise, initiative details).
4. **v14.2608.x** — Exploration & Travel tab (travel pace, vision, resting).
5. **v14.2609.x** — Spell Mechanics tab (concentration, components, counterspell).
6. **v14.2610.x** — Tools & Skills tab.
7. **Stretch, undated** — GM custom notes per rule entry (requires socket relay following FANG's player-edit pattern).
8. **Stretch, undated** — Simple Calendar module bridge.

---

## 9. Out of Scope

Things NDRS will not become. If a contributor suggests these, redirect to the appropriate existing tool.

- Character sheet replacement → use the dnd5e system sheets.
- Spell list browser → use the PHB compendium browser.
- Item catalog → use the PHB compendium browser.
- Dice rolling, damage application, condition application → use the dnd5e system or FANG.
- Encounter builder, initiative tracker → out of scope.
- Homebrew rule editor → out of scope (GM custom notes is the only authored-content surface, and only as a stretch feature).

NDRS stays a cheat-sheet. Scope discipline is the feature.
