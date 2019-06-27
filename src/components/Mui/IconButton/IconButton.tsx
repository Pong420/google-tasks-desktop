import React, { ComponentType, ReactElement } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import MuiIconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

interface Props extends Partial<IconButtonProps> {
  tooltip?: string;
  icon?: ComponentType<any>;
  iconProps?: SvgIconProps;
  children?: ReactElement<any>;
}

const PopperProps = {
  popperOptions: {
    modifiers: {
      offset: {
        fn: (data: any) => {
          data.offsets.reference.top = data.offsets.reference.top + 75;
          return data;
        }
      }
    }
  }
};

export function IconButton({
  className = '',
  tooltip = '',
  icon: Icon,
  iconProps,
  children,
  ...props
}: Props) {
  return (
    <MuiIconButton className={`mui-icon-button ${className}`.trim()} {...props}>
      <Tooltip title={tooltip} PopperProps={PopperProps}>
        {Icon ? <Icon {...iconProps} /> : children ? children : <div />}
      </Tooltip>
    </MuiIconButton>
  );
}
