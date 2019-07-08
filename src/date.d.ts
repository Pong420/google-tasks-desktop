type DayCn = '日' | '一' | '二' | '三' | '四' | '五' | '六';
type MonthFullName =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

type MonthAbbr =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';

type DayFullName =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

type DayAbbr = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thur' | 'Fri' | 'Sat';

type DaySuffix = 'th' | 'st' | 'nd' | 'rd';

interface Date {
  getDayCn(): DayCn;

  addDays: (n: number) => Date;

  addMonths: (n: number) => Date;

  getMonthName(): MonthFullName;

  getMonthAbbr(): MonthAbbr;

  getDayFull(): DayFullName;

  getDayAbbr(): DayAbbr;

  getDayOfYear(): number;

  getDaySuffix(): DaySuffix;

  getWeekOfYear(): number;

  isLeapYear(): boolean;

  getMonthDayCount(): number;

  compare(
    d: Date
  ): {
    sameYear: boolean;
    sameDate: boolean;
    sameMonth: boolean;
    lastMonth: boolean;
    nextMonth: boolean;
  };

  isToday(): boolean;

  dayDiff(d?: Date): number;

  toISODateString(): string;

  format(dateFormat: string): string;
}
