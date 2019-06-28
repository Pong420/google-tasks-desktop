import React, { useMemo, ReactNode, MouseEvent } from 'react';
import { Omit } from 'react-redux';
import { Menu, MenuProps } from '../Menu';
import Button, { ButtonProps } from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import mergeWith from 'lodash.mergewith';

export interface DropDownProps extends Omit<MenuProps, 'onClick'> {
  label?: string;
  onClick(evt: MouseEvent<HTMLButtonElement>): void;
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
        { root: 'mui-dropdown-button' },
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
