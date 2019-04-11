import React, { useState, useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

const iconProps: SvgIconProps = {
  fontSize: 'small'
};

export function ToggleCompleted() {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="toggle-completed"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <IconButton>
        {hover ? (
          <TickIcon {...iconProps} color="secondary" />
        ) : (
          <CircleIcon {...iconProps} />
        )}
      </IconButton>
    </div>
  );
}
