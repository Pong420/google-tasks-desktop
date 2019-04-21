import React, { useMemo, ReactNode } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Menu } from '../Menu';
import { MenuProps } from '@material-ui/core/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import mergeWith from 'lodash/mergeWith';

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
  classes,
  buttonProps,
  ...props
}: DropDownProps) {
  const mergedMenuClasses = useMemo(
    () =>
      mergeWith(
        { paper: 'dropdown-menu-paper' },
        classes,
        (a, b) => a + ' ' + b
      ),
    [classes]
  );

  const { classes: buttonClasses, ...otherButtonProps } = buttonProps || {
    classes: ''
  };

  const mergedButtonClasses = useMemo(
    () =>
      mergeWith(
        { root: 'dropdown-button' },
        buttonClasses,
        (a, b) => a + ' ' + b
      ),
    [buttonClasses]
  );

  return (
    <>
      <Button
        classes={mergedButtonClasses}
        onClick={onClick}
        disableFocusRipple
        {...otherButtonProps}
      >
        <div>{label}</div> <ArrowDropDownIcon fontSize="default" />
      </Button>
      <Menu {...props} classes={mergedMenuClasses}>
        {children}
      </Menu>
    </>
  );
}
