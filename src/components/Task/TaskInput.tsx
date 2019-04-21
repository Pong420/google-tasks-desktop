import React from 'react';
import { Input } from '../Mui/Input';
import { InputBaseComponentProps } from '@material-ui/core/InputBase';
import { Schema$Task } from '../../typings';

interface Props extends InputBaseComponentProps {
  task?: Schema$Task;
}

export function TaskInput({ inputRef, task, ...inputProps }: Props) {
  const { notes } = task!;

  return (
    <div className="task-input-content">
      <Input multiline inputProps={inputProps} inputRef={inputRef} />
      {notes && <div className="task-notes">{notes}</div>}
    </div>
  );
}
