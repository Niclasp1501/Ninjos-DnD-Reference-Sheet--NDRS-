// NDRS Application — ApplicationV2 + HandlebarsApplicationMixin
// Foundry VTT v13/v14

import { TABS, EXHAUSTION, CALENDAR, findEntryById } from "./data/index.js";
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
      selectTab:          NDRSApplication._onSelectTab,
      openCard:           NDRSApplication._onOpenCard,
      closeModal:         NDRSApplication._onCloseModal,
      closeModalBackdrop: NDRSApplication._onCloseModalBackdrop,
      toggleFav:          NDRSApplication._onToggleFav,
      setUnits:           NDRSApplication._onSetUnits,
      clearSearch:        NDRSApplication._onClearSearch,
      openPhb:            NDRSApplication._onOpenPhb
    }
  };

  static PARTS = {
    main: {
      template: "modules/ndrs/templates/ndrs-app.hbs",
      // Without this, Foundry resets the scroll position on every re-render —
      // and we re-render on each keystroke, card click and favourite toggle.
      scrollable: [".ndrs-content"]
    }
  };

  constructor(options = {}) {
    super(options);
    this._activeTab = game.settings.get(MODULE_ID, "defaultTab") || "round-actions";
    this._units = game.settings.get(MODULE_ID, "defaultUnits") || "metric";
    this._search = "";
    this._openCardId = null;
  }

  /** True while a search term is active; the search then spans every tab. */
  get isSearching() {
    return this._search.trim().length > 0;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Context
  // ─────────────────────────────────────────────────────────────────────
  async _prepareContext(options) {
    const favorites = new Set(game.user.getFlag(MODULE_ID, "favorites") ?? []);
    const searching = this.isSearching;

    // While searching we look across every tab, otherwise only the active one.
    const sourceTabs = searching
      ? TABS
      : [TABS.find(t => t.id === this._activeTab) ?? TABS[0]];

    const sections = [];
    for (const tab of sourceTabs) {
      for (const sec of tab.sections) {
        // Custom views (exhaustion table, calendar) hold no cards to search.
        if (sec.custom) {
          if (searching) continue;
          sections.push({
            titleKey: sec.titleKey,
            custom: sec.custom,
            data: sec.custom === "exhaustion" ? this._prepareExhaustion() : this._prepareCalendar()
          });
          continue;
        }

        const cards = this._filterEntries(sec.entries, favorites);
        if (searching && !cards.length) continue;
        sections.push({ titleKey: sec.titleKey, cards });
      }
    }

    const openCard = this._openCardId
      ? this._prepareCard(findEntryById(this._openCardId), favorites, { withPhbLink: true })
      : null;

    return {
      tabs: TABS.map(t => ({
        id: t.id,
        iconClass: t.iconClass,
        label: game.i18n.localize(t.labelKey),
        active: !searching && t.id === this._activeTab
      })),
      activeTab: this._activeTab,
      sections,
      search: this._search,
      searching,
      noResults: searching && !sections.length,
      isMetric: this._units === "metric",
      openCard,
      hasOpenCard: !!openCard,
      version: game.modules.get(MODULE_ID)?.version ?? ""
    };
  }

  /**
   * Filter and order the cards of one section.
   * Favourites are pinned to the top, otherwise the authored order is kept.
   */
  _filterEntries(entries, favorites) {
    const needle = this._search.trim().toLowerCase();
    const cards = entries.map(e => this._prepareCard(e, favorites));
    const matches = needle ? cards.filter(c => c.haystack.includes(needle)) : cards;

    // Stable partition: favourites first, authored order kept within groups.
    return [...matches.filter(c => c.isFavorite), ...matches.filter(c => !c.isFavorite)];
  }

  /**
   * @param {object} entry                   A rule entry from the data modules.
   * @param {Set<string>} favorites          Ids the current user has pinned.
   * @param {object} [options]
   * @param {boolean} [options.withPhbLink]  Resolve the handbook link (modal only).
   */
  _prepareCard(entry, favorites, { withPhbLink = false } = {}) {
    if (!entry) return null;

    const unit = this._units;
    const localize = (key) => {
      if (!key) return "";
      if (entry.units) {
        const variantKey = `${key}.${unit}`;
        const variant = game.i18n.localize(variantKey);
        if (variant && variant !== variantKey) return variant;
      }
      return game.i18n.localize(key);
    };

    const title = game.i18n.localize(entry.i18n.titleKey);
    const subtitle = localize(entry.i18n.subtitleKey);
    const summary = localize(entry.i18n.summaryKey);
    const example = localize(entry.i18n.exampleKey);
    const notes = entry.i18n.notesKey ? localize(entry.i18n.notesKey) : "";
    const tags = entry.tags ?? [];

    return {
      id: entry.id,
      icon: entry.icon || "fa-circle",
      tags,
      title,
      subtitle,
      summary,
      example,
      notes,
      hasNotes: !!notes,
      source: entry.source,
      isFavorite: favorites.has(entry.id),
      // Everything a search should match, lowercased once per render.
      haystack: [title, subtitle, summary, example, notes, ...tags].join(" ").toLowerCase(),
      phbLink: withPhbLink ? findPhbLink([title, ...(entry.phbAliases ?? [])]) : null
    };
  }

  _prepareExhaustion() {
    const t = (k) => game.i18n.localize(k);
    const f = (k, d) => game.i18n.format(k, d);
    const isMetric = this._units === "metric";
    const nfmt = new Intl.NumberFormat(game.i18n.lang || "en", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });

    const unitStep = isMetric ? `${nfmt.format(1.5)} m` : "5 ft";
    const speed = (l) => isMetric
      ? `−${nfmt.format(Math.abs(l.speedM))} m`
      : `−${Math.abs(l.speedFt)} ft`;

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
          : f("NDRS.Exhaustion.LevelLine", { d20: `−${Math.abs(l.d20Penalty)}`, speed: speed(l) })
      })),
      source: EXHAUSTION.source
    };
  }

  _prepareCalendar() {
    const t = (k) => game.i18n.localize(k);
    const f = (k, d) => game.i18n.format(k, d);

    // The day grid is identical for every month, so build it once per render.
    const grid = [];
    for (let td = 0; td < CALENDAR.tendaysPerMonth; td++) {
      const days = [];
      for (let d = 1; d <= CALENDAR.daysPerTenday; d++) {
        const day = td * CALENDAR.daysPerTenday + d;
        days.push({ day, isTenday: day % CALENDAR.daysPerTenday === 0 });
      }
      grid.push({ label: f("NDRS.UI.TendayN", { n: td + 1 }), days });
    }

    const holidaysAfter = (idx) => CALENDAR.holidays.filter(h => h.afterMonth === idx);
    const asHoliday = (h, leap = false) => ({
      type: "holiday",
      name: t(h.nameKey),
      desc: t(h.descKey),
      leap,
      everyYears: leap ? CALENDAR.leap.everyYears : undefined
    });

    const timeline = [];
    for (const h of holidaysAfter(0)) timeline.push(asHoliday(h));

    for (const m of CALENDAR.months) {
      timeline.push({
        type: "month",
        idx: m.idx,
        name: t(m.nameKey),
        subtitle: m.subtitleKey ? t(m.subtitleKey) : "",
        grid
      });
      for (const h of holidaysAfter(m.idx)) timeline.push(asHoliday(h));
      if (CALENDAR.leap?.afterMonth === m.idx) timeline.push(asHoliday(CALENDAR.leap, true));
    }

    return {
      intro: t(CALENDAR.introKey),
      weekName: t(CALENDAR.weekNameKey),
      daysPerMonth: CALENDAR.daysPerMonth,
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
    }

    // Escape must dismiss the detail dialog before Foundry's global "dismiss"
    // keybinding closes the whole window. Foundry listens on `window` in the
    // bubble phase, so stopping propagation here is enough.
    root.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape") return;
      if (this._openCardId) {
        ev.preventDefault();
        ev.stopPropagation();
        this._openCardId = null;
        this.render({ parts: ["main"] });
        return;
      }
      if (this._search) {
        ev.preventDefault();
        ev.stopPropagation();
        this._search = "";
        this.render({ parts: ["main"] });
      }
    });

    // Cards are divs so they can hold nested controls; make them behave like
    // buttons for keyboard users.
    for (const card of root.querySelectorAll(".ndrs-card")) {
      card.addEventListener("keydown", (ev) => {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        ev.preventDefault();
        this._openCardId = card.dataset.cardId ?? null;
        this.render({ parts: ["main"] });
      });
    }

    // Move focus into the dialog so Tab and Escape act on it right away.
    if (this._openCardId) root.querySelector(".ndrs-modal-close")?.focus();
  }

  // ─────────────────────────────────────────────────────────────────────
  // Action handlers (ApplicationV2 delegated actions)
  // ─────────────────────────────────────────────────────────────────────
  static _onSelectTab(event, target) {
    const tabId = target?.dataset?.tab;
    if (!tabId) return;
    this._activeTab = tabId;
    // Picking a tab leaves the cross-tab search view.
    this._search = "";
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
  async gotoTab(tabId) {
    if (!TABS.find(t => t.id === tabId)) return;
    this._activeTab = tabId;
    this._search = "";
    await this.render({ parts: ["main"] });
  }

  async setSearch(query) {
    this._search = String(query || "");
    await this.render({ parts: ["main"] });
  }
}
