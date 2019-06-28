import React, { useCallback, useState } from 'react';
import { Omit } from 'react-redux';
import { Modal, ModalProps } from '../../../Mui/Modal';
import { DatePicker } from '../DatePicker';
import { TimeDropdown } from './TimeDropdown';
import { Schema$Task } from '../../../../typings';
import Button from '@material-ui/core/Button';
import TimeIcon from '@material-ui/icons/AccessTime';
import RepeatIcon from '@material-ui/icons/Repeat';

interface Props extends Omit<ModalProps, 'onChange'> {
  task: Schema$Task;
  onDueDateChange(date: Date): void;
}

const modalClasses = { paper: 'date-time-modal-paper' };

export function DateTimeModal({
  task,
  handleConfirm,
  onDueDateChange,
  ...props
}: Props) {
  const [date, setDate] = useState<Date>(
    task.due ? new Date(task.due) : new Date()
  );
  const handleConfirmCallback = useCallback(() => {
    date && onDueDateChange(date);
    handleConfirm();
  }, [date, handleConfirm, onDueDateChange]);

  return (
    <Modal
      classes={modalClasses}
      handleConfirm={handleConfirmCallback}
      {...props}
    >
      <DatePicker value={date} onChange={setDate} />
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
