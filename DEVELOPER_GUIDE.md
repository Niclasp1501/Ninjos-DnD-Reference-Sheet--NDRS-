# NDRS Developer & Style Guide

Welcome to **Ninjo's DnD Reference Sheet (NDRS)** development documentation. This guide establishes the mandatory UI/UX design language, architectural conventions, content standards, and code rules for this project.

**All contributors (including AI agents) must strictly adhere to these rules.**

NDRS is a Foundry VTT v13/v14 module that provides an in-session quick reference for **D&D 5.5 (2024) rules** in the FANG-Fantasy visual design. It is read-only, client-first, and ships with a strict 2024-rules discipline (see `AGENTS.md`).

---

## 🎨 1. Design Language & UI Aesthetic

NDRS uses the **FANG-Fantasy** aesthetic — light parchment with dark D&D red and metallic gold accents. There is **no** dark mode, no cyberpunk variant, no alternative skin. The visual identity is intentionally singular.

### 1.1 CSS Variables (The NDRS Palette)

All NDRS UI elements MUST use these variables, defined once in `styles/ndrs.css`. The block uses FANG's variables as the primary source with hardcoded Fantasy values as fallback, so NDRS looks identical whether or not FANG is installed:

```css
:root {
    /* Primary Backgrounds */
    --ndrs-bg-color:     var(--fang-bg-color,     #fdfbf7);  /* Parchment Light */
    --ndrs-card-bg:      var(--fang-card-bg,      #ffffff);  /* Pure white cards */
    --ndrs-nav-bg:       var(--fang-nav-bg,       #f4f1ea);  /* Sidebar parchment */

    /* Text & Borders */
    --ndrs-text-color:   var(--fang-text-color,   #1a1a1a);
    --ndrs-border-color: var(--fang-border-color, #dcd6cc);

    /* Strict Theme Accents */
    --ndrs-primary-red:  var(--fang-primary-red,  #8B0000);  /* D&D Dark Red */
    --ndrs-accent-gold:  var(--fang-accent-gold,  #D4AF37);  /* Metallic Gold */
    --ndrs-header-text:  var(--fang-header-text,  #ffffff);  /* On red surfaces only */

    /* Typography */
    --ndrs-font-main:    var(--fang-font-main,    'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);

    /* Shadows */
    --ndrs-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --ndrs-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

**Important:** NDRS never overrides these variables based on theme settings. If FANG runs in cyberpunk mode, NDRS keeps Fantasy — the `.ndrs-app-container` scope re-asserts the fallback values explicitly to defeat global FANG theme overrides.

### 1.2 UI Component Rules

- **Section headers (red bars):** `var(--ndrs-primary-red)` background, white text, 2px gold bottom border, uppercase, letter-spacing 0.5px. Matches `.section-header` from the prototype.
- **Cards:** White background, 1px solid `--ndrs-border-color`, 3px solid `--ndrs-primary-red` top border, soft shadow. Hover lifts `translateY(-2px)` and switches border to `#bbb`.
- **Modal:** White background, 2px `--ndrs-primary-red` border, gold-separated header. Body scrolls; footer shows `Quelle: PHB 2024 · S. X`.
- **Buttons:** Primary actions red with white text. Hover darkens to `#600000`. Secondary buttons stay light with red text.
- **Rail (left nav):** `--ndrs-nav-bg` background, icon buttons only. Active tab gets gold underline.
- **Dividers:** Single style: `1px solid var(--ndrs-border-color)`. Dashed only for drop zones (none in v1).
- **Floating elements (tooltips, menus):** `var(--ndrs-card-bg)` with `1px solid var(--ndrs-accent-gold)` and soft shadow.
- **Spacing:** Flexbox-based. Card grid is `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` with `gap: 12px`.
- **Icons:** Font Awesome Solid (Foundry-bundled). No emoji in shipped UI.

### 1.3 What NDRS Does NOT Do Visually

- No dark mode, no cyberpunk variant, no user theme picker.
- No animated transitions beyond the 0.1s card-hover lift and 0.2s modal fade.
- No background images on the app surface (unlike FANG's canvas).
- No bidirectional theme sync with FANG — NDRS asserts Fantasy unconditionally.

---

## 🏗️ 2. Architectural Guidelines

### 2.1 Separation of Concerns

```
ndrs/
├── module.json                  # id "ndrs", compat 13/14, system relationship dnd5e
├── scripts/
│   ├── main.js                  # Hooks (init/ready), Settings, Keybinding, Only-Sheet injection
│   ├── ndrs-app.js              # ApplicationV2 class: tabs, search, modal, renderer
│   └── data/
│       ├── index.js             # exports { ACTIONS, BONUS_ACTIONS, REACTIONS, MOVEMENT, CONDITIONS, EXHAUSTION, CALENDAR }
│       ├── actions.js
│       ├── bonus-actions.js
│       ├── reactions.js
│       ├── movement.js
│       ├── conditions.js
│       ├── exhaustion.js
│       └── calendar.js
├── styles/
│   └── ndrs.css                 # NDRS variables + components, no theme variants
├── templates/
│   ├── ndrs-app.hbs             # rail + content pane + modal
│   └── partials/
│       ├── rule-card.hbs
│       ├── modal-body.hbs
│       ├── exhaustion-table.hbs
│       └── calendar-month.hbs
├── lang/
│   ├── de.json                  # source language
│   └── en.json                  # full translation
└── tools/
    └── ndrs-validate.mjs        # locale audit + 2024-rules audit (see AGENTS.md)
```

**Strict rules:**

- **`main.js`** is reserved for Foundry initialization. Hooks (`init`, `ready`), `game.settings.register`, `game.keybindings.register`, Only-Sheet `MutationObserver`, global delegated click listeners for journal buttons. No rendering logic, no data manipulation.
- **`ndrs-app.js`** holds the `NDRSApplication` class extending `foundry.applications.api.ApplicationV2` with `HandlebarsApplicationMixin`. Tab state, search state, favorites, FT/M toggle, modal rendering all live here.
- **`scripts/data/*.js`** are pure ES modules exporting frozen arrays of rule objects. They contain **IDs and metadata only**. All user-facing text lives in `lang/*.json`.
- **`templates/*.hbs`** are pure structure. No JavaScript-in-templates beyond Handlebars helpers (`localize`, `eq`, `ndrsIcon`).
- **`lang/*.json`** holds every user-visible string keyed by `NDRS.*` namespace.

### 2.2 ApplicationV2 Conventions

NDRS targets Foundry v13/v14 only and uses ApplicationV2 from day one. No legacy `Application` class, no `FormApplication`. Pattern:

```js
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class NDRSApplication extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "ndrs-app",
        classes: ["ndrs-app-window"],
        tag: "div",
        window: { title: "NDRS.AppTitle", icon: "fa-solid fa-book-open", resizable: true },
        position: { width: 1100, height: 720 },
        actions: { /* delegated click handlers per data-action */ }
    };

    static PARTS = {
        main: { template: "modules/ndrs/templates/ndrs-app.hbs" }
    };

    async _prepareContext(options) { /* returns { tabs, activeTab, cards, … } */ }
    _onRender(context, options)    { /* attach search input, scroll restore */ }
}
```

Use the `actions` system for delegated click handling. Avoid manual `addEventListener` except where ApplicationV2 cannot help (e.g., document-level capture-phase listeners in `main.js`).

### 2.3 Data Model

Every rule entry conforms to this shape:

```js
{
    id: "attack",                          // unique kebab-case
    icon: "fa-swords",                     // Font Awesome class without "fa-solid"
    tags: ["combat", "core"],              // for filter chips
    source: { book: "PHB 2024" },          // page optional, see AGENTS.md
    phbUuid: { de: "", en: "" },           // optional deeplink, empty in v1
    units: false,                          // true if body has metric/imperial split
    new2024: true,                         // shows "Neu 2024" gold badge
    i18n: {
        titleKey:    "NDRS.Action.Attack.Title",
        subtitleKey: "NDRS.Action.Attack.Subtitle",
        summaryKey:  "NDRS.Action.Attack.Summary",
        exampleKey:  "NDRS.Action.Attack.Example",
        notesKey:    "NDRS.Action.Attack.Notes"   // optional
    }
}
```

**Card text length is a guideline, not a build gate:**

- `subtitleKey` — one sentence, ≤ 100 characters. Hard target.
- `summaryKey` — 3 to 6 sentences in plain language. Aim for clarity over completeness.
- `exampleKey` — 1 to 2 concrete examples grounded in 2024 mechanics.
- `notesKey` — optional. Edge cases, "Neu in 2024" highlights, common misreadings.

The validator (`ndrs-validate.mjs`) warns when summary exceeds 8 sentences or example exceeds 3, but does not fail the build. Complex rules (e.g., Exhaustion 2024, Counterspell) may legitimately need more space.

**Unit-aware strings:** when `units: true`, the corresponding lang value is an object `{ "metric": "...", "imperial": "..." }`. The app picks one based on the `defaultUnits` user setting and the footer toggle.

### 2.4 Persistence

NDRS is read-only with respect to rules data. Only user preferences persist:

| What | Where | Scope |
|---|---|---|
| Active tab on reopen | `game.settings` | client |
| Default units (FT/M) | `game.settings` | client |
| Last search query | not persisted | session-only |
| Favorites | `user.flags.ndrs.favorites` | per user |
| Compact mode (later) | `game.settings` | client |
| GM custom notes (Stretch) | `game.settings` keyed by rule id | world |

NDRS never writes to actors, items, journals, or scenes in v1. No socket traffic in v1.

### 2.5 Only-Sheet Integration

Mirror FANG's `MutationObserver` pattern on `#so-main-buttons`. Inject a button with id `ndrs-so-btn`, class `button` (matching Only-Sheet style), icon `fa-solid fa-book-open`, title from `NDRS.ButtonOpen`. Click handler calls `game.modules.get("ndrs").api.open()`.

Do not replace any Only-Sheet button. NDRS adds, never substitutes (unlike FANG's optional actor-replacement).

### 2.6 Journal Button Pattern

Follow the global delegated-click pattern from FANG's `AGENTS.md`. Saved journal HTML may contain:

```html
<a class="ndrs-open-btn" data-ndrs-tab="conditions" style="cursor:pointer">
    Zustände im Cheat-Sheet öffnen
</a>
```

Install one capture-phase document listener in `Hooks.once("ready")`. The handler reads `data-ndrs-tab`, calls `api.open()`, then `api.goto(tab)`. Never depend on a `renderJournalTextPageSheet` hook as the sole attachment path.

---

## 📝 3. Localization

NDRS ships with German (source) and English (full translation) in v1. Other languages follow later.

Rules:

1. Every user-facing string lives in `lang/de.json` and `lang/en.json` under the `NDRS.*` namespace.
2. Access in JS: `game.i18n.localize("NDRS.Action.Attack.Title")`.
3. Access in HBS: `{{localize "NDRS.Action.Attack.Title"}}`.
4. Hardcoded German or English strings in JS/HBS are forbidden.
5. Run `node tools/ndrs-validate.mjs` before every commit. The validator confirms:
    - Every key in `de.json` exists in `en.json` (and vice versa).
    - Every rule entry's `i18n.*Key` references resolve in both files.
    - No empty string values.
6. If a new key is added in one language only, the validator fails.

Suggested namespace structure:

```
NDRS.AppTitle
NDRS.ButtonOpen
NDRS.UI.TabActions
NDRS.UI.TabMovement
NDRS.UI.SearchPlaceholder
NDRS.UI.FavoriteAdd
NDRS.Settings.DefaultUnits.Name
NDRS.Action.Attack.Title
NDRS.Action.Attack.Subtitle
NDRS.Action.Attack.Summary
NDRS.Action.Attack.Example
NDRS.Action.Attack.Notes
NDRS.Condition.Charmed.Title
…
```

---

## 🧪 4. Content Discipline — D&D 5.5 (2024) Only

NDRS is a 2024-only reference. The 2014 rules are explicitly out of scope. See `AGENTS.md` for the full 2024-audit ruleset (forbidden terms, required terms, peer-review checklist). Hard requirements that touch this guide:

- Every rule entry must populate `source.book = "PHB 2024"` (or another verified 2024 source).
- `source.page` is optional and only set when verified. The validator rejects malformed values.
- When writing summaries, consult the 2024 PHB. If the German PHB module (`dnd-players-handbook-deutsch`) is available, use it as cross-check — but write your own concise summary; do not paste PHB prose.
- When in doubt whether a rule changed in 2024, set `new2024: true` and add a `notesKey` explaining the change.

---

## 🔢 5. Versioning

NDRS uses the same scheme as FANG:

```
<foundry-major>.<YYMM>.<patch>
```

- `<foundry-major>` is the targeted Foundry major (e.g., `14`).
- `<YYMM>` is the year-month of release (e.g., `2605` for May 2026).
- `<patch>` starts at `1` each new month, increments for each additional stable release in that month.
- Git tags use the version with a `v` prefix: `v14.2605.1`.
- Versions never decrease.

Beta releases derive from the upcoming stable:

```
14.2605.2-beta.<run>
```

The first internal milestone is `0.1.0` (skeleton, not released). The first public beta is `14.2605.1-beta.1`. First stable release: `14.2605.1`.

---

## 🧰 6. Tooling

`tools/ndrs-validate.mjs` runs in two modes:

- `node tools/ndrs-validate.mjs` — locale parity, key resolution, source.page presence, length warnings.
- `node tools/ndrs-validate.mjs --audit-2024` — additionally runs the 2024-rules audit (forbidden 2014 phrases, required 2024 phrases for affected entries). See `AGENTS.md` for the audit term lists.

The validator must pass before every commit on `main`. Beta branches may carry warnings but must pass parity checks.

---

## ✅ 7. Pre-Commit Checklist

Before opening a PR:

1. `node tools/ndrs-validate.mjs` is green.
2. `node tools/ndrs-validate.mjs --audit-2024` is green for any touched rule entries.
3. Every new rule entry has `source.book` and `source.page`.
4. Every new lang key exists in both `de.json` and `en.json`.
5. No hardcoded strings in JS or HBS.
6. New UI elements use NDRS CSS variables, not hardcoded colors.
7. Module loads in Foundry v13 and v14 with no console errors.
8. Cheat-Sheet opens via keybinding, Only-Sheet button, and Actor Directory button.
