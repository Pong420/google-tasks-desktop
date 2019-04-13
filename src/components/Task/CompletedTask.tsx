import React from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from './Task';
import { DeleteIcon } from '../Mui/DeleteIcon';
import IconButton from '@material-ui/core/IconButton';

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
        <IconButton onClick={() => props.deleteTask(task)}>
          <DeleteIcon />
        </IconButton>
      }
      {...props}
    />
  );
}
