import React from 'react';
import { DeleteIcon, IconButton } from '../Mui';
import { Task, TaskProps } from './Task';
import { useTaskActions } from '../../store';

interface Props extends TaskProps {}

export function CompletedTask(props: Props) {
  const { deleteTask } = useTaskActions();
  return (
    <Task
      {...props}
      readOnly
      className="completed-task"
      endAdornment={
        <IconButton
          tooltip="Delete"
          icon={DeleteIcon}
          onClick={() => deleteTask({ uuid: props.uuid })}
        />
      }
    />
  );
}
