import React from 'react';
import { useSelector } from 'react-redux';
import { useMuiMenuItem, Menu, MenuProps } from '../../../../components/Mui';
import { taskSelector } from '../../../../store';

interface Props extends Omit<MenuProps, 'ref'> {
  uuid: string;
  onDelete?: () => void;
  openDateTimeDialog?: () => void;
  openTaskListDropdown?: () => void;
}

const classes: MenuProps['classes'] = { paper: 'todo-task-menu-paper' };

export const TodoTaskMenu = ({
  uuid,
  onClose,
  onDelete,
  openDateTimeDialog,
  openTaskListDropdown,
  ...props
}: Props) => {
  const MenuItem = useMuiMenuItem({ onClose });
  const { due } = useSelector(taskSelector(uuid)) || {};

  return (
    <Menu {...props} classes={classes} onClose={onClose}>
      <MenuItem text="Delete" onClick={onDelete} />
      <MenuItem
        text={`${due ? 'Change' : 'Add'} date/time`}
        onClick={openDateTimeDialog}
      />
      <MenuItem text="Add a subtask" disabled />
      {/* TODO:  should not show on first task */}
      <MenuItem text="Indent" disabled />
      <MenuItem text="Move to another list" onClick={openTaskListDropdown} />
    </Menu>
  );
};
