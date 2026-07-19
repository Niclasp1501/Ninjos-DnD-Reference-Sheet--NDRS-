// Custom homebrew calendar — 365-day year:
// 12 months × 30 days (3 ten-day weeks each) + 5 intercalary holidays.
// In leap years (every 4th year), a 6th holiday "Schildtreff" is inserted after midsummer.
//
// Month and holiday names are stored as localizable keys so GMs can name them
// freely for their own settings. Defaults are generic placeholders.

export const CALENDAR = Object.freeze({
  id: "calendar-homebrew",
  source: { book: "Homebrew", page: 0 },
  new2024: false,
  introKey: "NDRS.Calendar.Intro",
  weekNameKey: "NDRS.Calendar.WeekName",
  months: [
    { idx:  1, position: 1,  nameKey: "NDRS.Calendar.Month.M01.Name", subtitleKey: "NDRS.Calendar.Month.M01.Subtitle" },
    { idx:  2, position: 2,  nameKey: "NDRS.Calendar.Month.M02.Name", subtitleKey: "NDRS.Calendar.Month.M02.Subtitle" },
    { idx:  3, position: 3,  nameKey: "NDRS.Calendar.Month.M03.Name", subtitleKey: "NDRS.Calendar.Month.M03.Subtitle" },
    { idx:  4, position: 4,  nameKey: "NDRS.Calendar.Month.M04.Name", subtitleKey: "NDRS.Calendar.Month.M04.Subtitle" },
    { idx:  5, position: 5,  nameKey: "NDRS.Calendar.Month.M05.Name", subtitleKey: "NDRS.Calendar.Month.M05.Subtitle" },
    { idx:  6, position: 6,  nameKey: "NDRS.Calendar.Month.M06.Name", subtitleKey: "NDRS.Calendar.Month.M06.Subtitle" },
    { idx:  7, position: 7,  nameKey: "NDRS.Calendar.Month.M07.Name", subtitleKey: "NDRS.Calendar.Month.M07.Subtitle" },
    { idx:  8, position: 8,  nameKey: "NDRS.Calendar.Month.M08.Name", subtitleKey: "NDRS.Calendar.Month.M08.Subtitle" },
    { idx:  9, position: 9,  nameKey: "NDRS.Calendar.Month.M09.Name", subtitleKey: "NDRS.Calendar.Month.M09.Subtitle" },
    { idx: 10, position: 10, nameKey: "NDRS.Calendar.Month.M10.Name", subtitleKey: "NDRS.Calendar.Month.M10.Subtitle" },
    { idx: 11, position: 11, nameKey: "NDRS.Calendar.Month.M11.Name", subtitleKey: "NDRS.Calendar.Month.M11.Subtitle" },
    { idx: 12, position: 12, nameKey: "NDRS.Calendar.Month.M12.Name", subtitleKey: "NDRS.Calendar.Month.M12.Subtitle" }
  ],
  // Holidays sit between months — afterMonth = id of the month they follow.
  holidays: [
    { id: "H1", afterMonth: 1,  nameKey: "NDRS.Calendar.Holiday.Midwinter",   descKey: "NDRS.Calendar.Holiday.MidwinterDesc" },
    { id: "H2", afterMonth: 4,  nameKey: "NDRS.Calendar.Holiday.Greengrass",  descKey: "NDRS.Calendar.Holiday.GreengrassDesc" },
    { id: "H3", afterMonth: 7,  nameKey: "NDRS.Calendar.Holiday.Midsummer",   descKey: "NDRS.Calendar.Holiday.MidsummerDesc" },
    { id: "H4", afterMonth: 9,  nameKey: "NDRS.Calendar.Holiday.Highharvest", descKey: "NDRS.Calendar.Holiday.HighharvestDesc" },
    { id: "H5", afterMonth: 11, nameKey: "NDRS.Calendar.Holiday.Moonfest",    descKey: "NDRS.Calendar.Holiday.MoonfestDesc" }
  ],
  leap: {
    afterMonth: 7,
    nameKey: "NDRS.Calendar.Holiday.Shieldmeet",
    descKey: "NDRS.Calendar.Holiday.ShieldmeetDesc",
    everyYears: 4
  }
});
