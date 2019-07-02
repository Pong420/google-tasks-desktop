import React, { useState, useCallback, HTMLAttributes } from 'react';
import { IconButton } from '../../../Mui/IconButton';
import { classes } from '../../../../utils/classes';
import LeftArrowIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
import RightArrowIcon from '@material-ui/icons/KeyboardArrowRightRounded';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type GridProps = HTMLAttributes<HTMLDivElement>;

interface DateProps extends GridProps {
  selected?: boolean;
}

interface Props {
  value?: Date;
  onChange?(date: Date): void;
}

const Grid = ({ children, className, ...props }: GridProps) => (
  <div className={`grid ${className}`.trim()} {...props}>
    <div className="grid-content">{children}</div>
  </div>
);

const DateGrid = ({ selected, className, ...props }: DateProps) => (
  <Grid
    className={classes('date', className, selected && 'selected')}
    {...props}
  />
);

export function DatePicker({ value, onChange }: Props) {
  const [{ dates, date }, setData] = useState(getDisplayData(value));
  const [curValue, setCurValue] = useState<Date>(value ? value : date);

  const getClassName = useCallback(
    (dateObj: Date) =>
      classes({
        ...date.compare(dateObj),
        today: dateObj.isToday()
      }),
    [date]
  );

  const switchMonth = useCallback(
    (step: number) => {
      setData(getDisplayData(date.addMonths(step)));
    },
    [date]
  );

  const prevMonth = useCallback(() => switchMonth(-1), [switchMonth]);
  const nextMonth = useCallback(() => switchMonth(1), [switchMonth]);

  const onDateClick = useCallback(() => {
    setCurValue(date);
    onChange && onChange(date);
  }, [onChange, date]);

  return (
    <div className="date-picker">
      <div className="calender">
        <div className="calender-header">
          <IconButton icon={LeftArrowIcon} onClick={prevMonth} />
          <div className="month-year">
            {date.getMonthName()} {date.getFullYear()}
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
            <DateGrid
              key={index}
              className={getClassName(date)}
              selected={curValue.compare(date).sameDate}
              onClick={onDateClick}
            >
              {date.getDate()}
            </DateGrid>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDisplayData(dateObj: Date = new Date()) {
  const curDate = dateObj.getDate(); // current date
  const one = dateObj.addDays(-1 * curDate + 1); // first day of current month
  const index = one.getDay() - 1;
  const MonthDayCount = one.getMonthDayCount();
  const curMonth = [];
  const lastMonth = [];
  const nextMonth = [];
  let dates = [];

  for (let a = 0; a < MonthDayCount; a++) {
    curMonth.push(one.addDays(a));
  }

  for (let b = 0; b < index; b++) {
    lastMonth.push(one.addDays((b + 1) * -1));
  }

  dates = lastMonth.reverse().concat(curMonth);

  const length = dates.length;

  for (let c = length; c < 42; c++) {
    nextMonth.push(curMonth[curMonth.length - 1].addDays(c - length + 1));
  }

  dates = dates.concat(nextMonth);

  const cIndex = lastMonth.length + curDate - 1;
  const wIndex = cIndex - dateObj.getDay() + 1; // index of this week first day in days

  return {
    dates,
    week: dates.slice(wIndex, wIndex + 7),
    date: dateObj
  };
}
