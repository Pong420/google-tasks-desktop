import React, { MouseEvent } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';
import { useBoolean } from '../../utils/useBoolean';

interface Props {
  onClick?(evt: MouseEvent<HTMLElement>): void;
}

export function ToggleCompleted({ onClick }: Props) {
  const [hover, { on, off }] = useBoolean(false);

  return (
    <div
      className="toggle-completed"
      onClick={onClick}
      onMouseEnter={on}
      onMouseLeave={off}
    >
      <IconButton>
        {hover ? <TickIcon color="secondary" /> : <CircleIcon />}
      </IconButton>
    </div>
  );
}
