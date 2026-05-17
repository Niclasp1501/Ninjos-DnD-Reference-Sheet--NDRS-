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
    { idx:  1, position: 1,  nameKey: "NDRS.Calendar.Month.M01" },
    { idx:  2, position: 2,  nameKey: "NDRS.Calendar.Month.M02" },
    { idx:  3, position: 3,  nameKey: "NDRS.Calendar.Month.M03" },
    { idx:  4, position: 4,  nameKey: "NDRS.Calendar.Month.M04" },
    { idx:  5, position: 5,  nameKey: "NDRS.Calendar.Month.M05" },
    { idx:  6, position: 6,  nameKey: "NDRS.Calendar.Month.M06" },
    { idx:  7, position: 7,  nameKey: "NDRS.Calendar.Month.M07" },
    { idx:  8, position: 8,  nameKey: "NDRS.Calendar.Month.M08" },
    { idx:  9, position: 9,  nameKey: "NDRS.Calendar.Month.M09" },
    { idx: 10, position: 10, nameKey: "NDRS.Calendar.Month.M10" },
    { idx: 11, position: 11, nameKey: "NDRS.Calendar.Month.M11" },
    { idx: 12, position: 12, nameKey: "NDRS.Calendar.Month.M12" }
  ],
  // Holidays sit *between* months — afterMonth = id of the month they follow.
  // afterMonth = 0 means the holiday is the New-Year day before month 1.
  holidays: [
    { id: "H1", afterMonth: 0,  nameKey: "NDRS.Calendar.Holiday.NewYear",   descKey: "NDRS.Calendar.Holiday.NewYearDesc" },
    { id: "H2", afterMonth: 3,  nameKey: "NDRS.Calendar.Holiday.Spring",    descKey: "NDRS.Calendar.Holiday.SpringDesc" },
    { id: "H3", afterMonth: 6,  nameKey: "NDRS.Calendar.Holiday.Midsummer", descKey: "NDRS.Calendar.Holiday.MidsummerDesc" },
    { id: "H4", afterMonth: 9,  nameKey: "NDRS.Calendar.Holiday.Harvest",   descKey: "NDRS.Calendar.Holiday.HarvestDesc" },
    { id: "H5", afterMonth: 12, nameKey: "NDRS.Calendar.Holiday.Winter",    descKey: "NDRS.Calendar.Holiday.WinterDesc" }
  ],
  leap: {
    afterMonth: 6,
    nameKey: "NDRS.Calendar.Holiday.Leap",
    descKey: "NDRS.Calendar.Holiday.LeapDesc",
    everyYears: 4
  }
});
