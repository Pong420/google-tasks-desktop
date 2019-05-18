import React, { ReactNode, MouseEvent, useMemo } from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput } from './TaskInput';
import { Schema$Task } from '../../typings';
import { classes } from '../../utils/classes';

export interface TaskProps {
  className?: string;
  task: Schema$Task;
  endAdornment: ReactNode;
  inputBaseProps?: InputBaseProps;
  onContextMenu?(evt: MouseEvent<HTMLDivElement>): any;
}

export function Task({
  className = '',
  task,
  endAdornment,
  inputBaseProps,
  onContextMenu
}: TaskProps) {
  const mergedInputProps = useMemo(
    () => ({
      task,
      ...(inputBaseProps && inputBaseProps.inputProps)
    }),
    [inputBaseProps, task]
  );

  return (
    <div className={classes(`task`, className)} onContextMenu={onContextMenu}>
      <ToggleCompleted task={task} completed={task.status === 'completed'} />
      <InputBase
        fullWidth
        className="task-input-base"
        value={task.title}
        endAdornment={endAdornment}
        {...inputBaseProps}
        inputComponent={TaskInput}
        inputProps={mergedInputProps}
      />
    </div>
  );
}
