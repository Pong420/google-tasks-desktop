import React from 'react';
import { useSelector } from 'react-redux';
import { Task, TaskProps } from './Task';
import { DeleteIcon, IconButton } from '../../../components/Mui';
import { useTaskActions, completedTaskSelector } from '../../../store';

interface Props extends TaskProps {}

export function CompletedTask(props: Props) {
  const { deleteTask } = useTaskActions();
  const { title } = useSelector(completedTaskSelector(props.uuid)) || {};

  return (
    <Task
      {...props}
      readOnly
      className="completed-task"
      value={title}
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
