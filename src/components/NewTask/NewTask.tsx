import React, { useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import { TaskListMenu } from './TaskListMenu';
import { useMuiMenu } from '../Mui/Menu/useMuiMenu';
import { Payload$Optional$AddTask } from '../../store';

interface Props {
  addTask(payload?: Payload$Optional$AddTask): void;
  setFocusIndex(index: number | null): void;
}

export function NewTask({ addTask, setFocusIndex }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  const addTaskCallback = useCallback(() => {
    addTask();
    setTimeout(() => setFocusIndex(0), 0);
  }, [addTask, setFocusIndex]);

  return (
    <div className="new-task">
      <div className="add-new-task-button" onClick={addTaskCallback}>
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
