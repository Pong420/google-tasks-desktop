import React from 'react';
import { Input } from '../../Mui/Input';
import { InputBaseComponentProps } from '@material-ui/core/InputBase';

interface Props extends InputBaseComponentProps {
  notes?: string;
}

export function TodoTaskInput({ inputRef, notes, ...inputProps }: Props) {
  return (
    <div className="task-input-content">
      <Input multiline inputProps={inputProps} inputRef={inputRef} />
      {notes && <div className="task-notes">{notes}</div>}
    </div>
  );
}
