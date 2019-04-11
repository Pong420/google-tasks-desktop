import React, { forwardRef, useCallback } from 'react';
import MuiMenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import TickIcon from '@material-ui/icons/Check';

interface Props extends MenuItemProps {
  text?: string;
}

export function useMenuItem(onClose: () => void) {
  return useCallback(
    forwardRef(
      (
        { text, selected, classes, children, onClick, ...props }: Props,
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
          <div>
            <div className="text">{text}</div>
            {selected && <TickIcon />}
          </div>
          {children}
        </MuiMenuItem>
      )
    ),
    [onClose]
  );
}
