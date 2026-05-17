# NDRS Content Inventory — v14.2605.1

Complete list of every rule card shipped in v1. Use this as the single-source-of-truth when reviewing content coverage and when scheduling translation work.

Column legend:

- **ID** — the unique kebab-case identifier used in `scripts/data/*.js`.
- **Title** — German title (English mirrors it in `lang/en.json`).
- **Tags** — used by the upcoming tag-filter chips (v14.2605.2).
- **Src** — source page in the 2024 PHB.
- **U** — `✓` if the entry has metric/imperial variants.
- **2024** — `★` if the entry is marked `new2024: true` (gold badge in UI).

---

## Tab 1 — Round Actions

### Section: Aktion (`scripts/data/actions.js`)

| ID | Title (DE) | Tags | Src | U | 2024 |
|---|---|---|---|---|---|
| `attack` | Angreifen | combat, core | 25 | | ★ |
| `magic` | Magie | combat, magic, core | 25 | | ★ |
| `dash` | Spurt | movement, core | 25 | | |
| `disengage` | Rückzug | movement, combat, core | 25 | | |
| `dodge` | Ausweichen | defense, core | 25 | | |
| `help` | Helfen | support, core | 25 | ✓ | ★ |
| `hide` | Verstecken | stealth, exploration, core | 25 | | ★ |
| `influence` | Beeinflussen | social, core | 25 | | ★ |
| `ready` | Vorbereiten | combat, tactics, core | 26 | | |
| `search` | Suchen | exploration, core | 26 | | ★ |
| `study` | Studieren | knowledge, core | 26 | | ★ |
| `utilize` | Verwenden | utility, core | 26 | | ★ |

### Section: Bonusaktion (`scripts/data/bonus-actions.js`)

| ID | Title (DE) | Tags | Src | U | 2024 |
|---|---|---|---|---|---|
| `ba-overview` | Bonusaktion | combat, core | 24 | | |
| `ba-offhand` | Nicolas (Off-Hand-Angriff) | combat, two-weapon | 27 | | ★ |
| `ba-spell` | Bonusaktions-Zauber | magic | 24 | | ★ |
| `ba-class` | Klassen-Bonusaktionen | class | 24 | | |

### Section: Reaktion (`scripts/data/reactions.js`)

| ID | Title (DE) | Tags | Src | U | 2024 |
|---|---|---|---|---|---|
| `rx-overview` | Reaktion | combat, core | 24 | | |
| `rx-opportunity` | Gelegenheitsangriff | combat, core | 27 | ✓ | |
| `rx-ready` | Vorbereitete Reaktion | combat, tactics | 26 | | |
| `rx-spell` | Zauber-Reaktionen | magic | 24 | | |

---

## Tab 2 — Movement (`scripts/data/movement.js`)

| ID | Title (DE) | Tags | Src | U | 2024 |
|---|---|---|---|---|---|
| `mv-speed` | Bewegungsweite | movement, core | 22 | ✓ | |
| `mv-difficult` | Schwieriges Gelände | movement, exploration | 22 | | |
| `mv-jump` | Springen | movement | 22 | ✓ | ★ |
| `mv-climb` | Klettern | movement, exploration | 22 | | |
| `mv-swim` | Schwimmen | movement, exploration | 22 | | |
| `mv-crawl` | Kriechen | movement | 22 | | |
| `mv-fall` | Fallen | movement, hazard | 22 | ✓ | |
| `mv-standup` | Aufstehen | movement, combat | 22 | | |

---

## Tab 3 — Conditions (`scripts/data/conditions.js`)

| ID | Title (DE) | Tags | Src | U | 2024 |
|---|---|---|---|---|---|
| `cond-Blinded` | Blind | condition | 36 | | |
| `cond-Charmed` | Bezaubert | condition | 36 | | |
| `cond-Deafened` | Taub | condition | 36 | | |
| `cond-Frightened` | Verängstigt | condition | 36 | | |
| `cond-Grappled` | Festgehalten | condition | 36 | | ★ |
| `cond-Incapacitated` | Handlungsunfähig | condition | 36 | | ★ |
| `cond-Invisible` | Unsichtbar | condition | 36 | | ★ |
| `cond-Paralyzed` | Gelähmt | condition | 36 | | |
| `cond-Petrified` | Versteinert | condition | 36 | | |
| `cond-Poisoned` | Vergiftet | condition | 36 | | |
| `cond-Prone` | Liegend | condition | 36 | | |
| `cond-Restrained` | Gefesselt | condition | 36 | | |
| `cond-Stunned` | Betäubt | condition | 36 | | |
| `cond-Unconscious` | Bewusstlos | condition | 36 | | ★ |

### Section: Erschöpfung (`scripts/data/exhaustion.js`)

Custom-rendered table (not a card grid). Six cumulative levels with −2 per level on all d20 tests and −5 ft / −1.5 m speed per level. Level 6 = death. Marked `new2024`.

---

## Tab 4 — Calendar (`scripts/data/calendar.js`)

Custom-rendered view (not a card grid). Homebrew structure:

- 12 months × 30 days, each split into 3 ten-day weeks ("Zehntag" / "Tenday").
- 5 intercalary holidays between months: New Year, Spring Festival, Midsummer, Harvest Day, Winter Solstice.
- 1 leap-year holiday "Schildtreff" / "Shieldmoot", inserted after Midsummer every 4 years.

Month and holiday names are i18n-keyed so GMs can freely rename them in their own world (planned UI for v14.2606.x).

---

## Totals

| Category | Count |
|---|---|
| Action cards | 12 |
| Bonus action cards | 4 |
| Reaction cards | 4 |
| Movement cards | 8 |
| Condition cards | 14 |
| Custom views (Exhaustion + Calendar) | 2 |
| **Total cards** | **42** |
| Cards marked `new2024` | 11 |
| Cards with FT/M variants | 5 |

---

## Coverage gaps acknowledged for v1

These are deliberately out of scope for the first stable release. Tracked in `TODO.md` for later versions:

- Combat tactics beyond round actions (cover, surprise, crit doubling) → v14.2607.x
- Exploration & travel (pace, vision, resting) → v14.2608.x
- Spell mechanics (concentration, components, counterspell) → v14.2609.x
- Tools & skills (use-case vignettes) → v14.2610.x
- Spell list / item / monster lookups → never (use the PHB compendium browser instead)
