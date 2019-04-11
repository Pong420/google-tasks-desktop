import React, { useState, MouseEvent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

interface Props {
  onClick?(evt: MouseEvent<HTMLElement>): void;
}

export function ToggleCompleted({ onClick }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="toggle-completed"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <IconButton>
        {hover ? <TickIcon color="secondary" /> : <CircleIcon />}
      </IconButton>
    </div>
  );
}
