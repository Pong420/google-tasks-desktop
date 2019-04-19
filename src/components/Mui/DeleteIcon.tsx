import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

export function DeleteIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z" />
      <path d="M9 8h2v9H9zm4 0h2v9h-2z" />
    </SvgIcon>
  );
}
