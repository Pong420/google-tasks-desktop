/* eslint-disable */
/* tslint:disable:only-arrow-functions */

// Date class extension

// reference :
// http://stackoverflow.com/questions/5495815/javascript-code-for-showing-yesterdays-date-and-todays-date?answertab=votes#tab-top
// http://stackoverflow.com/questions/9192956/getting-previous-date-using-javascript?answertab=votes#tab-top
// http://stackoverflow.com/a/43020185

export const _ = '';

Date.prototype.getDayCn = function() {
  const days_full: DayCn[] = ['日', '一', '二', '三', '四', '五', '六'];
  return days_full[this.getDay()];
};

Date.prototype.addDays = function(n: number) {
  const date = new Date();
  const time = this.getTime();
  const changedDate = new Date(time + n * 24 * 60 * 60 * 1000);
  date.setTime(changedDate.getTime());
  return date;
};

Date.prototype.addMonths = function(n: number) {
  const month = this.getMonth();
  const lastYear = month === 0 && n < 0;
  const nextYear = month === 11 && n > 0;
  if (lastYear) {
    return new Date(this.getFullYear() + n, 11, 1);
  } else if (nextYear) {
    return new Date(this.getFullYear() + n, 0, 1);
  } else {
    return new Date(this.getFullYear(), month + n, 1);
  }
};

// Provide month names
Date.prototype.getMonthName = function() {
  const month_names: MonthFullName[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  return month_names[this.getMonth()];
};

// Provide month abbreviation
Date.prototype.getMonthAbbr = function() {
  const month_abbrs: MonthAbbr[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  return month_abbrs[this.getMonth()];
};

// Provide full day of week name
Date.prototype.getDayFull = function() {
  const days_full: DayFullName[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  return days_full[this.getDay()];
};

// Provide full day of week name
Date.prototype.getDayAbbr = function() {
  const days_abbr: DayAbbr[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thur',
    'Fri',
    'Sat'
  ];
  return days_abbr[this.getDay()];
};

// Provide the day of year 1-365
Date.prototype.getDayOfYear = function() {
  const onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((Number(this) - Number(onejan)) / 86400000);
};

// Provide the day suffix (st,nd,rd,th)
Date.prototype.getDaySuffix = function() {
  const d = this.getDate();
  const sfx: DaySuffix[] = ['th', 'st', 'nd', 'rd'];
  const val = d % 100;
  return sfx[(val - 20) % 10] || sfx[val] || sfx[0];
};

// Provide Week of Year
Date.prototype.getWeekOfYear = function() {
  const onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(
    ((Number(this) - Number(onejan)) / 86400000 + onejan.getDay() + 1) / 7
  );
};

// Provide if it is a leap year or not
Date.prototype.isLeapYear = function() {
  const yr = String(this.getFullYear());
  if (parseInt(yr, 10) % 4 === 0) {
    if (parseInt(yr, 10) % 100 === 0) {
      if (parseInt(yr, 10) % 400 !== 0) {
        return false;
      }
      if (parseInt(yr, 10) % 400 === 0) {
        return true;
      }
    }
    if (parseInt(yr, 10) % 100 !== 0) {
      return true;
    }
  }
  if (parseInt(yr, 10) % 4 !== 0) {
    return false;
  }

  return false;
};

// Provide Number of Days in a given month
Date.prototype.getMonthDayCount = function() {
  const month_day_counts = [
    31,
    this.isLeapYear() ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  return month_day_counts[this.getMonth()];
};

Date.prototype.compare = function(dateObj: Date) {
  const date = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const curMonth = this.getMonth();
  const curDate = this.getDate();
  const sameYear = this.getFullYear() === year;
  const sameMonth = curMonth === month && sameYear;
  const sameDate = curDate === date && sameMonth;
  const lastMonth = curMonth === 1 ? month === 12 : month < curMonth;
  const nextMonth = curMonth === 12 ? month === 1 : month > curMonth;

  return {
    sameYear,
    sameDate,
    sameMonth,
    lastMonth,
    nextMonth
  };
};

Date.prototype.dayDiff = function(d: Date = new Date()) {
  return Math.floor((d.getTime() - this.getTime()) / 1000 / 60 / 60 / 24);
};

Date.prototype.isToday = function() {
  return this.dayDiff(new Date()) === 0;
};

Date.prototype.toISODateString = function() {
  const str = this.toISOString();
  return (
    str.substring(0, str.indexOf('T')) +
    str.substring(str.indexOf('T')).replace(/\d/g, '0')
  );
};

// format provided date into this.format format
Date.prototype.format = function(dateFormat_: string) {
  // break apart format string into array of characters
  const dateFormat = dateFormat_.split('');
  const date = this.getDate();
  const month = this.getMonth();
  const hours = this.getHours();
  const minutes = this.getMinutes();
  const seconds = this.getSeconds();
  // get all date properties ( based on PHP date object functionality )
  const date_props = {
    d: date < 10 ? '0' + date : date,
    D: this.getDayAbbr(),
    j: this.getDate(),
    l: this.getDayFull(),
    S: this.getDaySuffix(),
    w: this.getDay(),
    z: this.getDayOfYear(),
    W: this.getWeekOfYear(),
    F: this.getMonthName(),
    m: month < 9 ? '0' + (month + 1) : month + 1,
    M: this.getMonthAbbr(),
    n: month + 1,
    t: this.getMonthDayCount(),
    L: this.isLeapYear() ? '1' : '0',
    Y: this.getFullYear(),
    y: this.getFullYear() + ''.substring(2, 4),
    a: hours > 12 ? 'pm' : 'am',
    A: hours > 12 ? 'PM' : 'AM',
    g: hours % 12 > 0 ? hours % 12 : 12,
    G: hours > 0 ? hours : '12',
    h: hours % 12 > 0 ? hours % 12 : 12,
    H: hours,
    i: minutes < 10 ? '0' + minutes : minutes,
    s: seconds < 10 ? '0' + seconds : seconds
  };
  // loop through format array of characters and add matching data else add the format character (:,/, etc.)
  let date_string = '';
  for (const f of dateFormat) {
    if (f.match(/[a-zA-Z]/g)) {
      // @ts-ignore
      date_string += date_props[f] ? date_props[f] : '';
    } else {
      date_string += f;
    }
  }
  return date_string;
};
