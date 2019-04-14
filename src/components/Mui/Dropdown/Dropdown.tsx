import React, { ReactNode } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import { MenuProps } from '@material-ui/core/Menu';
import { Menu } from '../Menu';

export interface DropDownProps extends MenuProps {
  label: string;
  onClick(evt: any): void;
  children: ReactNode;
  buttonProps?: ButtonProps;
}

export function Dropdown({
  label,
  children,
  onClick,
  buttonProps,
  ...props
}: DropDownProps) {
  return (
    <>
      <Button
        classes={{ root: 'dropdown-button' }}
        onClick={onClick}
        disableFocusRipple
        {...buttonProps}
      >
        <div>{label}</div> <ArrowDropDownIcon fontSize="default" />
      </Button>
      <Menu {...props} classes={{ paper: 'dropdown-menu-paper' }}>
        {children}
      </Menu>
    </>
  );
}
