import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useRxInput } from 'use-rx-hooks';
import { Input, InputProps } from '../Mui';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput } from './TaskInput';
import { taskSelector } from '../../store';

export interface TaskProps {
  className?: string;
  uuid: string;
  endAdornment?: ReactNode;
}

export function Task({
  className,
  uuid,
  endAdornment,
  ...inputProps
}: TaskProps) {
  const { title, due, notes } = useSelector(taskSelector(uuid)) || {};
  const [value, inputHandler] = useRxInput({
    defaultValue: title || ''
  });

  return (
    <div
      className={['task', className]
        .filter(Boolean)
        .join(' ')
        .trim()}
    >
      <ToggleCompleted isEmpty={!!value.trim()} uuid={uuid} />
      <Input
        {...inputProps}
        {...inputHandler}
        className="task-input-base"
        fullWidth
        value={value}
        inputProps={{ due, notes }}
        inputComponent={TaskInput as InputProps['inputComponent']}
        endAdornment={
          <div className="task-input-base-end-adornment">{endAdornment}</div>
        }
      />
    </div>
  );
}
