// NDRS - optional Player's Handbook deep links
//
// If a Player's Handbook module is installed and active, NDRS can offer an
// "open in the handbook" button inside each expanded card. This is entirely
// optional: when no supported handbook is present, nothing is shown.
//
// The lookup is done at runtime against the compendium index and matched by
// page name, so no hardcoded UUIDs can go stale when the handbook updates.

const MODULE_ID = "ndrs";

// Supported handbooks, most specific first. Each entry lists the compendium
// packs to search. Packs that do not exist are skipped silently.
const HANDBOOK_SOURCES = [
  {
    moduleId: "dnd-players-handbook-deutsch",
    labelKey: "NDRS.Phb.SourceGermanPhb",
    packs: ["dnd-players-handbook-deutsch.playerhandbuch-deutsch"]
  },
  {
    moduleId: "dnd-players-handbook",
    labelKey: "NDRS.Phb.SourcePhb",
    packs: ["dnd-players-handbook.content"]
  }
];

// Fallback: the dnd5e system's own 2024 rules content. Present for everyone
// running the modern dnd5e system, and translated by the German system module.
const SYSTEM_FALLBACK = {
  moduleId: null,
  labelKey: "NDRS.Phb.SourceSystem",
  packs: ["dnd5e.content24", "dnd5e.rules"]
};

/** name -> { uuid, pageName, packLabel } */
let _index = null;
let _indexPromise = null;
let _activeSourceLabel = "";

function _normalize(str) {
  return String(str ?? "")
    .toLowerCase()
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function _resolveSources() {
  const sources = [];
  for (const src of HANDBOOK_SOURCES) {
    if (src.moduleId && !game.modules.get(src.moduleId)?.active) continue;
    sources.push(src);
  }
  // System content is only used when no dedicated handbook module is active.
  if (!sources.length) sources.push(SYSTEM_FALLBACK);
  return sources;
}

/**
 * Build the page-name index once. Safe to call repeatedly.
 * @returns {Promise<Map<string, object>>}
 */
export async function buildPhbIndex() {
  if (_index) return _index;
  if (_indexPromise) return _indexPromise;

  _indexPromise = (async () => {
    const map = new Map();
    const sources = _resolveSources();

    for (const src of sources) {
      for (const packId of src.packs) {
        const pack = game.packs.get(packId);
        if (!pack || pack.documentName !== "JournalEntry") continue;

        let index;
        try {
          index = await pack.getIndex({ fields: ["pages.name", "pages._id", "pages.type"] });
        } catch (err) {
          console.warn(`NDRS | Could not index pack ${packId}`, err);
          continue;
        }

        for (const entry of index) {
          for (const page of entry.pages ?? []) {
            if (!page?.name) continue;
            const key = _normalize(page.name);
            if (!key || map.has(key)) continue;
            map.set(key, {
              uuid: `Compendium.${packId}.JournalEntry.${entry._id}.JournalEntryPage.${page._id}`,
              pageName: page.name,
              journalName: entry.name,
              packLabel: pack.metadata?.label ?? packId
            });
          }
        }

        if (map.size && !_activeSourceLabel) {
          _activeSourceLabel = game.i18n.localize(src.labelKey);
        }
      }
    }

    _index = map;
    console.log(`NDRS | Handbook index built: ${map.size} pages from ${sources.length} source(s)`);
    return map;
  })();

  return _indexPromise;
}

/** Drop the cached index, e.g. after a module is toggled. */
export function resetPhbIndex() {
  _index = null;
  _indexPromise = null;
  _activeSourceLabel = "";
}

/** True when at least one handbook page was indexed. */
export function hasPhbIndex() {
  return !!_index?.size;
}

/**
 * Look up a handbook page for a rule entry.
 * @param {string[]} candidates  Titles to try, in order of preference.
 * @returns {{uuid: string, label: string}|null}
 */
export function findPhbLink(candidates) {
  if (!_index?.size) return null;
  if (!game.settings.get(MODULE_ID, "phbLinks")) return null;

  for (const candidate of candidates) {
    if (!candidate) continue;
    const hit = _index.get(_normalize(candidate));
    if (hit) {
      return {
        uuid: hit.uuid,
        label: game.i18n.format("NDRS.Phb.ButtonTooltip", {
          page: hit.pageName,
          source: hit.packLabel
        })
      };
    }
  }
  return null;
}

/** Open a handbook page by UUID in Foundry's journal sheet. */
export async function openPhbPage(uuid) {
  if (!uuid) return;
  let doc;
  try {
    doc = await fromUuid(uuid);
  } catch (err) {
    console.error("NDRS | Failed to resolve handbook UUID", uuid, err);
  }
  if (!doc) {
    ui.notifications?.warn(game.i18n.localize("NDRS.Phb.NotFound"));
    return;
  }

  // A JournalEntryPage is rendered through its parent journal, focused on the page.
  const journal = doc.parent ?? doc;
  const pageId = doc.parent ? doc.id : undefined;
  journal.sheet?.render(true, pageId ? { pageId } : {});
}
