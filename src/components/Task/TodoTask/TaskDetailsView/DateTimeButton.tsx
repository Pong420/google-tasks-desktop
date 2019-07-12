import React, { useCallback } from 'react';
import { IconButton } from '../../../Mui';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
  date?: Date;
  onClick(): void;
  onClose(): void;
}

export const DateTimeButton = React.memo<Props>(
  ({ date, onClick, onClose }) => {
    const onCloseCallback = useCallback(() => {
      onClose();
    }, [onClose]);

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
          icon={CloseIcon}
          tooltip="Remove date and time"
          onClick={onCloseCallback}
        />
      </div>
    );
  }
);
