import React, { ReactNode, MouseEvent } from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { ToggleCompleted } from './ToggleCompleted';
import { useAdvancedCallback } from '../../utils/useAdvancedCallback';
import { Schema$Task } from '../../typings';
import { classes } from '../../utils/classes';

export interface TaskProps {
  className?: string;
  task: Schema$Task;
  toggleCompleted(task: Schema$Task): void;
  endAdornment: ReactNode;
  inputBaseProps?: InputBaseProps;
  onContextMenu?(evt: MouseEvent<HTMLDivElement>): any;
}

export function Task({
  className = '',
  task,
  toggleCompleted,
  endAdornment,
  inputBaseProps,
  onContextMenu
}: TaskProps) {
  const toggleCompletedCallback = useAdvancedCallback(toggleCompleted, [task]);

  return (
    <div className={classes(`task`, className)} onContextMenu={onContextMenu}>
      <ToggleCompleted
        onClick={toggleCompletedCallback}
        completed={task.status === 'completed'}
      />
      <InputBase
        fullWidth
        className="task-input-base"
        value={task.title}
        endAdornment={endAdornment}
        {...inputBaseProps}
        inputProps={{
          task,
          ...(inputBaseProps && inputBaseProps.inputProps)
        }}
      />
    </div>
  );
}
