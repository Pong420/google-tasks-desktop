import React, { useState, useRef, HTMLAttributes, useCallback } from 'react';
import { DateHelper } from './date';
import { IconButton } from '../../../Mui/IconButton';
import { classes } from '../../../../utils/classes';
import LeftArrowIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
import RightArrowIcon from '@material-ui/icons/KeyboardArrowRightRounded';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface DateProps extends GridProps {
  selected?: boolean;
}

const Grid = ({ children, className, ...props }: GridProps) => (
  <div className={`grid ${className}`.trim()} {...props}>
    <div className="grid-content">{children}</div>
  </div>
);

const Date = ({ selected, className, ...props }: DateProps) => (
  <Grid
    className={classes('date', className, selected && 'selected')}
    {...props}
  />
);

export function DatePicker() {
  const [{ dates, data }, setData] = useState(getDisplayData());
  const today = useRef(data);
  const [selected, setSelected] = useState<DateHelper | null>(
    dates[today.current.index]
  );

  const getClassName = useCallback(
    (dateObj: DateHelper) => {
      const date = dateObj.getDate();
      const month = dateObj.getMonth();
      const year = dateObj.getFullYear();
      const sameYear = today.current.val.getFullYear() === year;
      const sameMonth = today.current.month === month && sameYear;
      // const sameWeek =
      //   week[today.current.index] === week[data.index] && sameMonth;
      const sameDate = today.current.date === date && sameMonth;
      const cMonth = data.month;
      const lastMonth = cMonth === 1 ? month === 12 : month < cMonth;
      const nextMonth = cMonth === 12 ? month === 1 : month > cMonth;

      return classes({
        // sameYear,
        // sameDate,
        // sameWeek,
        sameMonth,
        lastMonth,
        nextMonth,
        today: !!sameDate
      });
    },
    [data.month]
  );

  const switchMonth = useCallback(
    (step: number) => {
      setData(getDisplayData(data.val.addMonths(step)));
    },
    [data.val]
  );

  const prevMonth = useCallback(() => switchMonth(-1), [switchMonth]);
  const nextMonth = useCallback(() => switchMonth(1), [switchMonth]);

  return (
    <div className="date-picker">
      <div className="calender">
        <div className="calender-header">
          <IconButton icon={LeftArrowIcon} onClick={prevMonth} />
          <div className="month-year">
            {data.val.getMonthName()} {data.val.getFullYear()}
          </div>
          <IconButton icon={RightArrowIcon} onClick={nextMonth} />
        </div>
        <div className="calendar-content">
          {days.map((day, index) => (
            <Grid className="day" key={index}>
              {day}
            </Grid>
          ))}
          {dates.map((date, index) => (
            <Date
              key={index}
              className={getClassName(date)}
              selected={selected === date}
              onClick={() => setSelected(date)}
            >
              {date.getDate()}
            </Date>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDisplayData(dateObj: DateHelper = new DateHelper()) {
  const temp = dateObj;
  const cDate = temp.getDate(); // current date
  const one = temp.addDays(-1 * cDate + 1); // first day of current month
  const index = one.getDay() - 1;
  const MonthDayCount = one.getMonthDayCount();
  let dates = [];
  const thisMonth = [];
  const lastMonth = [];
  const nextMonth = [];

  for (let a = 0; a < MonthDayCount; a++) {
    thisMonth.push(one.addDays(a));
  }

  for (let b = 0; b < index; b++) {
    lastMonth.push(one.addDays((b + 1) * -1));
  }

  dates = lastMonth.reverse().concat(thisMonth);

  const length = dates.length;
  let max = 35;

  if (length > 35) {
    max = 42;
  }

  for (let c = length; c < max; c++) {
    nextMonth.push(thisMonth[thisMonth.length - 1].addDays(c - length + 1));
  }

  dates = dates.concat(nextMonth);

  const cIndex = lastMonth.length + cDate - 1;
  const wIndex = cIndex - temp.getDay() + 1; // index of this week first day in days

  return {
    dates,
    week: dates.slice(wIndex, wIndex + 7),
    data: {
      val: temp,
      index: cIndex,
      date: cDate,
      month: temp.getMonth(),
      hour: temp.getHours()
    }
  };
}
