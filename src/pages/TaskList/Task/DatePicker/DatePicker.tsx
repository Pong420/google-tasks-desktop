import React, { useState, useCallback, HTMLAttributes, useMemo } from 'react';
import { IconButton } from '../../../../components/Mui/IconButton';
import LeftArrowIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
import RightArrowIcon from '@material-ui/icons/KeyboardArrowRightRounded';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type GridProps = HTMLAttributes<HTMLDivElement>;

interface DateProps extends Omit<GridProps, 'onClick'> {
  date: Date;
  selected?: boolean;
  onClick(d: Date): void;
}

interface Props {
  value?: Date;
  onChange?(date: Date): void;
}

const Grid = React.memo(({ children, className, ...props }: GridProps) => (
  <div className={`grid ${className}`.trim()} {...props}>
    <div className="grid-content">{children}</div>
  </div>
));

const DateGrid = React.memo(
  ({ date, onClick, selected, className, ...props }: DateProps) => {
    const onClickCallback = useCallback(() => {
      onClick(date);
    }, [date, onClick]);

    return (
      <Grid
        className={['date', className, selected && 'selected']
          .filter(Boolean)
          .join(' ')
          .trim()}
        onClick={onClickCallback}
        {...props}
      />
    );
  }
);

export function DatePicker({ value, onChange }: Props) {
  const [{ dates, date }, setDisplay] = useState(getDisplayData(value));
  const [currDate, setCurrDate] = useState<Date>(date);

  const [prevMonth, nextMonth] = useMemo(() => {
    const handler = (step: number) => () =>
      setDisplay(({ date }) => getDisplayData(date.addMonths(step)));
    return [handler(-1), handler(1)];
  }, []);

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
          {dates.map((d, index) => (
            <DateGrid
              key={index}
              date={d}
              selected={currDate.compare(d).sameDate}
              className={[
                ...Object.entries(date.compare(d)).reduce(
                  (c, [n, v]) => [...c, v && n],
                  [] as Array<string | boolean>
                ),
                d.isToday() && 'today'
              ]
                .filter(Boolean)
                .join(' ')
                .trim()}
              onClick={(d: Date) => {
                setCurrDate(d);
                onChange && onChange(d);
              }}
            >
              {d.getDate()}
            </DateGrid>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDisplayData(dateObj: Date = new Date()) {
  const currDate = dateObj.getDate(); // current date
  const one = dateObj.addDays(-1 * currDate + 1); // first day of current month
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

  const cIndex = lastMonth.length + currDate - 1;
  const wIndex = cIndex - dateObj.getDay() + 1; // index of this week first day in days

  return {
    dates,
    week: dates.slice(wIndex, wIndex + 7),
    date: dateObj
  };
}
