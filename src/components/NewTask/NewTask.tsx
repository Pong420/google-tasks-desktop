import React, { useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { TaskListMenu } from './TaskListMenu';
import { useMuiMenu, IconButton } from '../Mui';
import { newTask } from '../../store';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';

const iconProps: SvgIconProps = { color: 'secondary' };

export function NewTaskComponent({ dispatch }: DispatchProp) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  const newTaskCallback = useCallback(() => {
    dispatch(newTask());
  }, [dispatch]);

  return (
    <div className="new-task">
      <div className="new-task-button" onClick={newTaskCallback}>
        <IconButton icon={AddIcon} iconProps={iconProps} disableTouchRipple />
        <div>Add a task</div>
      </div>
      <IconButton icon={MoreIcon} onClick={setAnchorEl} />
      <TaskListMenu open={!!anchorEl} anchorEl={anchorEl} onClose={onClose} />
    </div>
  );
}

export const NewTask = connect()(NewTaskComponent);
