import React, { useCallback, RefObject } from 'react';
import MuiMenuItem, {
  MenuItemProps as DefaultMenuItemProps
} from '@material-ui/core/MenuItem';
import TickIcon from '@material-ui/icons/Check';
import RootRef from '@material-ui/core/RootRef';

export interface MenuItemProps extends DefaultMenuItemProps {
  text?: string;
  rootRef?: (n: HTMLLIElement) => void | RefObject<HTMLLIElement>;
  selected?: boolean;
}

export function useMenuItem(onClose: () => void) {
  return useCallback(
    ({
      text,
      rootRef = () => {},
      selected,
      classes,
      children,
      onClick,
      ...props
    }: MenuItemProps) => {
      return (
        <RootRef rootRef={rootRef}>
          <MuiMenuItem
            selected={selected}
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
        </RootRef>
      );
    },
    [onClose]
  );
}
