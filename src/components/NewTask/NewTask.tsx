import React, { useCallback } from 'react';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import { TaskListMenu } from './TaskListMenu';
import { useMuiMenu, IconButton } from '../Mui';
import { Payload$NewTask } from '../../store';

interface Props {
  newTask(payload?: Payload$NewTask): void;
}

export function NewTask({ newTask }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  const newTaskCallback = useCallback(() => {
    newTask();
  }, [newTask]);

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
