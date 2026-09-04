// NDRS — main entry point
// Foundry VTT v13/v14 init/ready hooks, settings, keybinding, integrations.

import { NDRSApplication } from "./ndrs-app.js";
import { buildPhbIndex, resetPhbIndex, hasPhbIndex } from "./phb-link.js";

const MODULE_ID = "ndrs";

let ndrsApp = null;

function getApp() {
  if (!ndrsApp) ndrsApp = new NDRSApplication();
  return ndrsApp;
}

async function openApp() {
  const app = getApp();
  if (app.rendered) app.bringToFront?.();
  else await app.render({ force: true });
  return app;
}

function closeApp() {
  if (ndrsApp?.rendered) ndrsApp.close();
}

function toggleApp() {
  if (ndrsApp?.rendered) closeApp();
  else openApp();
}

async function gotoTab(tabId) {
  const app = await openApp();
  await app?.gotoTab?.(tabId);
}

// ─── Journal-button delegated click (capture-phase, install once) ─────
function _ndrsOpenFromJournalButton(event) {
  const button = event?.target?.closest?.(".ndrs-open-btn");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  const api = game.modules.get(MODULE_ID)?.api;
  if (!api?.open) return;

  api.open();
  const tab = button.dataset?.ndrsTab;
  if (tab) api.gotoTab(tab);
}

// ─── Only-Sheet button injection ──────────────────────────────────────
function _applyOnlySheetStyle(btn) {
  btn.className = "button";
  btn.style.background = "";
  btn.style.border = "";
  btn.style.color = "";
  btn.style.padding = "";
  btn.style.borderRadius = "";
  btn.style.cursor = "pointer";
}

function _installOnlySheetObserver() {
  if (window._ndrsOnlySheetObserverInstalled) return;
  window._ndrsOnlySheetObserverInstalled = true;

  const observer = new MutationObserver(() => {
    if (!game.settings.get(MODULE_ID, "onlySheetButton")) return;
    const container = document.getElementById("so-main-buttons");
    if (!container) return;
    if (document.getElementById("ndrs-so-btn")) return;

    const btn = document.createElement("button");
    btn.id = "ndrs-so-btn";
    btn.title = game.i18n.localize("NDRS.ButtonOpen") || "Open NDRS";
    _applyOnlySheetStyle(btn);
    btn.innerHTML = '<i class="fas fa-rectangle-list"></i>';
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openApp();
    });
    container.appendChild(btn);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ─── init ─────────────────────────────────────────────────────────────
Hooks.once("init", () => {
  console.log("NDRS | Initializing Ninjo's DnD Reference Sheet");

  Handlebars.registerHelper("eq", (a, b) => a === b);

  game.keybindings.register(MODULE_ID, "openCheatSheet", {
    name: "NDRS.ButtonOpen",
    hint: "NDRS.KeybindingHint",
    editable: [
      { key: "KeyR", modifiers: [KeyboardManager.MODIFIER_KEYS.SHIFT] }
    ],
    onDown: () => {
      toggleApp();
      return true;
    }
  });

  game.settings.register(MODULE_ID, "defaultTab", {
    name: "NDRS.Settings.DefaultTab.Name",
    hint: "NDRS.Settings.DefaultTab.Hint",
    scope: "client",
    config: true,
    type: String,
    choices: {
      "round-actions": "NDRS.UI.TabActions",
      "movement":      "NDRS.UI.TabMovement",
      "conditions":    "NDRS.UI.TabConditions",
      "calendar":      "NDRS.UI.TabCalendar"
    },
    default: "round-actions"
  });

  game.settings.register(MODULE_ID, "defaultUnits", {
    name: "NDRS.Settings.DefaultUnits.Name",
    hint: "NDRS.Settings.DefaultUnits.Hint",
    scope: "client",
    config: true,
    type: String,
    choices: {
      "metric":   "NDRS.Settings.DefaultUnits.Metric",
      "imperial": "NDRS.Settings.DefaultUnits.Imperial"
    },
    default: "metric"
  });

  game.settings.register(MODULE_ID, "onlySheetButton", {
    name: "NDRS.Settings.ReplaceOnlySheet.Name",
    hint: "NDRS.Settings.ReplaceOnlySheet.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "phbLinks", {
    name: "NDRS.Settings.PhbLinks.Name",
    hint: "NDRS.Settings.PhbLinks.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      resetPhbIndex();
      buildPhbIndex().then(() => ndrsApp?.rendered && ndrsApp.render({ parts: ["main"] }));
    }
  });
});

// ─── ready ────────────────────────────────────────────────────────────
Hooks.once("ready", () => {
  document.body?.classList?.toggle("role-player", !game.user.isGM);
  document.body?.classList?.toggle("role-gm", game.user.isGM);

  if (!window._ndrsJournalButtonFixInstalled) {
    document.addEventListener("click", _ndrsOpenFromJournalButton, true);
    window._ndrsJournalButtonFixInstalled = true;
  }

  _installOnlySheetObserver();

  const module = game.modules.get(MODULE_ID);
  module.api = {
    open: openApp,
    close: closeApp,
    toggle: toggleApp,
    gotoTab,
    setSearch: async (q) => {
      const app = await openApp();
      await app?.setSearch?.(q);
    }
  };

  // Optional handbook deep links. Failure here must never block the module.
  buildPhbIndex()
    .then(() => {
      if (!hasPhbIndex()) return;
      console.log("NDRS | Handbook deep links available");
      // The window may already be open; refresh so the links show up.
      if (ndrsApp?.rendered) ndrsApp.render({ parts: ["main"] });
    })
    .catch(err => console.warn("NDRS | Handbook index unavailable", err));

  console.log("NDRS | Ready. API exposed at game.modules.get('ndrs').api");
});

// ─── Actor Directory header button ────────────────────────────────────
Hooks.on("renderActorDirectory", (app, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;
  if (root.querySelector("#ndrs-directory-btn")) return;

  const button = document.createElement("button");
  button.id = "ndrs-directory-btn";
  button.innerHTML = `<i class="fas fa-rectangle-list"></i> ${game.i18n.localize("NDRS.ButtonOpen")}`;
  button.addEventListener("click", (e) => {
    e.preventDefault();
    openApp();
  });

  const headerActions = root.querySelector(".directory-header .header-actions");
  if (headerActions) headerActions.appendChild(button);
});
