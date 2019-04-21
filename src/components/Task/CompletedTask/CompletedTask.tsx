import React from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from '..';
import { DeleteIcon, IconButton } from '../../Mui';
import { Schema$Task } from '../../../typings';

interface Props extends Omit<TaskProps, 'endAdornment'> {
  deleteTask(task: Schema$Task): void;
}

export function CompletedTask({ task, deleteTask, ...props }: Props) {
  return (
    <Task
      className="completed-task"
      task={task}
      inputBaseProps={{ readOnly: true }}
      endAdornment={
        <IconButton
          tooltip="Delete"
          icon={DeleteIcon}
          onClick={() => deleteTask(task)}
        />
      }
      {...props}
    />
  );
}
