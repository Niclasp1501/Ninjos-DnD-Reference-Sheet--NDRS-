// D&D 5.5 (2024) — Actions
// Each entry holds metadata only. All user-facing text lives in lang/*.json.

export const ACTIONS = Object.freeze([
  {
    id: "attack",
    phbAliases: ["Angriff", "Attack", "Waffenloser Schlag", "Unarmed Strike"],
    icon: "fa-hand-fist",
    tags: ["combat", "core"],
    source: { book: "PHB 2024", page: 25 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Action.Attack.Title",
      subtitleKey: "NDRS.Action.Attack.Subtitle",
      summaryKey: "NDRS.Action.Attack.Summary",
      exampleKey: "NDRS.Action.Attack.Example",
      notesKey: "NDRS.Action.Attack.Notes"
    }
  },
  {
    id: "magic",
    phbAliases: ["Magie", "Magic"],
    icon: "fa-wand-sparkles",
    tags: ["combat", "magic", "core"],
    source: { book: "PHB 2024", page: 25 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Action.Magic.Title",
      subtitleKey: "NDRS.Action.Magic.Subtitle",
      summaryKey: "NDRS.Action.Magic.Summary",
      exampleKey: "NDRS.Action.Magic.Example"
    }
  },
  {
    id: "dash",
    phbAliases: ["Spurt", "Dash"],
    icon: "fa-person-running",
    tags: ["movement", "core"],
    source: { book: "PHB 2024", page: 25 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Action.Dash.Title",
      subtitleKey: "NDRS.Action.Dash.Subtitle",
      summaryKey: "NDRS.Action.Dash.Summary",
      exampleKey: "NDRS.Action.Dash.Example"
    }
  },
  {
    id: "disengage",
    phbAliases: ["Rückzug", "Disengage"],
    icon: "fa-arrows-turn-to-dots",
    tags: ["movement", "combat", "core"],
    source: { book: "PHB 2024", page: 25 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Action.Disengage.Title",
      subtitleKey: "NDRS.Action.Disengage.Subtitle",
      summaryKey: "NDRS.Action.Disengage.Summary",
      exampleKey: "NDRS.Action.Disengage.Example"
    }
  },
  {
    id: "dodge",
    phbAliases: ["Ausweichen", "Dodge"],
    icon: "fa-shield-halved",
    tags: ["defense", "core"],
    source: { book: "PHB 2024", page: 25 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Action.Dodge.Title",
      subtitleKey: "NDRS.Action.Dodge.Subtitle",
      summaryKey: "NDRS.Action.Dodge.Summary",
      exampleKey: "NDRS.Action.Dodge.Example"
    }
  },
  {
    id: "help",
    phbAliases: ["Helfen", "Help"],
    icon: "fa-handshake",
    tags: ["support", "core"],
    source: { book: "PHB 2024", page: 25 },
    phbUuid: { de: "", en: "" },
    units: true,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Action.Help.Title",
      subtitleKey: "NDRS.Action.Help.Subtitle",
      summaryKey: "NDRS.Action.Help.Summary",
      exampleKey: "NDRS.Action.Help.Example",
      notesKey: "NDRS.Action.Help.Notes"
    }
  },
  {
    id: "hide",
    phbAliases: ["Verstecken", "Hide", "Heimlichkeit", "Stealth"],
    icon: "fa-user-secret",
    tags: ["stealth", "exploration", "core"],
    source: { book: "PHB 2024", page: 25 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Action.Hide.Title",
      subtitleKey: "NDRS.Action.Hide.Subtitle",
      summaryKey: "NDRS.Action.Hide.Summary",
      exampleKey: "NDRS.Action.Hide.Example",
      notesKey: "NDRS.Action.Hide.Notes"
    }
  },
  {
    id: "influence",
    phbAliases: ["Beeinflussen", "Influence", "Soziale Interaktion"],
    icon: "fa-comments",
    tags: ["social", "core"],
    source: { book: "PHB 2024", page: 25 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Action.Influence.Title",
      subtitleKey: "NDRS.Action.Influence.Subtitle",
      summaryKey: "NDRS.Action.Influence.Summary",
      exampleKey: "NDRS.Action.Influence.Example",
      notesKey: "NDRS.Action.Influence.Notes"
    }
  },
  {
    id: "ready",
    phbAliases: ["Bereithalten", "Ready", "Vorbereiten"],
    icon: "fa-stopwatch",
    tags: ["combat", "tactics", "core"],
    source: { book: "PHB 2024", page: 26 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Action.Ready.Title",
      subtitleKey: "NDRS.Action.Ready.Subtitle",
      summaryKey: "NDRS.Action.Ready.Summary",
      exampleKey: "NDRS.Action.Ready.Example"
    }
  },
  {
    id: "search",
    phbAliases: ["Suchen", "Search"],
    icon: "fa-magnifying-glass",
    tags: ["exploration", "core"],
    source: { book: "PHB 2024", page: 26 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Action.Search.Title",
      subtitleKey: "NDRS.Action.Search.Subtitle",
      summaryKey: "NDRS.Action.Search.Summary",
      exampleKey: "NDRS.Action.Search.Example"
    }
  },
  {
    id: "study",
    phbAliases: ["Studieren", "Study"],
    icon: "fa-book-open-reader",
    tags: ["knowledge", "core"],
    source: { book: "PHB 2024", page: 26 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Action.Study.Title",
      subtitleKey: "NDRS.Action.Study.Subtitle",
      summaryKey: "NDRS.Action.Study.Summary",
      exampleKey: "NDRS.Action.Study.Example",
      notesKey: "NDRS.Action.Study.Notes"
    }
  },
  {
    id: "utilize",
    phbAliases: ["Benutzen", "Utilize", "Verwenden"],
    icon: "fa-screwdriver-wrench",
    tags: ["utility", "core"],
    source: { book: "PHB 2024", page: 26 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Action.Utilize.Title",
      subtitleKey: "NDRS.Action.Utilize.Subtitle",
      summaryKey: "NDRS.Action.Utilize.Summary",
      exampleKey: "NDRS.Action.Utilize.Example"
    }
  }
]);
