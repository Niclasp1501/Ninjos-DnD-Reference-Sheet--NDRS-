#!/usr/bin/env node
// NDRS Validator — locale parity, key resolution, source.page presence,
// length warnings, and (optional) 2024-rules audit.
//
// Usage:
//   node tools/ndrs-validate.mjs
//   node tools/ndrs-validate.mjs --audit-2024

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const LANG_DIR = path.join(ROOT, "lang");
const DATA_DIR = path.join(ROOT, "scripts", "data");

const args = new Set(process.argv.slice(2));
const audit2024 = args.has("--audit-2024");

let errors = 0;
let warnings = 0;

const fail = (msg) => { console.error(`✗ ${msg}`); errors++; };
const warn = (msg) => { console.warn(`⚠ ${msg}`); warnings++; };
const ok   = (msg) => { console.log(`✓ ${msg}`); };

// ─── 1. Load lang files ───────────────────────────────────────────────
function loadLang(lang) {
  const file = path.join(LANG_DIR, `${lang}.json`);
  if (!fs.existsSync(file)) { fail(`Missing lang file: ${file}`); return {}; }
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (e) { fail(`Invalid JSON in ${file}: ${e.message}`); return {}; }
}

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const de = loadLang("de");
const en = loadLang("en");
const deFlat = flatten(de);
const enFlat = flatten(en);

// ─── 2. Locale parity ─────────────────────────────────────────────────
const deKeys = new Set(Object.keys(deFlat));
const enKeys = new Set(Object.keys(enFlat));
const onlyDe = [...deKeys].filter(k => !enKeys.has(k));
const onlyEn = [...enKeys].filter(k => !deKeys.has(k));

if (onlyDe.length) onlyDe.forEach(k => fail(`Key only in de.json: ${k}`));
if (onlyEn.length) onlyEn.forEach(k => fail(`Key only in en.json: ${k}`));
if (!onlyDe.length && !onlyEn.length) ok(`Locale parity OK (${deKeys.size} keys each).`);

// Empty values
for (const [k, v] of Object.entries(deFlat)) if (v === "") fail(`Empty value in de.json: ${k}`);
for (const [k, v] of Object.entries(enFlat)) if (v === "") fail(`Empty value in en.json: ${k}`);

// ─── 3. Load data modules ────────────────────────────────────────────
const dataFiles = [
  "actions.js", "bonus-actions.js", "reactions.js",
  "movement.js", "conditions.js"
];

const ALL_ENTRIES = [];
for (const f of dataFiles) {
  const mod = await import(url.pathToFileURL(path.join(DATA_DIR, f)).href);
  for (const exp of Object.values(mod)) {
    if (Array.isArray(exp)) ALL_ENTRIES.push(...exp);
  }
}
ok(`Loaded ${ALL_ENTRIES.length} rule entries.`);

// ─── 4. Source.page presence ──────────────────────────────────────────
for (const e of ALL_ENTRIES) {
  if (!e.source?.book) fail(`Entry "${e.id}" missing source.book`);
  if (e.source?.page === undefined || e.source?.page === null)
    fail(`Entry "${e.id}" missing source.page`);
}

// ─── 5. Key resolution ────────────────────────────────────────────────
function resolveKey(key, units) {
  if (!key) return [];
  if (units) return [`${key}.metric`, `${key}.imperial`];
  return [key];
}

for (const e of ALL_ENTRIES) {
  const required = ["titleKey", "subtitleKey", "summaryKey", "exampleKey"];
  for (const k of required) {
    const langKey = e.i18n?.[k];
    if (!langKey) { fail(`Entry "${e.id}" missing i18n.${k}`); continue; }
    const variants = e.units && k !== "titleKey" ? resolveKey(langKey, true) : [langKey];
    for (const v of variants) {
      if (!(v in deFlat)) fail(`Missing de key for "${e.id}".${k}: ${v}`);
      if (!(v in enFlat)) fail(`Missing en key for "${e.id}".${k}: ${v}`);
    }
  }
  if (e.i18n?.notesKey) {
    const variants = e.units ? resolveKey(e.i18n.notesKey, true) : [e.i18n.notesKey];
    for (const v of variants) {
      if (!(v in deFlat)) fail(`Missing de notes key for "${e.id}": ${v}`);
      if (!(v in enFlat)) fail(`Missing en notes key for "${e.id}": ${v}`);
    }
  }
}

// ─── 6. Length warnings ───────────────────────────────────────────────
function countSentences(text) {
  if (!text || typeof text !== "string") return 0;
  return (text.match(/[.!?]+(\s|$)/g) || []).length;
}

for (const e of ALL_ENTRIES) {
  const summaryKeys = e.units ? [`${e.i18n.summaryKey}.metric`, `${e.i18n.summaryKey}.imperial`] : [e.i18n.summaryKey];
  for (const k of summaryKeys) {
    const txt = deFlat[k];
    const n = countSentences(txt);
    if (n > 8) warn(`Entry "${e.id}" summary has ${n} sentences (>8) in de.json`);
  }
  const subtitleKey = e.units ? `${e.i18n.subtitleKey}.metric` : e.i18n.subtitleKey;
  if (typeof deFlat[subtitleKey] === "string" && deFlat[subtitleKey].length > 110)
    warn(`Entry "${e.id}" subtitle exceeds 110 chars in de.json`);
}

// ─── 7. 2024-rules audit ──────────────────────────────────────────────
if (audit2024) {
  console.log("\n--- 2024 Rules Audit ---");

  const FORBIDDEN_DE = [
    /1\s+Stufe\s+Ersch[öo]pfung\s+pro/i,
    /Player.?s?\s+Handbook(?!\s+(2024|2014))/i
  ];
  const FORBIDDEN_EN = [
    /level\s+of\s+exhaustion[^.]*disadvantage\s+on\s+ability\s+checks/i,
    /Player.?s?\s+Handbook(?!\s+(2024|2014))/i
  ];

  const REQUIRED_BY_ID = {
    "exhaustion-2024": [/(−|-)2/, /6\s+(Stufen|levels)/i, /(−|-)5\s*ft|(−|-)1[,.]5\s*m/i],
    "cond-Hide": [],
    "hide": [/Invisible|Unsichtbar/i],
    "cond-Grappled": [/Unbewaffnet|Unarmed|Waffenloser/i],
    "cond-Unconscious": [/Prone|Liegend/i],
    "mv-jump": [/St[aä]rke|Strength/i]
  };

  for (const [k, v] of Object.entries(deFlat)) {
    if (typeof v !== "string") continue;
    for (const rx of FORBIDDEN_DE) {
      if (rx.test(v)) fail(`Forbidden 2014-style phrasing in de.json key ${k}: ${rx}`);
    }
  }
  for (const [k, v] of Object.entries(enFlat)) {
    if (typeof v !== "string") continue;
    for (const rx of FORBIDDEN_EN) {
      if (rx.test(v)) fail(`Forbidden 2014-style phrasing in en.json key ${k}: ${rx}`);
    }
  }

  for (const [id, requirements] of Object.entries(REQUIRED_BY_ID)) {
    if (!requirements.length) continue;
    const entryKeys = Object.keys(deFlat).filter(k => k.toLowerCase().includes(id.replace(/^cond-/, "").toLowerCase()));
    const blob = entryKeys.map(k => `${deFlat[k]}\n${enFlat[k] ?? ""}`).join("\n");
    for (const rx of requirements) {
      if (!rx.test(blob)) warn(`Entry "${id}" missing required 2024 marker ${rx}`);
    }
  }

  ok("2024 audit pass complete.");
}

// ─── Summary ──────────────────────────────────────────────────────────
console.log(`\n${errors} error(s), ${warnings} warning(s).`);
process.exit(errors > 0 ? 1 : 0);
