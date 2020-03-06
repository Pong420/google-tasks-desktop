import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { IconButton } from '../../../components/Mui';
import { useTaskActions } from '../../../store';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';

const iconProps: SvgIconProps = { color: 'secondary' };

export function NewTask() {
  const { createTask } = useTaskActions();

  return (
    <div className="new-task">
      <div className="new-task-button" onClick={() => createTask()}>
        <IconButton icon={AddIcon} iconProps={iconProps} disableTouchRipple />
        <div>Add a task</div>
      </div>
      <IconButton icon={MoreIcon} />
    </div>
  );
}
