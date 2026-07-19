// NDRS Application — ApplicationV2 + HandlebarsApplicationMixin
// Foundry VTT v13/v14

import { TABS, ALL_ENTRIES, EXHAUSTION, CALENDAR, findEntryById } from "./data/index.js";
import { findPhbLink, openPhbPage } from "./phb-link.js";

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
      selectTab:           NDRSApplication._onSelectTab,
      openCard:            NDRSApplication._onOpenCard,
      closeModal:          NDRSApplication._onCloseModal,
      closeModalBackdrop:  NDRSApplication._onCloseModalBackdrop,
      toggleFav:           NDRSApplication._onToggleFav,
      toggleUnits:         NDRSApplication._onToggleUnits,
      setUnits:            NDRSApplication._onSetUnits,
      clearSearch:         NDRSApplication._onClearSearch,
      openPhb:             NDRSApplication._onOpenPhb
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

    const title = t(entry.i18n.titleKey);

    return {
      id: entry.id,
      icon: entry.icon || "fa-circle",
      tags: entry.tags ?? [],
      title,
      subtitle: localizeUnitAware(entry.i18n.subtitleKey),
      summary: localizeUnitAware(entry.i18n.summaryKey),
      example: localizeUnitAware(entry.i18n.exampleKey),
      notes: entry.i18n.notesKey ? localizeUnitAware(entry.i18n.notesKey) : "",
      hasNotes: !!entry.i18n.notesKey,
      source: entry.source,
      isFavorite: favorites.has(entry.id),
      phbLink: findPhbLink([title, ...(entry.phbAliases ?? [])])
    };
  }

  _prepareExhaustion() {
    const t = (k) => game.i18n.localize(k);
    const f = (k, d) => game.i18n.format(k, d);
    const isMetric = this._units === "metric";
    const lang = game.i18n.lang || "en";
    const nfmt = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    const unitStep = isMetric ? `${nfmt.format(1.5)} m` : "5 ft";
    const formatSpeed = (l) => isMetric
      ? `−${nfmt.format(Math.abs(l.speedM))} m`
      : `−${Math.abs(l.speedFt)} ft`;
    const formatD20 = (l) => `−${Math.abs(l.d20Penalty)}`;

    return {
      title: t(EXHAUSTION.titleKey),
      intro: f(EXHAUSTION.introKey, { unitStep }),
      notes: t(EXHAUSTION.notesKey),
      isMetric,
      levels: EXHAUSTION.levels.map(l => ({
        level: l.level,
        isDeath: l.level === 6,
        desc: l.level === 6
          ? t("NDRS.Exhaustion.LevelDeath")
          : f("NDRS.Exhaustion.LevelLine", { d20: formatD20(l), speed: formatSpeed(l) })
      })),
      source: EXHAUSTION.source
    };
  }

  _prepareCalendar() {
    const t = (k) => game.i18n.localize(k);
    const fmt = (k, data) => game.i18n.format(k, data);

    // Build a 30-day grid as 3 tendays x 10 days for each month.
    const buildDayGrid = () => {
      const grid = [];
      for (let td = 0; td < 3; td++) {
        const days = [];
        for (let d = 1; d <= 10; d++) {
          const dayNum = td * 10 + d;
          days.push({ day: dayNum, isTenday: dayNum % 10 === 0 });
        }
        grid.push({ label: fmt("NDRS.UI.TendayN", { n: td + 1 }), days });
      }
      return grid;
    };

    // Interleave months and holidays in calendar order.
    const timeline = [];
    const holidaysAfter = (monthIdx) => CALENDAR.holidays.filter(h => h.afterMonth === monthIdx);

    // Year-opener holidays (afterMonth === 0) before month 1.
    for (const h of holidaysAfter(0)) {
      timeline.push({ type: "holiday", name: t(h.nameKey), desc: t(h.descKey), leap: false });
    }

    // Each month, then any holidays positioned after it, then leap holiday if applicable.
    for (const m of CALENDAR.months) {
      timeline.push({
        type: "month",
        idx: m.idx,
        name: t(m.nameKey),
        subtitle: m.subtitleKey ? t(m.subtitleKey) : "",
        grid: buildDayGrid()
      });

      for (const h of holidaysAfter(m.idx)) {
        timeline.push({ type: "holiday", name: t(h.nameKey), desc: t(h.descKey), leap: false });
      }

      if (CALENDAR.leap?.afterMonth === m.idx) {
        timeline.push({
          type: "holiday",
          name: t(CALENDAR.leap.nameKey),
          desc: t(CALENDAR.leap.descKey),
          leap: true,
          everyYears: CALENDAR.leap.everyYears
        });
      }
    }

    return {
      intro: t(CALENDAR.introKey),
      weekName: t(CALENDAR.weekNameKey),
      timeline
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

  // Only close when the backdrop itself is clicked, not the dialog inside it.
  static _onCloseModalBackdrop(event, target) {
    if (event.target !== target) return;
    this._openCardId = null;
    this.render({ parts: ["main"] });
  }

  static async _onOpenPhb(event, target) {
    event.stopPropagation();
    await openPhbPage(target?.dataset?.uuid);
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

  static async _onSetUnits(event, target) {
    const unit = target?.dataset?.unit;
    if (unit !== "metric" && unit !== "imperial") return;
    if (this._units === unit) return;
    this._units = unit;
    await game.settings.set(MODULE_ID, "defaultUnits", unit);
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
