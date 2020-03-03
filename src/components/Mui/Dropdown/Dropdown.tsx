import React, { useMemo, ReactNode, MouseEvent, forwardRef } from 'react';
import { Omit } from 'react-redux';
import { Menu, MenuProps } from '../Menu';
import Button, { ButtonProps } from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import mergeWith from 'lodash/mergeWith';

export interface DropdownProps extends Omit<MenuProps, 'onClick' | 'ref'> {
  label?: string;
  onClick(evt: MouseEvent<HTMLButtonElement>): void;
  children?: ReactNode;
  buttonProps?: ButtonProps;
}

export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  ({ buttonProps, children, classes, label, onClick, ...props }, ref) => {
    const mergedMenuClasses = useMemo<MenuProps['classes']>(
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

    const mergedButtonClasses = useMemo<ButtonProps['classes']>(
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
          ref={ref}
          classes={mergedButtonClasses}
          onClick={onClick}
          disableFocusRipple
          {...otherButtonProps}
        >
          <div>{label}</div>
          <ArrowDropDownIcon fontSize="default" />
        </Button>
        <Menu {...props} classes={mergedMenuClasses}>
          {children}
        </Menu>
      </>
    );
  }
);
