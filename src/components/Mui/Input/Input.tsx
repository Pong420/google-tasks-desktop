import React, { useMemo } from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';

export type InputProps = Omit<InputBaseProps, 'ref'>;

export function Input({ className = '', ...props }: InputProps) {
  const mergedClasses = useMemo<InputBaseProps['classes']>(
    () => ({
      root: `mui-input-base ${className}`.trim(),
      focused: 'focused',
      multiline: 'multiline',
      error: 'error'
    }),
    [className]
  );

  return <InputBase {...props} fullWidth classes={mergedClasses} />;
}
