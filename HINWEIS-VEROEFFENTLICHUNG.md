# Hinweis für den Agenten: NDRS hat kein einziges Release

*Angelegt am 28.08.2026 beim Aufbau von Ninjo's Forge.*

Das Modul ist auf [ninjos-forge.web.app/modules/ndrs](https://ninjos-forge.web.app/modules/ndrs)
verlinkt. Die Detailseite nennt derzeit **keine Manifest-URL**, weil sie ins Leere zeigen würde.

## Der Befund

Das GitHub-Repository `Niclasp1501/Ninjos-DnD-Reference-Sheet--NDRS-` existiert und ist
öffentlich. Aber:

- **Kein einziges Release** (GitHub-API `releases/latest` → 404)
- **Kein einziger Tag** im lokalen Repository
- Damit ist
  `https://github.com/Niclasp1501/Ninjos-DnD-Reference-Sheet--NDRS-/releases/latest/download/module.json`
  — die URL, die in `module.json` als `manifest` steht — **tot**

Zum Vergleich, alle anderen eigenen Module haben ein funktionierendes Release:

| Modul | Release |
| --- | --- |
| FANG | `v14.2605.5` mit `module.json` + `module.zip` |
| Player Wheel | `v14.0.0` mit `module.json` + `module.zip` |
| DnD5e-Übersetzung | `v14.0.13` mit `module.json` + `module.zip` |
| **NDRS** | **keins** |
| Table Mode | keins — aber dort fehlt auch das Repo, siehe eigener Hinweis |

Vorhanden sind: README (84 Zeilen), CHANGELOG, LICENSE und ein `.github`-Verzeichnis. Die
Infrastruktur steht also — es wurde nur nie ein Release gezogen.

## Vorzubereiten

1. **Prüfen, ob der Workflow unter `.github/` funktioniert.** Er ist da, hat aber nie
   ausgelöst. Bei FANG läuft ein vergleichbarer Workflow erfolgreich — dort gegenprüfen, ob
   Auslöser (Tag-Muster) und Modul-ID hier richtig gesetzt sind.

2. **Version klären.** `module.json` steht auf `14.2605.1-beta.1`. Für ein erstes Release
   entscheiden: bleibt es ein Beta-Tag, oder wird auf eine saubere Fassung gezogen? Die Forge
   zeigt das Modul aktuell als **Beta** — das passt zu beidem, muss aber zusammenpassen.

3. **Release ziehen** und danach prüfen, dass die Manifest-URL wirklich antwortet.

4. **Beim Foundry-Paketkatalog einreichen.** `foundryvtt.com/packages/ndrs` ist derzeit 404.
   FANG, Player Wheel und die Übersetzung stehen bereits im Katalog, der Weg ist bekannt.

5. **Forge nachziehen** — in `F:\KI-Agenten-Workspace\Ninjos-Forge\src\data\modules.js` beim
   Eintrag `ndrs`:
   - `unreleased: true` entfernen, sobald das Release steht
   - `foundryUrl` setzen, sobald der Katalogeintrag steht
   - `version` auf die veröffentlichte Fassung setzen

   Außerdem in `src/content/ndrs.md` den Abschnitt **Installation** zurückbauen: Dort steht
   jetzt ein Kasten „Noch keine Veröffentlichung" mit Handinstallation. Der gehört ersetzt
   durch die normale Anleitung mit Manifest-URL.
