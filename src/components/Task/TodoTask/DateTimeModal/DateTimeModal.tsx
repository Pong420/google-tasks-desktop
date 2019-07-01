import React, { useCallback, useState } from 'react';
import { Omit } from 'react-redux';
import { Modal, ModalProps } from '../../../Mui/Modal';
import { DatePicker } from '../DatePicker';

interface Props extends Omit<ModalProps, 'onChange' | 'handleConfirm'> {
  due?: string;
  handleConfirm(date: Date): void;
}

const modalClasses: ModalProps['classes'] = { paper: 'date-time-modal-paper' };
const paperProps: ModalProps['PaperProps'] = { style: { overflow: 'hidden' } };

export function DateTimeModal({ due, handleConfirm, ...props }: Props) {
  const [date, setDate] = useState<Date>(due ? new Date(due) : new Date());
  const handleConfirmCallback = useCallback(() => {
    date && handleConfirm(date);
  }, [date, handleConfirm]);

  return (
    <Modal
      classes={modalClasses}
      handleConfirm={handleConfirmCallback}
      PaperProps={paperProps}
      {...props}
    >
      <DatePicker value={date} onChange={setDate} />
    </Modal>
  );
}
