import React from 'react';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import { useMenuItem } from '../Mui';

interface Props {
  anchorEl: HTMLElement | null;
  onClose(): void;
}

export function TaskListMenu({ anchorEl, onClose }: Props) {
  const MenuItem = useMenuItem(onClose);

  return (
    <Menu
      classes={{ paper: 'task-list-menu-paper' }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      <div className="task-list-menu-title">Sort by</div>
      <MenuItem text="My order" selected />
      <MenuItem text="Date" />
      <Divider />
      <MenuItem text="Rename list" />
      <MenuItem text="disabled>Delete list" />
      <MenuItem text="Delete all completed tasks" />
      <Divider />
      <MenuItem text="Keyboard shortcuts" />
      <MenuItem text="Copy reminders to Tasks" />
    </Menu>
  );
}
