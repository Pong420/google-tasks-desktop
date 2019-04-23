import React from 'react';
import { Input } from '../Mui/Input';
import { InputBaseComponentProps } from '@material-ui/core/InputBase';
import { Schema$Task } from '../../typings';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

interface Props extends InputBaseComponentProps {
  task?: Schema$Task;
  onDueDateBtnClick?(): void;
}

export function TaskInput({
  inputRef,
  task,
  onDueDateBtnClick = () => {},
  ...inputProps
}: Props) {
  const { notes, due, status } = task!;

  return (
    <div className="task-input-content">
      <Input multiline inputProps={inputProps} inputRef={inputRef} />
      {notes && <div className="task-notes">{notes}</div>}
      {status === 'needsAction' && due && (
        <div className="task-due-date-button" onClick={onDueDateBtnClick}>
          <EventAvailableIcon />
          {dateFormat(new Date(due))}
        </div>
      )}
    </div>
  );
}

function dateFormat(d: Date) {
  // TODO:
  // today, tomorrow

  const s = d.toString().split(' ');
  return (
    s[0] +
    ', ' +
    s
      .slice(1, 3)
      .reverse()
      .join(' ')
  );
}
