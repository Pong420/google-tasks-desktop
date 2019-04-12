import React, { ReactNode } from 'react';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';

export interface DropDownProps extends MenuProps {
  label: string;
  onClick(evt: any): void;
  children: ReactNode;
}

export function Dropdown({
  label,
  children,
  onClick,
  ...props
}: DropDownProps) {
  return (
    <>
      <Button classes={{ root: 'dropdown-button' }} onClick={onClick} fullWidth>
        {label} <ArrowDropDownIcon fontSize="default" />
      </Button>
      <Menu
        {...props}
        // classes={{ paper: 'dropdown-menu-paper' }}
        // MenuListProps={{ classes: { root: 'dropdown-menu-list' } }}
      >
        {children}
      </Menu>
    </>
  );
}
