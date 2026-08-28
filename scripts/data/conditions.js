// D&D 5.5 (2024) - Conditions (14 entries; Exhaustion uses its own data module)
// German terminology follows the official dnd5e German translation
// (Rules Glossary / Regelglossar 2024).

const PHB_ALIASES = {
  "Blinded": [
    "Blind",
    "Blinded"
  ],
  "Charmed": [
    "Bezaubert",
    "Charmed"
  ],
  "Deafened": [
    "Taub",
    "Deafened"
  ],
  "Frightened": [
    "Verängstigt",
    "Frightened"
  ],
  "Grappled": [
    "Gepackt",
    "Grappled",
    "Ringkampf",
    "Grappling"
  ],
  "Incapacitated": [
    "Kampfunfähig",
    "Incapacitated"
  ],
  "Invisible": [
    "Unsichtbar",
    "Invisible"
  ],
  "Paralyzed": [
    "Gelähmt",
    "Paralyzed"
  ],
  "Petrified": [
    "Versteinert",
    "Petrified"
  ],
  "Poisoned": [
    "Vergiftet",
    "Poisoned"
  ],
  "Prone": [
    "Liegend",
    "Prone"
  ],
  "Restrained": [
    "Festgesetzt",
    "Restrained"
  ],
  "Stunned": [
    "Betäubt",
    "Stunned"
  ],
  "Unconscious": [
    "Bewusstlos",
    "Unconscious"
  ]
};

const cond = (id, icon, { new2024 = false, units = false, tags = ["condition"] } = {}) => ({
  id: `cond-${id}`,
  icon,
  tags,
  source: { book: "PHB 2024" },
  phbUuid: { de: "", en: "" },
  units,
  new2024,
  phbAliases: PHB_ALIASES[id] ?? [],
  i18n: {
    titleKey: `NDRS.Condition.${id}.Title`,
    subtitleKey: `NDRS.Condition.${id}.Subtitle`,
    summaryKey: `NDRS.Condition.${id}.Summary`,
    exampleKey: `NDRS.Condition.${id}.Example`,
    notesKey: `NDRS.Condition.${id}.Notes`
  }
});

export const CONDITIONS = Object.freeze([
  cond("Blinded",       "fa-eye-slash"),
  cond("Charmed",       "fa-heart"),
  cond("Deafened",      "fa-ear-deaf"),
  cond("Frightened",    "fa-ghost"),
  cond("Grappled",      "fa-hand-fist",          { new2024: true }),
  cond("Incapacitated", "fa-user-slash",         { new2024: true }),
  cond("Invisible",     "fa-user-ninja",         { new2024: true }),
  cond("Paralyzed",     "fa-bolt-lightning"),
  cond("Petrified",     "fa-cube"),
  cond("Poisoned",      "fa-flask"),
  cond("Prone",         "fa-person-falling-burst", { units: true }),
  cond("Restrained",    "fa-link"),
  cond("Stunned",       "fa-dizzy"),
  cond("Unconscious",   "fa-bed-pulse",          { new2024: true, units: true })
]);
