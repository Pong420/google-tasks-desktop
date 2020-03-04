import React from 'react';
import { Input, InputProps } from '../../../components/Mui';
import { Schema$Task } from '../../../typings';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

export interface TaskInputProps extends Pick<Schema$Task, 'due' | 'notes'> {
  onDueDateBtnClick?(): void;
}

type Props = TaskInputProps & InputProps;

export function TaskInput({
  due,
  notes,
  onDueDateBtnClick,
  ...inputProps
}: Props) {
  return (
    <div className="task-input-content">
      <Input {...inputProps} multiline />
      {notes && <div className="task-notes">{notes}</div>}
      {due && (
        <div
          className="task-due-date-button"
          onClick={onDueDateBtnClick}
          // data-date={dateFormat(new Date(due))}
        >
          <EventAvailableIcon />
        </div>
      )}
    </div>
  );
}
