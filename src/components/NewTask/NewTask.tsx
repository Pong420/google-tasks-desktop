import React, { useCallback } from 'react';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import { TaskListMenu } from './TaskListMenu';
import { useMuiMenu, IconButton } from '../Mui';
import { Payload$Optional$NewTask } from '../../store';

interface Props {
  newTask(payload?: Payload$Optional$NewTask): void;
  setFocusIndex(index: number | null): void;
}

export function NewTask({ newTask, setFocusIndex }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  const newTaskCallback = useCallback(() => {
    newTask();
    setTimeout(() => setFocusIndex(0), 0);
  }, [newTask, setFocusIndex]);

  return (
    <div className="new-task">
      <div className="new-task-button" onClick={newTaskCallback}>
        <IconButton
          icon={AddIcon}
          iconProps={{ color: 'secondary' }}
          disableTouchRipple
        />
        <div>Add a task</div>
      </div>
      <IconButton icon={MoreIcon} onClick={setAnchorEl} />
      <TaskListMenu anchorEl={anchorEl} onClose={onClose} />
    </div>
  );
}
