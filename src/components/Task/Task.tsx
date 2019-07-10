import React, { useMemo, ReactNode, MouseEvent } from 'react';
import { Input, InputProps } from '../Mui/Input';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput, TaskInputProps } from './TaskInput';
import { Schema$Task } from '../../typings';

export interface TaskProps
  extends InputProps,
    Pick<Schema$Task, 'uuid' | 'title' | 'status'>,
    TaskInputProps {
  className?: string;
  endAdornment?: ReactNode;
  onContextMenu?(evt: MouseEvent<HTMLDivElement>): void;
}

const nil = () => {};

function TaskComponent({
  className = '',
  uuid,
  title,
  status,
  due,
  notes,
  onDueDateBtnClick,
  endAdornment,
  onContextMenu,
  onBlur,
  onFocus,
  ...inputProps
}: TaskProps) {
  const taskInputProps = useMemo<TaskInputProps>(
    () => ({
      due,
      notes,
      onDueDateBtnClick,
      onChange: nil,
      onBlur,
      onFocus
    }),
    [due, notes, onDueDateBtnClick, onBlur, onFocus]
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
        inputProps={taskInputProps}
        endAdornment={
          <div className="task-input-base-end-adornment">{endAdornment}</div>
        }
      />
    </div>
  );
}

export const Task = TaskComponent;
