// D&D 5.5 (2024) — Bonus Actions (generic, mechanic-agnostic)

export const BONUS_ACTIONS = Object.freeze([
  {
    id: "ba-overview",
    phbAliases: ["Bonusaktion", "Bonusaktionen", "Bonus Action", "Bonus Actions"],
    icon: "fa-bolt",
    tags: ["combat", "core"],
    source: { book: "PHB 2024" },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Bonus.Overview.Title",
      subtitleKey: "NDRS.Bonus.Overview.Subtitle",
      summaryKey: "NDRS.Bonus.Overview.Summary",
      exampleKey: "NDRS.Bonus.Overview.Example"
    }
  },
  {
    id: "ba-offhand",
    phbAliases: ["Waffeneigenschaften", "Leicht", "Light", "Weapon Properties"],
    icon: "fa-khanda",
    tags: ["combat", "two-weapon"],
    source: { book: "PHB 2024" },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Bonus.OffHand.Title",
      subtitleKey: "NDRS.Bonus.OffHand.Subtitle",
      summaryKey: "NDRS.Bonus.OffHand.Summary",
      exampleKey: "NDRS.Bonus.OffHand.Example",
      notesKey: "NDRS.Bonus.OffHand.Notes"
    }
  },
  {
    id: "ba-spell",
    phbAliases: ["Wirkzeit", "Casting Time", "Zauberwirken", "Spellcasting"],
    icon: "fa-hat-wizard",
    tags: ["magic"],
    source: { book: "PHB 2024" },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: true,
    i18n: {
      titleKey: "NDRS.Bonus.Spell.Title",
      subtitleKey: "NDRS.Bonus.Spell.Subtitle",
      summaryKey: "NDRS.Bonus.Spell.Summary",
      exampleKey: "NDRS.Bonus.Spell.Example",
      notesKey: "NDRS.Bonus.Spell.Notes"
    }
  },
  {
    id: "ba-class",
    phbAliases: ["Klassen", "Classes", "Klassenmerkmale"],
    icon: "fa-gears",
    tags: ["class"],
    source: { book: "PHB 2024" },
    phbUuid: { de: "", en: "" },
    units: false,
    new2024: false,
    i18n: {
      titleKey: "NDRS.Bonus.Class.Title",
      subtitleKey: "NDRS.Bonus.Class.Subtitle",
      summaryKey: "NDRS.Bonus.Class.Summary",
      exampleKey: "NDRS.Bonus.Class.Example"
    }
  }
]);
