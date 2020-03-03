import React, { useMemo } from 'react';
import Popover, { PopoverProps } from '@material-ui/core/Popover';
import mergeWith from 'lodash/mergeWith';

export interface MenuProps extends PopoverProps {
  onClose(): void;
}

const backdropProps = {
  classes: { root: 'mui-menu-backdrop' },
  invisible: true
};

export const Menu = ({ classes, children, ...props }: MenuProps) => {
  const mergedClasses = useMemo<PopoverProps['classes']>(
    () =>
      mergeWith({ paper: 'mui-menu-paper' }, classes, (a, b) => a + ' ' + b),
    [classes]
  );

  return (
    <Popover classes={mergedClasses} BackdropProps={backdropProps} {...props}>
      <div className="menu-content">
        <div className="scroll-content">{children}</div>
      </div>
    </Popover>
  );
};
