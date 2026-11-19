// D&D 5.5 (2024): Deckung
// Eigener Abschnitt im Reiter Bewegung: Deckung ist weder Aktion noch Zustand,
// sie ergibt sich aus der Stellung hinter einem Hindernis.

export const COVER = Object.freeze([
  {
    id: "cover",
    phbAliases: ["Deckung", "Cover"],
    icon: "fa-shield-halved",
    tags: ["movement", "combat"],
    source: { book: "PHB 2024" },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Movement.Cover.Title",
      subtitleKey: "NDRS.Movement.Cover.Subtitle",
      summaryKey: "NDRS.Movement.Cover.Summary",
      exampleKey: "NDRS.Movement.Cover.Example",
      notesKey: "NDRS.Movement.Cover.Notes"
    }
  }
]);

// Übersichtstabelle über der Karte, damit man die Werte am Tisch auf einen
// Blick sieht. Spalten wie die Deckungstabelle im Handbuch (Kampfkapitel).
export const COVER_TABLE = Object.freeze({
  notesKey: "NDRS.CoverTable.Notes",
  rows: [
    { bonus: "+2", nameKey: "NDRS.CoverTable.Half.Name",          benefitKey: "NDRS.CoverTable.Half.Benefit",          sourceKey: "NDRS.CoverTable.Half.Source" },
    { bonus: "+5", nameKey: "NDRS.CoverTable.ThreeQuarters.Name", benefitKey: "NDRS.CoverTable.ThreeQuarters.Benefit", sourceKey: "NDRS.CoverTable.ThreeQuarters.Source" },
    { bonus: null, nameKey: "NDRS.CoverTable.Total.Name",         benefitKey: "NDRS.CoverTable.Total.Benefit",         sourceKey: "NDRS.CoverTable.Total.Source" }
  ]
});
