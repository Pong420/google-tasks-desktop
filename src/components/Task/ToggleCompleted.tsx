import React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '../Mui';
import { useTaskActions, taskSelector } from '../../store';
import { Schema$Task } from '../../typings';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

interface Props extends Pick<Schema$Task, 'uuid'> {
  isEmpty: boolean;
}

const MarkCompleteButton = React.memo(() => (
  <IconButton tooltip="Mark complete">
    <CircleIcon />
  </IconButton>
));

const MarkInCompleteButton = React.memo(() => (
  <IconButton tooltip="Mark incomplete">
    <TickIcon className="mui-tick-icon" />
  </IconButton>
));

export function ToggleCompleted({ uuid, isEmpty }: Props) {
  const { updateTask, deleteTask } = useTaskActions();
  const { completed } = useSelector(taskSelector(uuid)) || {};

  return (
    <div
      className="toggle-completed"
      onClick={() =>
        isEmpty
          ? deleteTask({ uuid })
          : updateTask({
              uuid,
              completed: completed === 'completed' ? 'needsAction' : 'completed'
            })
      }
    >
      {!completed && <MarkCompleteButton />}
      <MarkInCompleteButton />
    </div>
  );
}
