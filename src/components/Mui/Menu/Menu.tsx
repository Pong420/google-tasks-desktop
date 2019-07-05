import React, { useMemo, forwardRef, ReactNode } from 'react';
import Popover, { PopoverProps } from '@material-ui/core/Popover';
import { ScrollContent } from '../../ScrollContent';
import { SimplebarAPI, WithSimplebar } from '../../../typings';
import mergeWith from 'lodash.mergewith';

export interface MenuProps extends PopoverProps, WithSimplebar {
  onClose(): void;
  outOfScrollContent?: ReactNode;
}

const backdropProps = {
  classes: { root: 'mui-menu-backdrop' },
  invisible: true
};

export const Menu = forwardRef<SimplebarAPI, MenuProps>(
  ({ classes, children, simplebarRef, outOfScrollContent, ...props }, ref) => {
    const mergedClasses = useMemo<PopoverProps['classes']>(
      () =>
        mergeWith({ paper: 'mui-menu-paper' }, classes, (a, b) => a + ' ' + b),
      [classes]
    );

    return (
      <Popover
        classes={mergedClasses}
        BackdropProps={backdropProps}
        ref={ref}
        {...props}
      >
        <div className="menu-content">
          <ScrollContent simplebarRef={simplebarRef}>{children}</ScrollContent>
          {outOfScrollContent}
        </div>
      </Popover>
    );
  }
);
