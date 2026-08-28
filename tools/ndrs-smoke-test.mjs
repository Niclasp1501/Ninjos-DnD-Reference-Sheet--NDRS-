#!/usr/bin/env node
/**
 * NDRS smoke test — exercises the render logic outside Foundry.
 *
 * The application class only needs a handful of globals (game, foundry,
 * Handlebars). Stubbing them lets us actually run _prepareContext instead of
 * assuming it works: it catches missing lang keys, broken unit variants,
 * search regressions and template context drift before a deploy.
 *
 * Usage: node tools/ndrs-smoke-test.mjs
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");

let failures = 0;
const ok = (m) => console.log(`✓ ${m}`);
const bad = (m) => { console.error(`✗ ${m}`); failures++; };
const check = (cond, m) => cond ? ok(m) : bad(m);

// ─── Stub the Foundry globals the application touches ──────────────────
function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const lang = process.argv.includes("--en") ? "en" : "de";
const strings = flatten(JSON.parse(fs.readFileSync(path.join(ROOT, "lang", `${lang}.json`), "utf8")));

const settings = { defaultTab: "round-actions", defaultUnits: "metric", phbLinks: true };
const favorites = new Set();

globalThis.foundry = {
  applications: {
    api: {
      // Minimal stand-ins: we only exercise our own methods.
      ApplicationV2: class { constructor() {} render() {} },
      HandlebarsApplicationMixin: (Base) => class extends Base {}
    }
  }
};

globalThis.game = {
  i18n: {
    lang,
    localize: (key) => (key in strings ? strings[key] : key),
    format: (key, data) => {
      const raw = key in strings ? strings[key] : key;
      return raw.replace(/\{(\w+)\}/g, (m, k) => (k in data ? data[k] : m));
    }
  },
  settings: {
    get: (_m, k) => settings[k],
    set: async (_m, k, v) => { settings[k] = v; }
  },
  user: {
    getFlag: () => [...favorites],
    setFlag: async (_m, _k, v) => { favorites.clear(); v.forEach(x => favorites.add(x)); }
  },
  modules: { get: () => ({ version: "test", active: false }) },
  packs: { get: () => null }
};

const { NDRSApplication } = await import(url.pathToFileURL(path.join(ROOT, "scripts", "ndrs-app.js")).href);

// ─── Exercise the render context ───────────────────────────────────────
const app = new NDRSApplication();
app.render = () => {};   // no DOM in this harness

const ctx = await app._prepareContext({});

check(ctx.tabs.length === 4, `four tabs (${ctx.tabs.map(t => t.label).join(", ")})`);
check(ctx.sections.length === 3, `actions tab has 3 sections, got ${ctx.sections.length}`);

const allCards = ctx.sections.flatMap(s => s.cards ?? []);
check(allCards.length === 20, `actions tab renders 20 cards, got ${allCards.length}`);

const untranslated = allCards.filter(c => /^NDRS\./.test(c.title) || /^NDRS\./.test(c.subtitle));
check(untranslated.length === 0,
  untranslated.length ? `untranslated keys leaked: ${untranslated.map(c => c.id).join(", ")}` : "no untranslated keys leaked");

// ─── Unit switching must actually change distance-dependent text ───────
const help = allCards.find(c => c.id === "help");
const metricHelp = help?.subtitle ?? "";
app._units = "imperial";
const imperialCtx = await app._prepareContext({});
const imperialHelp = imperialCtx.sections.flatMap(s => s.cards ?? []).find(c => c.id === "help")?.subtitle ?? "";
check(metricHelp !== imperialHelp && imperialHelp.length > 0,
  `unit toggle rewrites distance text ("${metricHelp.slice(-14)}" vs "${imperialHelp.slice(-14)}")`);
app._units = "metric";

// ─── Search must span tabs and reach the body text ─────────────────────
// "Unsichtbar"/"Invisible" appears in the Hide summary, not in its title.
const deepTerm = lang === "de" ? "Unsichtbar" : "Invisible";
app._search = deepTerm;
const searchCtx = await app._prepareContext({});
const hits = searchCtx.sections.flatMap(s => s.cards ?? []);
check(hits.some(c => c.id === "hide"), `search matches body text ("${deepTerm}" finds the Hide action)`);
check(searchCtx.searching === true, "search mode flagged in context");

const sourceTabs = new Set();
for (const c of hits) sourceTabs.add(c.id.startsWith("cond-") ? "conditions" : "other");
check(sourceTabs.size > 1 || hits.length > 1,
  `search spans tabs (${hits.length} hits: ${hits.map(c => c.id).join(", ")})`);

app._search = "zzzzz-nichts";
const emptyCtx = await app._prepareContext({});
check(emptyCtx.noResults === true && emptyCtx.sections.length === 0, "empty search yields a single no-results state");
app._search = "";

// ─── Favourites pin to the top of their section ────────────────────────
favorites.add("utilize");   // last card of the actions section
const favCtx = await app._prepareContext({});
const actionCards = favCtx.sections[0].cards;
check(actionCards[0].id === "utilize", `favourite pinned to top, got "${actionCards[0].id}"`);
favorites.clear();

// ─── Custom views ──────────────────────────────────────────────────────
app._activeTab = "conditions";
const condCtx = await app._prepareContext({});
const exh = condCtx.sections.find(s => s.custom === "exhaustion")?.data;
check(!!exh && exh.levels.length === 6, "exhaustion table has 6 levels");
check(exh.levels[0].desc.includes("1,5") || exh.levels[0].desc.includes("1.5"),
  `exhaustion level 1 shows metric speed: "${exh.levels[0].desc}"`);
check(!exh.levels[0].desc.includes("ft"), "exhaustion shows one unit system at a time");
check(exh.intro.includes("{unitStep}") === false, "exhaustion intro interpolates its placeholder");

app._activeTab = "calendar";
const calCtx = await app._prepareContext({});
const cal = calCtx.sections.find(s => s.custom === "calendar")?.data;
const months = cal.timeline.filter(e => e.type === "month");
const holidays = cal.timeline.filter(e => e.type === "holiday");
check(months.length === 12, `calendar has 12 months, got ${months.length}`);
check(holidays.length === 6, `calendar has 6 holidays incl. leap day, got ${holidays.length}`);
check(months[0].grid.length === 3 && months[0].grid[0].days.length === 10, "each month renders 3 tendays of 10 days");
check(cal.timeline[1].type === "holiday" || cal.timeline.some((e, i) => e.type === "holiday" && i > 0 && i < cal.timeline.length - 1),
  "holidays are interleaved between months, not appended");

console.log(`\n${failures} failure(s).`);
process.exit(failures > 0 ? 1 : 0);
