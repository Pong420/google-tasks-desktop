import React, { useState, useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

export function ToggleCompleted() {
  const [hover, setHover] = useState(false);
  const Icon = useMemo(() => (hover ? TickIcon : CircleIcon), [hover]);

  return (
    <div
      className="toggle-completed"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <IconButton>
        <Icon fontSize="small" />
      </IconButton>
    </div>
  );
}
