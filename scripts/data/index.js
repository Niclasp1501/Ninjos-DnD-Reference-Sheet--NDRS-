// Central data index — single import surface for the application.

import { ACTIONS }       from "./actions.js";
import { BONUS_ACTIONS } from "./bonus-actions.js";
import { REACTIONS }     from "./reactions.js";
import { MOVEMENT }      from "./movement.js";
import { CONDITIONS }    from "./conditions.js";
import { EXHAUSTION }    from "./exhaustion.js";
import { CALENDAR }      from "./calendar.js";

export const TABS = Object.freeze([
  {
    id: "round-actions",
    iconClass: "fa-swords",
    labelKey: "NDRS.UI.TabActions",
    sections: [
      { titleKey: "NDRS.UI.SectionAction",   entries: ACTIONS },
      { titleKey: "NDRS.UI.SectionBonus",    entries: BONUS_ACTIONS },
      { titleKey: "NDRS.UI.SectionReaction", entries: REACTIONS }
    ]
  },
  {
    id: "movement",
    iconClass: "fa-shoe-prints",
    labelKey: "NDRS.UI.TabMovement",
    sections: [
      { titleKey: "NDRS.UI.SectionMovement", entries: MOVEMENT }
    ]
  },
  {
    id: "conditions",
    iconClass: "fa-circle-radiation",
    labelKey: "NDRS.UI.TabConditions",
    sections: [
      { titleKey: "NDRS.UI.SectionConditions", entries: CONDITIONS },
      { titleKey: "NDRS.UI.SectionExhaustion", entries: [], custom: "exhaustion" }
    ]
  },
  {
    id: "calendar",
    iconClass: "fa-calendar",
    labelKey: "NDRS.UI.TabCalendar",
    sections: [
      { titleKey: "NDRS.UI.SectionCalendar", entries: [], custom: "calendar" }
    ]
  }
]);

export const ALL_ENTRIES = Object.freeze([
  ...ACTIONS, ...BONUS_ACTIONS, ...REACTIONS, ...MOVEMENT, ...CONDITIONS
]);

export { ACTIONS, BONUS_ACTIONS, REACTIONS, MOVEMENT, CONDITIONS, EXHAUSTION, CALENDAR };

export function findEntryById(id) {
  return ALL_ENTRIES.find(e => e.id === id) ?? null;
}
