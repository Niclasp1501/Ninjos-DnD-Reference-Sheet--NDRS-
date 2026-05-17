// D&D 5.5 (2024) — Conditions (15 entries; Exhaustion uses its own data module)

const cond = (id, icon, new2024 = false, tags = ["condition"]) => ({
  id: `cond-${id}`,
  icon,
  tags,
  source: { book: "PHB 2024", page: 36 },
  phbUuid: { de: "", en: "" },
  units: false,
  new2024,
  i18n: {
    titleKey: `NDRS.Condition.${id}.Title`,
    subtitleKey: `NDRS.Condition.${id}.Subtitle`,
    summaryKey: `NDRS.Condition.${id}.Summary`,
    exampleKey: `NDRS.Condition.${id}.Example`,
    notesKey: `NDRS.Condition.${id}.Notes`
  }
});

export const CONDITIONS = Object.freeze([
  cond("Blinded",      "fa-eye-slash"),
  cond("Charmed",      "fa-heart"),
  cond("Deafened",     "fa-ear-deaf"),
  cond("Frightened",   "fa-ghost"),
  cond("Grappled",     "fa-hand-fist", true),
  cond("Incapacitated","fa-user-slash", true),
  cond("Invisible",    "fa-user-ninja", true),
  cond("Paralyzed",    "fa-bolt-lightning"),
  cond("Petrified",    "fa-cube"),
  cond("Poisoned",     "fa-flask"),
  cond("Prone",        "fa-person-falling-burst"),
  cond("Restrained",   "fa-link"),
  cond("Stunned",      "fa-dizzy"),
  cond("Unconscious",  "fa-bed-pulse", true)
]);
