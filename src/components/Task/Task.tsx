import React, { useState, useEffect, ReactNode, MouseEvent } from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput } from './TaskInput';
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
  task: initialTask,
  toggleCompleted,
  endAdornment,
  inputBaseProps,
  onContextMenu
}: TaskProps) {
  const [task, setTask] = useState(initialTask);
  const toggleCompletedCallback = useAdvancedCallback(toggleCompleted, [task]);

  // FIXME:
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

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
        inputComponent={TaskInput}
        inputProps={{
          task,
          ...(inputBaseProps && inputBaseProps.inputProps)
        }}
        {...inputBaseProps}
      />
    </div>
  );
}
