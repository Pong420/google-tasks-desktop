import React from 'react';
import { Input } from '../Mui/Input';
import { InputBaseComponentProps } from '@material-ui/core/InputBase';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

export interface TaskInputProps extends InputBaseComponentProps {
  due?: string;
  notes?: string;
  hideDateBtn?: boolean;
  onDueDateBtnClick?(): void;
}

export const TaskInput = ({
  notes,
  due,
  inputRef,
  hideDateBtn,
  onDueDateBtnClick,
  ...inputProps
}: TaskInputProps) => {
  return (
    <div className="task-input-content">
      <Input multiline inputProps={inputProps} inputRef={inputRef} />
      {notes && <div className="task-notes">{notes}</div>}
      {due && !hideDateBtn && (
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
