import React, { ComponentType, ReactElement } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import MuiIconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

interface Props extends Partial<IconButtonProps> {
  tooltip?: string;
  icon?: ComponentType<SvgIconProps>;
  iconProps?: SvgIconProps;
  children?: ReactElement;
}

export function IconButton({
  tooltip = '',
  icon: Icon,
  iconProps,
  children,
  ...props
}: Props) {
  return (
    <MuiIconButton className="mui-icon-button" {...props}>
      <Tooltip
        title={tooltip}
        PopperProps={{
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
        }}
      >
        {Icon ? <Icon {...iconProps} /> : children ? children : <div />}
      </Tooltip>
    </MuiIconButton>
  );
}
