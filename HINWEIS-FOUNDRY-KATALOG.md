# Hinweis für den Agenten: Release steht, Katalogeintrag fehlt noch

*Angelegt am 28.08.2026. Ersetzt den früheren Hinweis „kein Release" — der ist erledigt.*

## Was inzwischen erledigt ist

- **v14.2605.1 ist veröffentlicht** (28.08.2026, 19:51 UTC), mit `module.json` und
  `module.zip` als Anhänge, kein Entwurf, keine Vorabversion.
- Die Manifest-URL aus der `module.json` antwortet mit **HTTP 200**.
- Auf [ninjos-forge.web.app/modules/ndrs](https://ninjos-forge.web.app/modules/ndrs) steht das
  Modul jetzt als **Stabil** mit Manifest-URL zum Kopieren.

## Punkt 1: NDRS steht nicht im Foundry-Paketkatalog

`foundryvtt.com/packages/ndrs` leitet auf die Paketübersicht um — das ist Foundrys Art,
„gibt es nicht" zu sagen. Zum Vergleich: FANG, Player Wheel und die DnD5e-Übersetzung
sind alle drin.

Der Workflow ist dafür bereits verdrahtet und richtig aufgebaut:

```yaml
- name: Publish Module to FoundryVTT Website
  if: ${{ env.PACKAGE_TOKEN != '' }}
  uses: cs96and/FoundryVTT-release-package@v1
```

Der Schritt überspringt sich still, wenn das Geheimnis `PACKAGE_TOKEN` im Repository nicht
gesetzt ist. Zu prüfen ist also zweierlei:

1. **Ist `PACKAGE_TOKEN` in den Repository-Geheimnissen hinterlegt?** Bei den drei Modulen,
   die im Katalog stehen, muss es das sein — dort denselben Weg gehen.
2. **Ist das Paket auf foundryvtt.com überhaupt angelegt?** Die Schnittstelle reicht nur
   *neue Versionen zu einem bestehenden Paket* ein. Der allererste Eintrag muss von Hand
   über das Entwicklerkonto angelegt werden. Solange der fehlt, läuft der Workflow-Schritt
   auch mit gültigem Token ins Leere.

Danach in `F:\KI-Agenten-Workspace\Ninjos-Forge\src\data\modules.js` beim Eintrag `ndrs`
`foundryUrl` auf `https://foundryvtt.com/packages/ndrs` setzen — dann erscheint der
Katalog-Knopf. Außerdem in `src/content/ndrs.md` den Schlusssatz des Abschnitts
*Installation* streichen, der sagt, dass das Modul noch nicht im Katalog steht.

## Punkt 2: Die README bewirbt einen Beta-Kanal, den es nicht gibt

Beide Sprachfassungen der README nennen unter *Installation* eine zweite Manifest-URL:

```
https://github.com/Niclasp1501/Ninjos-DnD-Reference-Sheet--NDRS-/releases/download/beta-latest/module-beta.json
```

Diese URL liefert **404**. Es gibt zwar `.github/workflows/release-beta.yml`, aber keine
Veröffentlichung unter dem Tag `beta-latest`.

Zwei saubere Auflösungen — eine davon wählen:

- Den Beta-Kanal tatsächlich einmal auslösen, damit die URL trägt. Vorbild ist FANG, dort
  läuft derselbe Zweikanal-Aufbau.
- Oder die Beta-Zeilen aus beiden Sprachfassungen der README entfernen, bis der Kanal
  wirklich bespielt wird.

Auf der Forge ist der Beta-Kanal bewusst **nicht** erwähnt — dort steht nur die stabile
Manifest-URL. Es besteht also kein Zeitdruck von der Website her.
