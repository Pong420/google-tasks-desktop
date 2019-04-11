import React, { useCallback, forwardRef } from 'react';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import TickIcon from '@material-ui/icons/Check';
import MuiMenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';

interface Props {
  anchorEl: HTMLElement | null;
  onClose(): void;
}

export function TaskListMenu({ anchorEl, onClose }: Props) {
  const MenuItem = useCallback(
    forwardRef(
      (
        { selected, classes, children, onClick, ...props }: MenuItemProps,
        ref
      ) => (
        <MuiMenuItem
          classes={{ root: `mui-menu-item` }}
          onClick={evt => {
            onClose();
            onClick && onClick(evt);
          }}
          {...props}
        >
          {children}
          {selected && <TickIcon />}
        </MuiMenuItem>
      )
    ),
    [onClose]
  );

  return (
    <Menu
      classes={{ paper: 'task-list-menu-paper' }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <div className="task-list-menu-title">Sort by</div>
      <MenuItem selected>
        <div>My order</div>
      </MenuItem>
      <MenuItem>
        <div>Date</div>
      </MenuItem>
      <Divider />
      <MenuItem>Rename list</MenuItem>
      <MenuItem disabled>Delete list</MenuItem>
      <MenuItem>Delete all completed tasks</MenuItem>
      <Divider />
      <MenuItem>Keyboard shortcuts</MenuItem>
      <MenuItem>Copy reminders to Tasks</MenuItem>
    </Menu>
  );
}
