# NDRS UI Upgrade Plan — „Königsklasse"

Vergleichsanalyse zwischen NDRS (Stand v14.2605.1-beta.1), **FANG** und **Ninjos Vote & Watch (V&W)**.
Ziel: NDRS optisch auf das Niveau der anderen beiden heben, ohne den FANG-Fantasy-Charakter zu brechen.

---

## 1. Was NDRS heute hat (Basis-Niveau, funktional)

| Bereich | Stand |
|---|---|
| Hintergrund | Flacher Parchment (`#fdfbf7`) |
| Karten | Weißer Hintergrund, 1px Border, 3px roter Top-Border |
| Hover | `translateY(-2px)` + soft shadow |
| Modal | Solide Farben, einfache rote 2px-Border |
| Tabs | Plain Underline beim Active-Tab |
| Typography | `Segoe UI` (System-Default), eine Familie für alles |
| Icons | Font Awesome Solid |
| Animationen | Nur Card-Hover-Transition |
| Effekte | Keine Glows, keine Gradients, keine Glas-Effekte, keine Textur |
| „Neu 2024"-Badge | Statisches Gold-Rechteck |

**Verdikt:** sauber, sachlich, aber nicht „premium". Eher Wikipedia-Style als Königsklasse.

---

## 2. Was FANG und V&W differenziert

### Aus FANG übernehmbar
- **`glass-panel` Sidebar-Klasse**: gradient + backdrop-blur + multi-layer box-shadow
- **Gradient-Buttons**: `linear-gradient(180deg, …)` statt flach
- **Inset-Shadows** für Tiefe (`inset 0 0 0 1px rgba(...)`)
- **Mehrlagige Shadows**: Drop + Glow + Inner Ring kombiniert
- **Rail-Navigation** (vertikale Icon-Leiste)
- **Live-anpassbare Hintergründe** (Palette/Bild/Preset)

### Aus V&W übernehmbar
- **Material-Design-3-Token-System**: `surface-container-low/medium/high/highest` für saubere Tiefenstaffelung statt random Grays
- **`glass-card`**: `linear-gradient(145deg, rgba(255,255,255,0.8), rgba(244,234,220,0.8))` + `backdrop-filter: blur(12px)`
- **Keyframe-Animationen**:
  - `skeleton-shimmer` für Ladezustände
  - `pulse-glow` für wichtige Elemente (gold)
  - `activity-ring` für aktive Indikatoren (grün)
- **Display-Font** für Headlines (`Space Grotesk` oder ähnliches), **Mono-Font** für Meta-Info (`JetBrains Mono`)
- **Material Symbols Icons** mit `font-variation-settings` (FILL, weight, optical size)
- **Card-glow Utility** mit verstärkter Hover-Variante
- **Linear-Gradient Progress-Bars** (`var(--primary) → var(--secondary)`)
- **Poster-Gradient-Fallbacks** für leere/Platzhalter-Karten

---

## 3. Konkreter Upgrade-Plan für NDRS (priorisiert)

### Stufe A — Foundation (1–2h, hoher Hebel)

1. **Token-Reorganisation** nach M3-Pattern:
   ```css
   --ndrs-surface-lowest:  #ffffff;
   --ndrs-surface-low:     #fdfbf7;
   --ndrs-surface:         #f8f1e5;
   --ndrs-surface-high:    #f4eadc;
   --ndrs-surface-highest: #ebdacc;
   --ndrs-outline:         #8c7f71;
   --ndrs-outline-variant: #d6caba;
   --ndrs-primary:         #8B0000;
   --ndrs-primary-container: #b51a1d;
   --ndrs-secondary:       #D4AF37;
   --ndrs-secondary-container: #f1d570;
   ```
   Saubere Tiefenstaffelung, kompatibel mit FANG-Variablen-Fallback.

2. **Typography-Stack**:
   - Display (Headlines, Modal-Titel, Section-Header): `"Cinzel", "Cormorant Garamond", serif` — D&D-würdig
   - Body: `"Inter", "Segoe UI", sans-serif`
   - Mono (Quellenangaben, Versionsnummern): `"JetBrains Mono", monospace`
   - Via `@import` von Google Fonts (mit `display=swap`)

3. **Subtile Parchment-Textur** als Body-Background: SVG-Noise-Pattern mit ~3% Opacity, lebendiger als flacher Farbton.

### Stufe B — Karten & Modal (2–3h, sichtbarster Effekt)

4. **Glass-Cards** statt flacher weißer Boxen:
   ```css
   .ndrs-card {
     background: linear-gradient(145deg, rgba(255,255,255,0.92), rgba(244,234,220,0.85));
     border: 1px solid var(--ndrs-outline-variant);
     border-top: 3px solid var(--ndrs-primary);
     box-shadow:
       0 4px 16px rgba(139, 0, 0, 0.05),
       0 1px 3px rgba(0, 0, 0, 0.08),
       inset 0 1px 0 rgba(255, 255, 255, 0.6);
     backdrop-filter: blur(8px);
     transition: transform 0.2s ease, box-shadow 0.2s ease;
   }
   .ndrs-card:hover {
     transform: translateY(-3px) scale(1.01);
     box-shadow:
       0 8px 28px rgba(139, 0, 0, 0.12),
       0 2px 6px rgba(0, 0, 0, 0.1),
       0 0 0 1px rgba(212, 175, 55, 0.3);
   }
   ```

5. **Eck-Ornament auf Karten**: kleines goldenes SVG-Filigran in der Ecke (~16×16px), nicht aufdringlich, aber unverkennbar D&D.

6. **Modal-Upgrade**:
   - `backdrop-filter: blur(8px) saturate(120%)` auf Overlay
   - Modal mit subtler Gradient-Border (rot → gold → rot)
   - Header mit Display-Font, Untertitel kursiv kleiner
   - Body-Sections mit eigenen Icon-Badges (Schwert für „Was es tut", Notiz für „Beispiel", Warnsymbol für „Notes")
   - Footer mit gradient strip + Mono-Font für Quellenangabe

### Stufe C — Animationen & Polish (2h, „wow"-Faktor)

7. **„Neu 2024"-Badge pulsiert** (V&W `pulse-glow`-Adaption):
   ```css
   @keyframes ndrs-glow-2024 {
     0%, 100% { box-shadow: 0 0 4px rgba(212, 175, 55, 0.4); }
     50%      { box-shadow: 0 0 14px rgba(212, 175, 55, 0.8), 0 0 28px rgba(212, 175, 55, 0.2); }
   }
   .ndrs-badge-2024 { animation: ndrs-glow-2024 2.5s ease-in-out infinite; }
   ```

8. **Stagger-Fade-In** beim Tab-Switch: Karten erscheinen nacheinander (50ms Delay-Versatz), kein blockartiges Aufploppen.

9. **Tab-Active-Indicator**: statt Underline → Pill mit subtilem Gradient + Glow:
   ```css
   .ndrs-tab-btn.active {
     background: linear-gradient(180deg, rgba(139,0,0,0.08), rgba(139,0,0,0.02));
     border-radius: 6px 6px 0 0;
     box-shadow: 0 -2px 0 inset var(--ndrs-secondary), 0 2px 8px rgba(139,0,0,0.1);
   }
   ```

10. **Suche**: Pill-Form mit `border-radius: 999px`, Focus-State mit goldenem 2px-Border + Glow, Such-Icon links als Material-Symbol.

### Stufe D — Spezialansichten (3h, hebt einzelne Tabs heraus)

11. **Exhaustion-Tabelle** → **Stepped Cards** mit Severity-Color-Ramp:
    Stufe 1 = sanftes Bernstein, Stufe 6 = tiefes Rot mit Skull-Icon und Pulse-Effekt. Visuelle Eskalation statt grauer Tabellenreihen.

12. **Kalender**:
    - Monatskarten mit dezenter Pergament-Textur und Wappenstil-Header
    - Feiertags-Blöcke mit goldener Banner-Optik (kleine SVG-Ribbons)
    - Tageszellen mit Hover-Tooltip (für spätere Erweiterung: Wochentag, Mondphase)

13. **Conditions** mit großem Symbol oben in jeder Karte (Material Symbol „visibility_off" für Blinded etc.), nicht nur kleines FA-Icon im Header.

### Stufe E — Mobile/Web-App-Vorbereitung (separater Branch)

14. CSS so strukturieren, dass `prefers-color-scheme: dark` + Viewport-Queries leicht eingebaut werden können — V&W hat das Dark-Mode-Pattern vorgemacht.
15. Komponenten so isolieren, dass eine Standalone-Web-App-Variante (separate `index.html`, kein Foundry-Runtime) das gleiche CSS wiederverwenden kann.
16. `tap-highlight-transparent`, `pb-safe`-Klassen für iOS-Polish vorbereiten.

---

## 4. Was ich **nicht** vorschlage

- **Kein Cyberpunk-Theme** — du wolltest explizit nur Fantasy.
- **Kein Tailwind** — Foundry-Modul soll standalone CSS bleiben (sonst Build-Pipeline-Overhead).
- **Kein Dark-Mode in v1** — V&W hat ihn, FANG cyberpunk-only, NDRS bleibt im Fantasy-Hell-Look (Dark wird Stretch).
- **Keine externen JS-Libs** für Animationen (Anime.js, GSAP, etc.) — alles über CSS-Keyframes, hält das Modul leicht (<200 KB).
- **Keine Echtzeit-Features** (Sockets, Multi-User-State) — NDRS bleibt read-only.

---

## 5. Geschätzter Zeitaufwand & Reihenfolge

| Phase | Inhalt | Zeit | Sichtbarer Effekt |
|---|---|---|---|
| A | Token-System + Typography + Textur | 1–2 h | Foundation, kaum sichtbar einzeln |
| B | Glass-Cards + Modal-Upgrade | 2–3 h | **Größter optischer Sprung** |
| C | Animationen (Badge, Stagger, Tabs, Suche) | 2 h | „Lebt"-Eindruck |
| D | Spezialansichten (Exhaustion, Kalender, Conditions) | 3 h | Tab-Charakter |
| E | Mobile-Foundation | 2 h | Nicht direkt sichtbar |
| **Summe** | | **~10–12 h** | |

**Pragmatischer Vorschlag:** Stufe A + B als „Phase 1" zusammen (3–5 h, ein Deploy). Stufe C als „Phase 2". Stufe D pro Tab einzeln. Stufe E erst wenn Web-App-Branch ansteht.

---

## 6. Versions-Planung

| Version | Inhalt |
|---|---|
| v14.2605.2-beta.1 | Phase 1 (Stufe A+B): neues Token-System, Glass-Cards, Modal-Upgrade |
| v14.2605.2-beta.2 | Phase 2 (Stufe C): Animationen & Polish |
| v14.2605.2 (stable) | Phase 3 (Stufe D): alle Tabs durchgestylt |
| v14.2606.x | Phase 4 (Stufe E): Web-App-Vorbereitung + PHB-Deeplinks aus altem Plan |

---

## 7. Was ich von dir brauche, bevor ich loslege

1. **„Go" für Phase 1** (Stufe A+B) — oder gezielte Auswahl einzelner Punkte.
2. **Schrift-Präferenz**: `Cinzel` (klassisch fantasy), `Cormorant Garamond` (eleganter), oder was eigenes? Beide sind Google-Fonts.
3. **Hover-Animation-Intensität**: dezent (heute `-2px`) oder kräftig (`-3px + scale 1.01 + glow`)?
4. **Eck-Ornament**: ja (SVG-Filigran) oder nein (clean ohne)?
5. **Pulse-Effekt auf „Neu 2024"-Badge**: ja (lebt) oder nein (lenkt ab)?

Sag Bescheid wenn du wiederkommst — dann arbeiten wir Stufe für Stufe durch, mit Live-Deploy zum Vergleich.
