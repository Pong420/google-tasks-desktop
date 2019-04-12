import React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';

export function Input({ className, ...props }: InputBaseProps) {
  return (
    <InputBase
      fullWidth
      className={['mui-input-base', className]
        .filter(Boolean)
        .join(' ')
        .trim()}
      classes={{ focused: 'focused', multiline: 'multiline' }}
      {...props}
    />
  );
}
