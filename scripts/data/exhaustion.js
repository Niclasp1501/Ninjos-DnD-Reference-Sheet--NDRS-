// D&D 5.5 (2024) — Exhaustion table
// 6 cumulative levels. Each level applies -2 to all d20 tests (attacks, saves, ability checks)
// and reduces speed by 5 ft (1.5 m). Level 6 = death.

export const EXHAUSTION = Object.freeze({
  id: "exhaustion-2024",
  source: { book: "PHB 2024", page: 39 },
  new2024: true,
  titleKey: "NDRS.Exhaustion.Title",
  introKey: "NDRS.Exhaustion.Intro",
  notesKey: "NDRS.Exhaustion.Notes",
  levels: [
    { level: 1, d20Penalty: -2,  speedFt: -5,  speedM: -1.5, descKey: "NDRS.Exhaustion.L1" },
    { level: 2, d20Penalty: -4,  speedFt: -10, speedM: -3.0, descKey: "NDRS.Exhaustion.L2" },
    { level: 3, d20Penalty: -6,  speedFt: -15, speedM: -4.5, descKey: "NDRS.Exhaustion.L3" },
    { level: 4, d20Penalty: -8,  speedFt: -20, speedM: -6.0, descKey: "NDRS.Exhaustion.L4" },
    { level: 5, d20Penalty: -10, speedFt: -25, speedM: -7.5, descKey: "NDRS.Exhaustion.L5" },
    { level: 6, d20Penalty: null, speedFt: null, speedM: null, descKey: "NDRS.Exhaustion.L6" }
  ]
});
