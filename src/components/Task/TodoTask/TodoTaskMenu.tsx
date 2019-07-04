import React, { useCallback } from 'react';
import { useMuiMenuItem, Menu, MenuProps } from '../../Mui';

interface Props {
  anchorPosition?: MenuProps['anchorPosition'];
  onClose(): void;
  onDelete(): void;
  openDateTimeModal(): void;
  openTaskListDropdown(): void;
}

const classes: MenuProps['classes'] = { paper: 'todo-task-menu-paper' };

export function TodoTaskMenu({
  anchorPosition,
  onClose,
  onDelete,
  openDateTimeModal,
  openTaskListDropdown
}: Props) {
  const MenuItem = useMuiMenuItem({ onClose });
  const onDeleteCallback = useCallback(() => onDelete(), [onDelete]);

  return (
    <Menu
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
      classes={classes}
      open={!!anchorPosition}
      onClose={onClose}
    >
      <MenuItem text="Delete" onClick={onDeleteCallback} />
      <MenuItem text="Add date/time" onClick={openDateTimeModal} />
      <MenuItem text="Add a subtask" disabled />
      <MenuItem text="Indent" disabled /> {/* TODO: not should on first task */}
      <MenuItem text="Move to another list" onClick={openTaskListDropdown} />
    </Menu>
  );
}
