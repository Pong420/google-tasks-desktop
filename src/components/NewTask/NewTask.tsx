import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import { TaskListMenu } from './TaskListMenu';
import { useMuiMenu, IconButton } from '../Mui';

interface Props {
  newTask(): void;
}

export function NewTask({ newTask }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  return (
    <div className="new-task">
      <div className="new-task-button" onClick={newTask}>
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
