import React, { ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import { MenuProps } from '@material-ui/core/Menu';
import { Menu } from '../Menu';

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
      <Button classes={{ root: 'dropdown-button' }} onClick={onClick} fullWidth disableFocusRipple>
        <div>{label}</div> <ArrowDropDownIcon fontSize="default" />
      </Button>
      <Menu {...props}>{children}</Menu>
    </>
  );
}
