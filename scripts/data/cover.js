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
