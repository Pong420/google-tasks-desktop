import React, { useCallback } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { TaskListMenu } from './TaskListMenu';
import { useMuiMenu, IconButton } from '../Mui';
import { Payload$NewTask } from '../../store';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';

interface Props {
  newTask(payload?: Payload$NewTask): void;
}

const iconProps: SvgIconProps = { color: 'secondary' };

export function NewTask({ newTask }: Props) {
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();

  const newTaskCallback = useCallback(() => {
    newTask();
  }, [newTask]);

  return (
    <div className="new-task">
      <div className="new-task-button" onClick={newTaskCallback}>
        <IconButton icon={AddIcon} iconProps={iconProps} disableTouchRipple />
        <div>Add a task</div>
      </div>
      <IconButton icon={MoreIcon} onClick={setAnchorPosition} />
      <TaskListMenu anchorPosition={anchorPosition} onClose={onClose} />
    </div>
  );
}
