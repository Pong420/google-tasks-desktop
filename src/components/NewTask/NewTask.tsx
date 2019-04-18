import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import { TaskListMenu } from './TaskListMenu';
import { useMuiMenu } from '../Mui/Menu/useMuiMenu';
import { Payload$Optional$AddTask } from '../../store';

interface Props {
  addTask(payload?: Payload$Optional$AddTask): void;
}

export function NewTask({ addTask }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  return (
    <div className="new-task">
      <div className="add-new-task-button" onClick={() => addTask()}>
        <IconButton classes={{ root: 'add-icon-button' }} disableTouchRipple>
          <AddIcon color="secondary" />
        </IconButton>
        <div>Add a task</div>
      </div>
      <IconButton onClick={setAnchorEl}>
        <MoreIcon />
      </IconButton>
      <TaskListMenu anchorEl={anchorEl} onClose={onClose} />
    </div>
  );
}
