import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import { TaskListMenu } from './TaskListMenu';

export function NewTask() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <div className="new-task">
      <div className="add-new-task-button">
        <IconButton classes={{ root: 'add-icon-button' }} disableTouchRipple>
          <AddIcon fontSize="small" color="secondary" />
        </IconButton>
        <div>Add a Task</div>
      </div>
      <IconButton onClick={evt => setAnchorEl(evt.currentTarget)}>
        <MoreIcon fontSize="small" />
      </IconButton>
      <TaskListMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
    </div>
  );
}
