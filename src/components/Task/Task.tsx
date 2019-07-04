import React, { ReactNode, MouseEvent, useMemo } from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput, TaskInputProps } from './TaskInput';
import { Schema$Task } from '../../typings';
import { classes } from '../../utils/classes';

export interface TaskProps extends InputBaseProps {
  className?: string;
  task: Schema$Task;
  endAdornment: ReactNode;
  onContextMenu?(evt: MouseEvent<HTMLDivElement>): void;
  inputProps?: TaskInputProps;
}

export const Task = ({
  className = '',
  task,
  endAdornment,
  onContextMenu,
  inputProps,
  ...inputBaseProps
}: TaskProps) => {
  const mergedInputProps = useMemo<TaskProps['inputProps']>(
    () => ({
      due: task.due,
      notes: task.notes,
      ...(inputProps && inputProps)
    }),
    [task.due, task.notes, inputProps]
  );

  return (
    <div className={classes(`task`, className)} onContextMenu={onContextMenu}>
      <ToggleCompleted
        uuid={task.uuid}
        isEmpty={!(task.title || '').trim()}
        completed={task.status === 'completed'}
      />
      <InputBase
        {...inputBaseProps}
        fullWidth
        className="task-input-base"
        defaultValue={task.title}
        inputComponent={TaskInput}
        inputProps={mergedInputProps}
        endAdornment={
          <div className="task-input-base-end-adornment">{endAdornment}</div>
        }
      />
    </div>
  );
};
