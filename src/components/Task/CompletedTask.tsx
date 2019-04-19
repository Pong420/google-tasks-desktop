import React from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from './Task';
import { DeleteIcon, IconButton } from '../Mui';

interface Props extends Omit<TaskProps, 'endAdornment'> {}

export function CompletedTask({ task, ...props }: Props) {
  return (
    <Task
      className="completed-task"
      task={task}
      inputProps={{
        readOnly: true
      }}
      endAdornment={
        <IconButton
          tooltip="Delete"
          icon={DeleteIcon}
          onClick={() => props.deleteTask(task)}
        />
      }
      {...props}
    />
  );
}
