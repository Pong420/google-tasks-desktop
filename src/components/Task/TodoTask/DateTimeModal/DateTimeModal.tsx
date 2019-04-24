import React, { useCallback, useState } from 'react';
import { Omit } from 'react-redux';
import { Modal, ModalProps } from '../../../Mui/Modal';
import { DatePicker } from '../DatePicker';
import { TimeDropdown } from '../TimeDropdown';
import Button from '@material-ui/core/Button';
import TimeIcon from '@material-ui/icons/AccessTime';
import RepeatIcon from '@material-ui/icons/Repeat';
import { Schema$Task } from '../../../../typings';

interface Props extends Omit<ModalProps, 'onChange'> {
  task: Schema$Task;
  onDueDateChange(date: Date): void;
}

export function DateTimeModal({
  task,
  handleConfirm,
  onDueDateChange,
  ...props
}: Props) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const handleConfirmCallback = useCallback(() => {
    date && onDueDateChange(date);
    handleConfirm();
  }, [date, handleConfirm, onDueDateChange]);

  return (
    <Modal
      classes={{ paper: 'date-time-modal-paper' }}
      handleConfirm={handleConfirmCallback}
      {...props}
    >
      <DatePicker
        value={task.due ? new Date(task.due) : undefined}
        onChange={setDate}
      />
      <div className="row">
        <TimeIcon />
        <TimeDropdown />
      </div>
      <div className="row">
        <RepeatIcon />
        <Button disabled>Repeat</Button>
      </div>
    </Modal>
  );
}
