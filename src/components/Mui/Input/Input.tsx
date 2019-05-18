import React, { useMemo } from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { classes } from '../../../utils/classes';

export function Input({ className, ...props }: InputBaseProps) {
  const mergedClasses = useMemo(
    () => ({
      root: classes('mui-input-base', className),
      focused: 'focused',
      multiline: 'multiline',
      error: 'error'
    }),
    [className]
  );

  return <InputBase fullWidth classes={mergedClasses} {...props} />;
}
