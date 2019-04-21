import React, { useState, useEffect, ReactNode } from 'react';
import { InputBaseProps } from '@material-ui/core/InputBase';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskContextMenu } from './TaskContextMenu';
import { useMuiMenu, Input } from '../Mui';
import { useAdvancedCallback } from '../../utils/useAdvancedCallback';
import { Schema$Task } from '../../typings';
import { classes } from '../../utils/classes';

export interface TaskProps {
  className?: string;
  task: Schema$Task;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
  endAdornment: ReactNode;
  inputBaseProps?: InputBaseProps;
}

export function Task({
  className = '',
  task: initialTask,
  deleteTask,
  toggleCompleted,
  endAdornment,
  inputBaseProps
}: TaskProps) {
  const [task, setTask] = useState(initialTask);
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();
  const deleteTaskCallback = useAdvancedCallback(deleteTask, [task]);
  const toggleCompletedCallback = useAdvancedCallback(toggleCompleted, [task]);

  // FIXME:
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <div
      className={classes(`task`, className)}
      onContextMenu={setAnchorPosition}
    >
      <ToggleCompleted
        onClick={toggleCompletedCallback}
        completed={task.status === 'completed'}
      />
      <Input
        fullWidth
        defaultValue={task.title}
        endAdornment={endAdornment}
        {...inputBaseProps}
      />
      <TaskContextMenu
        onClose={onClose}
        onDelete={deleteTaskCallback}
        anchorPosition={anchorPosition}
      />
    </div>
  );
}
