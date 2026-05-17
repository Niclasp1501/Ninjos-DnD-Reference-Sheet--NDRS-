// D&D 5.5 (2024) — Reactions

export const REACTIONS = Object.freeze([
  {
    id: "rx-overview",
    icon: "fa-reply",
    tags: ["combat", "core"],
    source: { book: "PHB 2024", page: 24 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Reaction.Overview.Title",
      subtitleKey: "NDRS.Reaction.Overview.Subtitle",
      summaryKey: "NDRS.Reaction.Overview.Summary",
      exampleKey: "NDRS.Reaction.Overview.Example"
    }
  },
  {
    id: "rx-opportunity",
    icon: "fa-bullseye",
    tags: ["combat", "core"],
    source: { book: "PHB 2024", page: 27 },
    phbUuid: { de: "", en: "" },
    units: true,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Reaction.Opportunity.Title",
      subtitleKey: "NDRS.Reaction.Opportunity.Subtitle",
      summaryKey: "NDRS.Reaction.Opportunity.Summary",
      exampleKey: "NDRS.Reaction.Opportunity.Example",
      notesKey: "NDRS.Reaction.Opportunity.Notes"
    }
  },
  {
    id: "rx-ready",
    icon: "fa-clock",
    tags: ["combat", "tactics"],
    source: { book: "PHB 2024", page: 26 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Reaction.Ready.Title",
      subtitleKey: "NDRS.Reaction.Ready.Subtitle",
      summaryKey: "NDRS.Reaction.Ready.Summary",
      exampleKey: "NDRS.Reaction.Ready.Example"
    }
  },
  {
    id: "rx-spell",
    icon: "fa-shield-virus",
    tags: ["magic"],
    source: { book: "PHB 2024", page: 24 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Reaction.Spell.Title",
      subtitleKey: "NDRS.Reaction.Spell.Subtitle",
      summaryKey: "NDRS.Reaction.Spell.Summary",
      exampleKey: "NDRS.Reaction.Spell.Example"
    }
  }
]);
