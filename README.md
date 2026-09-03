# Ninjo's DnD Reference Sheet (NDRS)

**Current Version / Aktuelle Version:** `14.2608.2`

A lightweight, in-session quick reference for **D&D 5.5 (2024)** rules — actions, movement, conditions, exhaustion, and a homebrew calendar — natively integrated into Foundry VTT v13 and v14, in the FANG-Fantasy visual design.

NDRS is read-only. It does not roll dice, edit actors, or replace character sheets. It is the cheat sheet you reach for at the table when somebody asks "how does Influence actually work in 2024?"

*(Scroll down for German version / Scrolle weiter runter für die deutsche Version)*

---

## 🇬🇧 English

### Features

- **Strict 2024 rules**: Every entry is verified against the 2024 PHB. The included validator scans for stray 2014-era phrasings.
- **Four core tabs**: Round Actions (Action / Bonus / Reaction), Movement, Conditions (incl. Exhaustion 2024 table), Homebrew Calendar.
- **Concise card + drill-down modal**: Each card shows a one-sentence summary; click for what it does, an example, and any "Neu 2024" notes.
- **Full-text search** across every tab, matching titles, summaries, examples and notes.
- **Favorites** per user: pinned cards move to the top of their section and are gold-bordered.
- **FT/M unit toggle** in the footer — instant switch on units-aware entries.
- **FANG-Fantasy theme** (red / gold / parchment), automatically inheriting FANG's CSS variables when FANG is active.
- **Only-Sheet integration**: NDRS injects a button into the Only-Sheet button bar.
- **Actor Directory header button** for one-click access without Only-Sheet.
- **Journal-button deeplinks**: any journal `<a class="ndrs-open-btn" data-ndrs-tab="conditions">` opens NDRS on the named tab.
- **Keybinding**: `Shift + R` toggles the window.
- **DE + EN** fully translated; further languages roll out from v14.2605.2 onwards.

### Installation

1. Open Foundry VTT and go to **Add-on Modules**.
2. Click **Install Module**.
3. Paste the manifest URL: `https://github.com/Niclasp1501/Ninjos-DnD-Reference-Sheet--NDRS-/releases/latest/download/module.json`
4. Restart Foundry and enable **Ninjo's DnD Reference Sheet (NDRS)** in your world.

NDRS is also listed in the in-app package browser, so you can search for it there instead.

### Usage

- Press `Shift + R` to open or close the window.
- Click any card to open its detail modal.
- Use the search field to filter entries across every tab; press Esc to clear.
- Click the star icon on a card to mark it as a favorite.
- Toggle FT ↔ M from the footer; affected entries update instantly.

### Companion modules

- **FANG (Foundry Actor Nexus Graph)** — same visual design, same author, complementary feature set (relationship graph). NDRS automatically inherits FANG's theme variables when FANG is active.
- **Spielerhandbuch Deutsch** — official German PHB compendium. From v14.2606.x, NDRS will offer "Open in PHB" deeplinks when this module is installed.

---

## 🇩🇪 Deutsch

### Funktionen

- **Strikt 2024er-Regeln**: Jeder Eintrag ist gegen das PHB 2024 geprüft. Der mitgelieferte Validator findet versehentliche 2014er-Formulierungen.
- **Vier Kerntabs**: Rundenaktionen (Aktion / Bonusaktion / Reaktion), Bewegung, Zustände (inkl. Erschöpfungs-Tabelle 2024), Homebrew-Kalender.
- **Karte + Detail-Modal**: Jede Karte zeigt einen knappen Untertitel; ein Klick öffnet eine ausführlichere Beschreibung, ein Beispiel und ggf. „Neu 2024"-Hinweise.
- **Volltextsuche** über alle Bereiche hinweg, inklusive Zusammenfassung, Beispiel und Hinweisen.
- **Favoriten** pro Benutzer: angeheftete Karten rutschen in ihrem Abschnitt nach oben und sind goldumrandet.
- **FT/M-Schalter** im Footer — wechselt sofort die maßeinheits-abhängigen Texte.
- **FANG-Fantasy-Theme** (rot / gold / pergament). Wenn FANG installiert ist, übernimmt NDRS dessen CSS-Variablen automatisch.
- **Only-Sheet-Integration**: NDRS fügt einen Button in die Only-Sheet-Buttonleiste ein.
- **Akteur-Verzeichnis-Header-Button** für direkten Zugriff ohne Only-Sheet.
- **Journal-Button-Deeplinks**: jedes Journal-Element der Form `<a class="ndrs-open-btn" data-ndrs-tab="conditions">` öffnet NDRS auf dem genannten Tab.
- **Tastenkürzel**: `Shift + R` öffnet/schließt das Fenster.
- **DE + EN** vollständig übersetzt; weitere Sprachen folgen ab v14.2605.2.

### Installation

1. Foundry VTT öffnen und in den Reiter **Zusatzmodule** wechseln.
2. **Modul installieren** anklicken.
3. Manifest-URL einfügen: `https://github.com/Niclasp1501/Ninjos-DnD-Reference-Sheet--NDRS-/releases/latest/download/module.json`
4. Foundry neu starten und **Ninjo's DnD Reference Sheet (NDRS)** in deiner Welt aktivieren.

NDRS steht auch im Paket-Browser von Foundry — dort kannst du es stattdessen einfach suchen.

### Anleitung

- `Shift + R` öffnet oder schließt das Fenster.
- Klick auf eine Karte öffnet das Detail-Modal.
- Das Suchfeld durchsucht alle Bereiche; Esc leert die Suche.
- Klick auf das Stern-Symbol einer Karte setzt sie auf die Favoritenliste.
- FT/M lässt sich im Footer umschalten; betroffene Karten aktualisieren sich sofort.

### Schwester-Module

- **FANG (Foundry Actor Nexus Graph)** — gleiches Design, gleicher Autor, ergänzende Funktion (Beziehungs-Graph). NDRS übernimmt das FANG-Theme automatisch, wenn FANG aktiv ist.
- **Spielerhandbuch Deutsch** — das offizielle deutsche PHB-Kompendium. Ab v14.2606.x bietet NDRS „Im PHB öffnen"-Deeplinks an, wenn dieses Modul installiert ist.

---

## License / Lizenz

This base module is licensed under the **MIT License**.
**Note:** The license applies to the NDRS module itself. The summarized rule descriptions inside the module reference D&D 5.5 (2024) game mechanics, which are facts; their phrasing is original to this project.

Dieses Modul steht unter der **MIT-Lizenz**.
**Hinweis:** Die Lizenz gilt für das NDRS-Modul selbst. Die zusammengefassten Regelbeschreibungen beschreiben Spielmechaniken aus D&D 5.5 (2024); die Formulierungen sind eigene Zusammenfassungen für dieses Projekt.

---

## Credits

Module: **Ninjo & Roxy**.
Visual design language inherited from **FANG (Foundry Actor Nexus Graph)**.
Audit & validation tools: see `tools/ndrs-validate.mjs`.

For development conventions, see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md).
For workflow rules and the strict 2024 audit, see [AGENTS.md](AGENTS.md).
For the v1 content list, see [CONTENT-INVENTORY.md](CONTENT-INVENTORY.md).
For the roadmap, see [TODO.md](TODO.md).
