import React, { useMemo, ReactNode, MouseEvent } from 'react';
import { Input, InputProps } from '../Mui/Input';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput, TaskInputProps } from './TaskInput';
import { Schema$Task } from '../../typings';

export interface TaskProps
  extends InputProps,
    Pick<Schema$Task, 'uuid' | 'title' | 'status' | 'due' | 'notes'> {
  className?: string;
  endAdornment?: ReactNode;
  onContextMenu?(evt: MouseEvent<HTMLDivElement>): void;
  taskInputProps?: TaskInputProps;
}

function TaskComponent({
  className = '',
  uuid,
  title,
  status,
  due,
  notes,
  endAdornment,
  onContextMenu,
  taskInputProps,
  ...inputProps
}: TaskProps) {
  const mergedTaskInputProps = useMemo<TaskProps['taskInputProps']>(
    () => ({
      due,
      notes,
      ...(taskInputProps && taskInputProps)
    }),
    [due, notes, taskInputProps]
  );

  return (
    <div className={`task ${className}`.trim()} onContextMenu={onContextMenu}>
      <ToggleCompleted
        uuid={uuid}
        isEmpty={!(title || '').trim()}
        completed={status === 'completed'}
      />
      <Input
        {...inputProps}
        fullWidth
        className="task-input-base"
        defaultValue={title}
        inputComponent={TaskInput}
        inputProps={mergedTaskInputProps}
        endAdornment={
          <div className="task-input-base-end-adornment">{endAdornment}</div>
        }
      />
    </div>
  );
}

export const Task = TaskComponent;
