import React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { classes } from '../../../utils/classes';

export function Input({ className, ...props }: InputBaseProps) {
  return (
    <InputBase
      fullWidth
      className={classes('mui-input-base', className)}
      classes={{
        focused: 'focused',
        multiline: 'multiline'
      }}
      {...props}
    />
  );
}
