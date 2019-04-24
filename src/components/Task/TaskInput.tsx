import React, { ReactNode } from 'react';
import { Input } from '../Mui/Input';
import { InputBaseComponentProps } from '@material-ui/core/InputBase';
import { Schema$Task } from '../../typings';

export interface TaskInputProps extends InputBaseComponentProps {
  task?: Schema$Task;
  children?: ReactNode;
}

export function TaskInput({
  children,
  inputRef,
  task,
  onDueDateBtnClick = () => {},
  ...inputProps
}: TaskInputProps) {
  const { notes, due, status } = task!;

  return (
    <div className="task-input-content">
      <Input multiline inputProps={inputProps} inputRef={inputRef} />
      {notes && <div className="task-notes">{notes}</div>}
      {children}
    </div>
  );
}
