import React, { MouseEvent } from 'react';

import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';
import { IconButton } from '../Mui/IconButton';
import { useBoolean } from '../../utils/useBoolean';

interface Props {
  completed?: boolean;
  onClick?(evt: MouseEvent<HTMLElement>): void;
}

export function ToggleCompleted({ completed, onClick }: Props) {
  const [hover, { on, off }] = useBoolean(false);

  return (
    <div
      className="toggle-completed"
      onClick={onClick}
      onMouseEnter={on}
      onMouseLeave={off}
    >
      <IconButton
        tooltip={hover && !completed ? 'Mark complete' : 'Mark incomplete'}
      >
        {completed || hover ? <TickIcon color="secondary" /> : <CircleIcon />}
      </IconButton>
    </div>
  );
}
