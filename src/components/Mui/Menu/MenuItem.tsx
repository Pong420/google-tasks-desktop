import React, { forwardRef, useCallback, MouseEvent } from 'react';
import MuiMenuItem from '@material-ui/core/MenuItem';
import TickIcon from '@material-ui/icons/Check';

type DefaultMenuItemProps = Parameters<typeof MuiMenuItem>[0];

export interface MenuItemProps extends DefaultMenuItemProps {
  text?: string;
}

interface Props {
  onClose(): void;
}

const menuItemClasses = { root: 'mui-menu-item' };

export const MenuItem = forwardRef<HTMLLIElement, Props & MenuItemProps>(
  ({ children, text, onClick, onClose, selected, ...props }, ref) => {
    const onClickCallback = useCallback(
      (evt: MouseEvent<HTMLLIElement>) => {
        onClose();
        onClick && onClick(evt);
      },
      [onClose, onClick]
    );

    return (
      <MuiMenuItem
        classes={menuItemClasses}
        onClick={onClickCallback}
        ref={ref}
        {...props}
      >
        <div>
          <div className="text">{text}</div>
          {selected && <TickIcon />}
        </div>
        {children}
      </MuiMenuItem>
    );
  }
);

export function useMuiMenuItem({ onClose }: Props) {
  return useCallback(
    forwardRef<HTMLLIElement, MenuItemProps>((props, ref) => (
      <MenuItem onClose={onClose} {...props} ref={ref} />
    )),
    [onClose]
  );
}
