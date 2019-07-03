import React, { ReactNode, MouseEvent, useMemo } from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput, TaskInputProps } from './TaskInput';
import { Schema$Task } from '../../typings';
import { classes } from '../../utils/classes';

export interface TaskProps {
  className?: string;
  task: Schema$Task;
  endAdornment: ReactNode;
  inputBaseProps?: InputBaseProps;
  onContextMenu?(evt: MouseEvent<HTMLDivElement>): void;
}

export const Task = ({
  className = '',
  task,
  endAdornment,
  inputBaseProps,
  onContextMenu
}: TaskProps) => {
  const mergedInputProps = useMemo<TaskInputProps>(
    () => ({
      due: task.due,
      notes: task.notes,
      ...(inputBaseProps && inputBaseProps.inputProps)
    }),
    [inputBaseProps, task.due, task.notes]
  );

  return (
    <div className={classes(`task`, className)} onContextMenu={onContextMenu}>
      <ToggleCompleted
        uuid={task.uuid}
        isEmpty={!(task.title || '').trim()}
        completed={task.status === 'completed'}
      />
      <InputBase
        fullWidth
        className="task-input-base"
        value={task.title}
        endAdornment={
          <div className="task-input-base-end-adornment">{endAdornment}</div>
        }
        {...inputBaseProps}
        inputComponent={TaskInput}
        inputProps={mergedInputProps}
      />
    </div>
  );
};
