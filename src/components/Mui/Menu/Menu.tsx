import React, { useMemo } from 'react';
import MuiMenu, { MenuProps } from '@material-ui/core/Menu';
import mergeWith from 'lodash.mergewith';

export type MenuProps = MenuProps;

const backdropProps = {
  classes: { root: 'mui-menu-backdrop' },
  invisible: true
};

export function Menu({ classes, children, PaperProps, ...props }: MenuProps) {
  const mergedClasses = useMemo(
    () =>
      mergeWith({ paper: 'mui-menu-paper' }, classes, (a, b) => a + ' ' + b),
    [classes]
  );

  const mergedPaperProps = useMemo(
    () =>
      mergeWith(
        {
          style: {
            borderRadius: '8px',
            boxShadow: `0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)`
          }
        },
        PaperProps
      ),
    [PaperProps]
  );

  return (
    <MuiMenu
      disableAutoFocusItem
      classes={mergedClasses}
      PaperProps={mergedPaperProps}
      BackdropProps={backdropProps}
      {...props}
    >
      {children}
    </MuiMenu>
  );
}
