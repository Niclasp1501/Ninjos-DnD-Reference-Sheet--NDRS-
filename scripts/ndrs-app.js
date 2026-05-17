// NDRS Application — ApplicationV2 + HandlebarsApplicationMixin
// Foundry VTT v13/v14

import { TABS, ALL_ENTRIES, EXHAUSTION, CALENDAR, findEntryById } from "./data/index.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const MODULE_ID = "ndrs";

export class NDRSApplication extends HandlebarsApplicationMixin(ApplicationV2) {

  static DEFAULT_OPTIONS = {
    id: "ndrs-app",
    classes: ["ndrs-app-window"],
    tag: "div",
    window: {
      title: "NDRS.AppTitle",
      icon: "fas fa-book-open",
      resizable: true,
      contentClasses: ["ndrs-window-content"]
    },
    position: { width: 1100, height: 720 },
    actions: {
      selectTab:   NDRSApplication._onSelectTab,
      openCard:    NDRSApplication._onOpenCard,
      closeModal:  NDRSApplication._onCloseModal,
      toggleFav:   NDRSApplication._onToggleFav,
      toggleUnits: NDRSApplication._onToggleUnits,
      clearSearch: NDRSApplication._onClearSearch
    }
  };

  static PARTS = {
    main: { template: "modules/ndrs/templates/ndrs-app.hbs" }
  };

  constructor(options = {}) {
    super(options);
    this._activeTab = game.settings.get(MODULE_ID, "defaultTab") || "round-actions";
    this._units = game.settings.get(MODULE_ID, "defaultUnits") || "metric";
    this._search = "";
    this._openCardId = null;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Context
  // ─────────────────────────────────────────────────────────────────────
  async _prepareContext(options) {
    const favorites = new Set(game.user.getFlag(MODULE_ID, "favorites") ?? []);
    const tab = TABS.find(t => t.id === this._activeTab) ?? TABS[0];

    const sections = tab.sections.map(sec => {
      if (sec.custom === "exhaustion") {
        return {
          titleKey: sec.titleKey,
          custom: "exhaustion",
          data: this._prepareExhaustion()
        };
      }
      if (sec.custom === "calendar") {
        return {
          titleKey: sec.titleKey,
          custom: "calendar",
          data: this._prepareCalendar()
        };
      }
      return {
        titleKey: sec.titleKey,
        cards: this._filterEntries(sec.entries, favorites)
      };
    });

    let openCard = null;
    if (this._openCardId) {
      const entry = findEntryById(this._openCardId);
      if (entry) openCard = this._prepareCard(entry, favorites);
    }

    return {
      tabs: TABS.map(t => ({
        id: t.id,
        iconClass: t.iconClass,
        label: game.i18n.localize(t.labelKey),
        active: t.id === this._activeTab
      })),
      activeTab: this._activeTab,
      sections,
      search: this._search,
      units: this._units,
      isMetric: this._units === "metric",
      openCard,
      hasOpenCard: !!openCard,
      version: game.modules.get(MODULE_ID)?.version ?? ""
    };
  }

  _filterEntries(entries, favorites) {
    const needle = this._search.trim().toLowerCase();
    return entries
      .map(e => this._prepareCard(e, favorites))
      .filter(c => !needle
        || c.title.toLowerCase().includes(needle)
        || c.subtitle.toLowerCase().includes(needle)
        || (c.tags ?? []).some(t => t.toLowerCase().includes(needle)));
  }

  _prepareCard(entry, favorites) {
    const t = (key) => key ? game.i18n.localize(key) : "";
    const unit = this._units;

    const localizeUnitAware = (key) => {
      if (!key) return "";
      const raw = game.i18n.translations?.NDRS?.__unitMap?.[key];
      // Foundry i18n flattens; we use a convention: "<key>" or "<key>.metric"/"<key>.imperial".
      if (entry.units) {
        const variantKey = `${key}.${unit}`;
        const v = game.i18n.localize(variantKey);
        if (v && v !== variantKey) return v;
      }
      return game.i18n.localize(key);
    };

    return {
      id: entry.id,
      icon: entry.icon || "fa-circle",
      tags: entry.tags ?? [],
      title: t(entry.i18n.titleKey),
      subtitle: t(entry.i18n.subtitleKey),
      summary: localizeUnitAware(entry.i18n.summaryKey),
      example: localizeUnitAware(entry.i18n.exampleKey),
      notes: entry.i18n.notesKey ? localizeUnitAware(entry.i18n.notesKey) : "",
      hasNotes: !!entry.i18n.notesKey,
      source: entry.source,
      new2024: !!entry.new2024,
      isFavorite: favorites.has(entry.id)
    };
  }

  _prepareExhaustion() {
    const t = (k) => game.i18n.localize(k);
    return {
      title: t(EXHAUSTION.titleKey),
      intro: t(EXHAUSTION.introKey),
      notes: t(EXHAUSTION.notesKey),
      isMetric: this._units === "metric",
      levels: EXHAUSTION.levels.map(l => ({
        level: l.level,
        d20Penalty: l.d20Penalty,
        speedFt: l.speedFt,
        speedM: l.speedM,
        desc: t(l.descKey),
        isDeath: l.level === 6
      })),
      source: EXHAUSTION.source
    };
  }

  _prepareCalendar() {
    const t = (k) => game.i18n.localize(k);
    return {
      intro: t(CALENDAR.introKey),
      weekName: t(CALENDAR.weekNameKey),
      months: CALENDAR.months.map(m => ({
        idx: m.idx,
        position: m.position,
        name: t(m.nameKey)
      })),
      holidays: CALENDAR.holidays.map(h => ({
        id: h.id,
        afterMonth: h.afterMonth,
        name: t(h.nameKey),
        desc: t(h.descKey)
      })),
      leap: {
        name: t(CALENDAR.leap.nameKey),
        desc: t(CALENDAR.leap.descKey),
        afterMonth: CALENDAR.leap.afterMonth,
        everyYears: CALENDAR.leap.everyYears
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────
  // Render hooks
  // ─────────────────────────────────────────────────────────────────────
  _onRender(context, options) {
    super._onRender?.(context, options);
    const root = this.element;

    const searchInput = root.querySelector("#ndrs-search-input");
    if (searchInput) {
      searchInput.value = this._search;
      searchInput.addEventListener("input", (ev) => {
        this._search = ev.target.value || "";
        this.render({ parts: ["main"] });
      });
      searchInput.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape") {
          this._search = "";
          this.render({ parts: ["main"] });
        }
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Action handlers (ApplicationV2 delegated actions)
  // ─────────────────────────────────────────────────────────────────────
  static _onSelectTab(event, target) {
    const tabId = target?.dataset?.tab;
    if (!tabId) return;
    this._activeTab = tabId;
    game.settings.set(MODULE_ID, "defaultTab", tabId).catch(() => {});
    this.render({ parts: ["main"] });
  }

  static _onOpenCard(event, target) {
    const id = target?.dataset?.cardId;
    if (!id) return;
    this._openCardId = id;
    this.render({ parts: ["main"] });
  }

  static _onCloseModal() {
    this._openCardId = null;
    this.render({ parts: ["main"] });
  }

  static async _onToggleFav(event, target) {
    event.stopPropagation();
    const id = target?.dataset?.cardId;
    if (!id) return;
    const current = new Set(game.user.getFlag(MODULE_ID, "favorites") ?? []);
    if (current.has(id)) current.delete(id); else current.add(id);
    await game.user.setFlag(MODULE_ID, "favorites", [...current]);
    this.render({ parts: ["main"] });
  }

  static async _onToggleUnits() {
    this._units = this._units === "metric" ? "imperial" : "metric";
    await game.settings.set(MODULE_ID, "defaultUnits", this._units);
    this.render({ parts: ["main"] });
  }

  static _onClearSearch() {
    this._search = "";
    this.render({ parts: ["main"] });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Public API helpers
  // ─────────────────────────────────────────────────────────────────────
  gotoTab(tabId) {
    if (!TABS.find(t => t.id === tabId)) return;
    this._activeTab = tabId;
    this.render({ parts: ["main"] });
  }

  setSearch(query) {
    this._search = String(query || "");
    this.render({ parts: ["main"] });
  }
}
