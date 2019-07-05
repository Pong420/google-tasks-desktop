import React, { useCallback, ChangeEvent, useRef, useEffect } from 'react';
import { Input, InputProps } from '../Mui/Input';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

export interface TaskInputProps {
  due?: string;
  notes?: string;
  showDateBttn?: boolean;
  onDueDateBtnClick?(): void;
}

type Props = TaskInputProps & InputProps;

export const TaskInput = ({
  due,
  notes,
  onChange,
  onDueDateBtnClick,
  showDateBttn = false,
  ...inputProps
}: Props) => {
  const timeout = useRef(0);

  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      evt.persist();
      clearTimeout(timeout.current);
      if (onChange) {
        timeout.current = window.setTimeout(() => onChange(evt), 1000);
      }
    },
    [onChange]
  );

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <div className="task-input-content">
      <Input {...inputProps} multiline onChange={onChangeCallback} />
      {notes && <div className="task-notes">{notes}</div>}
      {due && showDateBttn && (
        <div
          className="task-due-date-button"
          onClick={onDueDateBtnClick}
          data-date={dateFormat(new Date(due))}
        >
          <EventAvailableIcon />
        </div>
      )}
    </div>
  );
};

function dateFormat(d: Date) {
  const now = new Date();
  const dayDiff = Math.floor((+now - +d) / 1000 / 60 / 60 / 24);

  if (dayDiff === 0) {
    return 'Today';
  }

  if (dayDiff === -1) {
    return 'Tomorrow';
  }

  if (dayDiff < -1) {
    return d.format('D, j M');
  }

  if (dayDiff === 1) {
    return 'Yesterday';
  }

  if (dayDiff < 7) {
    return `${dayDiff} days ago`;
  }

  return `${Math.floor(dayDiff / 7)} weeks ago`;
}
