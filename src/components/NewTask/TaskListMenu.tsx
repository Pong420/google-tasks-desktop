import React, { useCallback, forwardRef, Ref } from 'react';
import Menu from '@material-ui/core/Menu';
import DefaultMenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import DefaultDivider from '@material-ui/core/Divider';
import TickIcon from '@material-ui/icons/Check';

interface Props {
  anchorEl: HTMLElement | null;
  onClose(): void;
}

function Divider() {
  return <DefaultDivider classes={{ root: 'task-list-menu-divider' }} light />;
}

export function TaskListMenu({ anchorEl, onClose }: Props) {
  const MenuItem = useCallback(
    forwardRef(
      (
        { selected, classes, children, onClick, ...props }: MenuItemProps,
        ref
      ) => (
        <DefaultMenuItem
          classes={{
            root: `task-list-menu-item ${classes && classes.root}`.trim()
          }}
          onClick={evt => {
            onClose();
            onClick && onClick(evt);
          }}
          {...props}
        >
          {children}
          {selected && <TickIcon color="secondary" />}
        </DefaultMenuItem>
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
      disableAutoFocusItem
    >
      <MenuItem classes={{ root: 'task-list-menu-title' }} disabled>
        Sort by
      </MenuItem>
      <MenuItem selected>My order</MenuItem>
      <MenuItem>Date</MenuItem>
      <Divider />
      <MenuItem>RenameList</MenuItem>
      <MenuItem disabled>Delete list</MenuItem>
      <MenuItem>Delete all completed tasks</MenuItem>
      <Divider />
      <MenuItem>Keyboard shortcuts</MenuItem>
      <MenuItem>Copy reminders to Tasks</MenuItem>
    </Menu>
  );
}
