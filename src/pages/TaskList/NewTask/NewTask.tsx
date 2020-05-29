import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { IconButton, useMuiMenu } from '../../../components/Mui';
import { TaskListMenu } from '../TaskListMenu';
import { useTaskActions } from '../../../store';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';

const iconProps: SvgIconProps = { color: 'secondary' };

export function NewTask() {
  const { createTask } = useTaskActions();
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  return (
    <div className="new-task">
      <div className="new-task-button" onClick={() => createTask()}>
        <IconButton icon={AddIcon} iconProps={iconProps} disableTouchRipple />
        <div>Add a task</div>
      </div>
      <IconButton icon={MoreIcon} onClick={setAnchorEl} />
      <TaskListMenu open={!!anchorEl} anchorEl={anchorEl} onClose={onClose} />
    </div>
  );
}
