import React from 'react';
import { IconButton } from '../../../../components/Mui';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
  date?: Date;
  onClick?: () => void;
  onRemove?: () => void;
}

export const DateTimeButton = ({ date, onClick, onRemove }: Props) => {
  if (!date) {
    return <Button onClick={onClick}>Add date/time</Button>;
  }

  return (
    <div className="task-deatails-due-date-button">
      <div className="task-deatails-due-date-clickable" onClick={onClick} />
      <div>
        <div className="date">{date.format('D, j M')}</div>
      </div>
      <IconButton
        tooltip="Remove date and time"
        icon={CloseIcon}
        onClick={onRemove}
      />
    </div>
  );
};
