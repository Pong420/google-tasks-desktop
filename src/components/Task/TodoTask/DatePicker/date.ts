// Date class extension

// reference :
// http://stackoverflow.com/questions/5495815/javascript-code-for-showing-yesterdays-date-and-todays-date?answertab=votes#tab-top
// http://stackoverflow.com/questions/9192956/getting-previous-date-using-javascript?answertab=votes#tab-top
// http://stackoverflow.com/a/43020185

export class DateHelper extends Date {
  getDayCn() {
    const days_full = ['日', '一', '二', '三', '四', '五', '六'];
    return days_full[this.getDay()];
  }

  addDays(n: number) {
    const date = new DateHelper();
    const time = this.getTime();
    const changedDate = new DateHelper(time + n * 24 * 60 * 60 * 1000);
    date.setTime(changedDate.getTime());

    return date;
  }

  addMonths(n: number) {
    const month = this.getMonth();
    const lastYear = month === 0 && n < 0;
    const nextYear = month === 11 && n > 0;

    if (lastYear) {
      return new DateHelper(this.getFullYear() + n, 11, 1);
    } else if (nextYear) {
      return new DateHelper(this.getFullYear() + n, 0, 1);
    } else {
      return new DateHelper(this.getFullYear(), month + n, 1);
    }
  }

  // Provide month names
  getMonthName() {
    const month_names = [
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
  }

  // Provide month abbreviation
  getMonthAbbr() {
    const month_abbrs = [
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
  }

  // Provide full day of week name
  getDayFull() {
    const days_full = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    return days_full[this.getDay()];
  }

  // Provide full day of week name
  getDayAbbr() {
    const days_abbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    return days_abbr[this.getDay()];
  }

  // Provide the day of year 1-365
  getDayOfYear() {
    const onejan = new DateHelper(this.getFullYear(), 0, 1);
    return Math.ceil((Number(this) - Number(onejan)) / 86400000);
  }

  // Provide the day suffix (st,nd,rd,th)
  getDaySuffix() {
    const d = this.getDate();
    const sfx = ['th', 'st', 'nd', 'rd'];
    const val = d % 100;

    return sfx[(val - 20) % 10] || sfx[val] || sfx[0];
  }

  // Provide Week of Year
  getWeekOfYear() {
    const onejan = new DateHelper(this.getFullYear(), 0, 1);
    return Math.ceil(
      ((Number(this) - Number(onejan)) / 86400000 + onejan.getDay() + 1) / 7
    );
  }

  // Provide if it is a leap year or not
  isLeapYear() {
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
  }

  // Provide Number of Days in a given month
  getMonthDayCount() {
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
  }

  // format provided date into this.format format
  format(dateFormat_: string) {
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
      D: this.getDayCn(),
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
      // W: this.getDayCn(),
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
  }
}
