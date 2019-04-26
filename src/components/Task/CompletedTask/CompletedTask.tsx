import React, { useMemo } from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from '../Task';
import { DeleteIcon, IconButton } from '../../Mui';
import { Schema$Task } from '../../../typings';

interface Props extends Omit<TaskProps, 'endAdornment'> {
  deleteTask(task: Schema$Task): void;
}

export function CompletedTask({ task, deleteTask, ...props }: Props) {
  const inputBaseProps = useMemo(
    () => ({ readOnly: true, inputProps: { hideDateBtn: true } }),
    []
  );

  return (
    <Task
      className="completed-task"
      task={task}
      inputBaseProps={inputBaseProps}
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
