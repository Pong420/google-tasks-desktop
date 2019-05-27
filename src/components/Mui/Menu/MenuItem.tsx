import React, { useCallback, forwardRef } from 'react';
import MuiMenuItem, {
  MenuItemProps as DefaultMenuItemProps
} from '@material-ui/core/MenuItem';
import TickIcon from '@material-ui/icons/Check';

interface UseMuiMenuItemProps {
  onClose(): void;
}

export interface MenuItemProps extends DefaultMenuItemProps {
  text?: string;
  selected?: boolean;
}

const menuItemClasses = { root: 'mui-menu-item' };

export function MenuItem({
  children,
  text,
  onClick,
  onClose,
  selected,
  ...props
}: MenuItemProps & UseMuiMenuItemProps) {
  const onClickCallback = useCallback(
    evt => {
      onClose();
      onClick && onClick(evt);
    },
    [onClose, onClick]
  );

  return (
    <MuiMenuItem classes={menuItemClasses} onClick={onClickCallback} {...props}>
      <div>
        <div className="text">{text}</div>
        {selected && <TickIcon />}
      </div>
      {children}
    </MuiMenuItem>
  );
}

export function useMuiMenuItem({ onClose }: UseMuiMenuItemProps) {
  // Not sure reason, but forwardRef is required
  return useCallback(
    forwardRef<any, MenuItemProps>((props, ref) => (
      <MenuItem onClose={onClose} {...props} />
    )),
    [onClose]
  );
}
