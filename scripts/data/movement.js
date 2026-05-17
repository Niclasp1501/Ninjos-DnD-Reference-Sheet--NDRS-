// D&D 5.5 (2024) — Movement

export const MOVEMENT = Object.freeze([
  {
    id: "mv-speed",
    icon: "fa-shoe-prints",
    tags: ["movement", "core"],
    source: { book: "PHB 2024", page: 22 },
    phbUuid: { de: "", en: "" },
    units: true,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Movement.Speed.Title",
      subtitleKey: "NDRS.Movement.Speed.Subtitle",
      summaryKey: "NDRS.Movement.Speed.Summary",
      exampleKey: "NDRS.Movement.Speed.Example"
    }
  },
  {
    id: "mv-difficult",
    icon: "fa-mountain",
    tags: ["movement", "exploration"],
    source: { book: "PHB 2024", page: 22 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Movement.Difficult.Title",
      subtitleKey: "NDRS.Movement.Difficult.Subtitle",
      summaryKey: "NDRS.Movement.Difficult.Summary",
      exampleKey: "NDRS.Movement.Difficult.Example"
    }
  },
  {
    id: "mv-jump",
    icon: "fa-arrow-up-from-bracket",
    tags: ["movement"],
    source: { book: "PHB 2024", page: 22 },
    phbUuid: { de: "", en: "" },
    units: true,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Movement.Jump.Title",
      subtitleKey: "NDRS.Movement.Jump.Subtitle",
      summaryKey: "NDRS.Movement.Jump.Summary",
      exampleKey: "NDRS.Movement.Jump.Example",
      notesKey: "NDRS.Movement.Jump.Notes"
    }
  },
  {
    id: "mv-climb",
    icon: "fa-arrow-up-9-1",
    tags: ["movement", "exploration"],
    source: { book: "PHB 2024", page: 22 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Movement.Climb.Title",
      subtitleKey: "NDRS.Movement.Climb.Subtitle",
      summaryKey: "NDRS.Movement.Climb.Summary",
      exampleKey: "NDRS.Movement.Climb.Example"
    }
  },
  {
    id: "mv-swim",
    icon: "fa-water",
    tags: ["movement", "exploration"],
    source: { book: "PHB 2024", page: 22 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Movement.Swim.Title",
      subtitleKey: "NDRS.Movement.Swim.Subtitle",
      summaryKey: "NDRS.Movement.Swim.Summary",
      exampleKey: "NDRS.Movement.Swim.Example"
    }
  },
  {
    id: "mv-crawl",
    icon: "fa-person-falling",
    tags: ["movement"],
    source: { book: "PHB 2024", page: 22 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Movement.Crawl.Title",
      subtitleKey: "NDRS.Movement.Crawl.Subtitle",
      summaryKey: "NDRS.Movement.Crawl.Summary",
      exampleKey: "NDRS.Movement.Crawl.Example"
    }
  },
  {
    id: "mv-fall",
    icon: "fa-arrow-down",
    tags: ["movement", "hazard"],
    source: { book: "PHB 2024", page: 22 },
    phbUuid: { de: "", en: "" },
    units: true,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Movement.Fall.Title",
      subtitleKey: "NDRS.Movement.Fall.Subtitle",
      summaryKey: "NDRS.Movement.Fall.Summary",
      exampleKey: "NDRS.Movement.Fall.Example",
      notesKey: "NDRS.Movement.Fall.Notes"
    }
  },
  {
    id: "mv-standup",
    icon: "fa-arrow-up",
    tags: ["movement", "combat"],
    source: { book: "PHB 2024", page: 22 },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Movement.StandUp.Title",
      subtitleKey: "NDRS.Movement.StandUp.Subtitle",
      summaryKey: "NDRS.Movement.StandUp.Summary",
      exampleKey: "NDRS.Movement.StandUp.Example"
    }
  }
]);
