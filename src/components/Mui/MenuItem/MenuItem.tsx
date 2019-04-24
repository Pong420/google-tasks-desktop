import React, { useCallback, RefObject, forwardRef } from 'react';
import MuiMenuItem, {
  MenuItemProps as DefaultMenuItemProps
} from '@material-ui/core/MenuItem';
import TickIcon from '@material-ui/icons/Check';

export interface MenuItemProps extends DefaultMenuItemProps {
  text?: string;
  selected?: boolean;
}

export function useMenuItem(onClose: () => void) {
  return useCallback(
    forwardRef<any, MenuItemProps>(
      ({ text, selected, classes, children, onClick, ...props }, ref) => (
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
