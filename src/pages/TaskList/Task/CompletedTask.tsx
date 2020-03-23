import React from 'react';
import { useSelector } from 'react-redux';
import { DeleteIcon, IconButton } from '../../../components/Mui';
import { Task, TaskProps } from './Task';
import { useTaskActions, taskSelector } from '../../../store';

interface Props extends TaskProps {}

export function CompletedTask(props: Props) {
  const { deleteTask } = useTaskActions();
  const { title } = useSelector(taskSelector(props.uuid)) || {};

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
