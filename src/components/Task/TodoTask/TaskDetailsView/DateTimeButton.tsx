import React from 'react';
import { IconButton } from '../../../Mui';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
  due?: string;
  onClick(): void;
  onClose(): void;
}

export function DateTimeButton({ due, onClick, onClose }: Props) {
  if (!due) {
    return <Button onClick={onClick}>Add date/time</Button>;
  }

  return (
    <div className="task-deatails-due-date-button">
      <div className="task-deatails-due-date-clickable" onClick={onClick} />
      <div>
        <div className="date">{new Date(due).format('D, j M')}</div>
      </div>
      <IconButton
        icon={CloseIcon}
        tooltip="Remove date and time"
        onClick={onClose}
      />
    </div>
  );
}
