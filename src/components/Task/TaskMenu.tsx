import React, { forwardRef, useState, useCallback } from 'react';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MuiMenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';

export type AnchorPosition = MenuProps['anchorPosition'];

interface Props {
  anchorPosition?: AnchorPosition;
  onClose(): void;
  onDelete(): void;
}

export function TaskMenu({ anchorPosition, onClose, onDelete }: Props) {
  const MenuItem = useCallback(
    forwardRef(
      (
        { selected, classes, children, onClick, ...props }: MenuItemProps,
        ref
      ) => (
        <MuiMenuItem
          classes={{ root: 'mui-menu-item' }}
          onClick={evt => {
            onClose();
            onClick && onClick(evt);
          }}
          {...props}
        >
          {children}
        </MuiMenuItem>
      )
    ),
    [onClose]
  );

  return (
    <Menu
      open={Boolean(anchorPosition)}
      onClose={onClose}
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
    >
      <MenuItem onClick={onDelete}>
        <div>Delete</div>
      </MenuItem>
      <MenuItem>
        <div>Add date/time</div>
      </MenuItem>
      <MenuItem>
        <div>Add a subtask</div>
      </MenuItem>
      <MenuItem>
        <div>Indent</div>
        ⌘]
      </MenuItem>
      <MenuItem>
        <div>Move to another list</div>
      </MenuItem>
    </Menu>
  );
}
