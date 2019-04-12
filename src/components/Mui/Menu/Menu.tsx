import React, { useMemo } from 'react';
import MuiMenu, { MenuProps } from '@material-ui/core/Menu';
import mergeWith from 'lodash/mergeWith';

export function Menu({ classes, children, PaperProps, ...props }: MenuProps) {
  const mregedClasses = useMemo(
    () =>
      mergeWith({ paper: 'mui-menu-paper' }, classes, (a, b) => a + ' ' + b),
    [classes]
  );

  const mregedPaperProps = useMemo(
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
      classes={mregedClasses}
      disableAutoFocusItem
      PaperProps={mregedPaperProps}
      {...props}
    >
      {children}
    </MuiMenu>
  );
}
