import React, { useState, useCallback } from 'react';
import { Omit } from 'react-redux';
import { Modal, ModalProps } from '../../../Mui/Modal';
import { DatePicker } from '../DatePicker';

interface Props extends Omit<ModalProps, 'onChange' | 'handleConfirm'> {
  date: Date;
  handleConfirm(date: Date): void;
}

const modalClasses: ModalProps['classes'] = { paper: 'date-time-modal-paper' };
const paperProps: ModalProps['PaperProps'] = { style: { overflow: 'hidden' } };

export function DateTimeModal({
  date: defaultDate,
  handleConfirm,
  ...props
}: Props) {
  const [date, setDate] = useState(defaultDate);

  const handleConfirmCallback = useCallback(() => {
    handleConfirm(date);
  }, [date, handleConfirm]);

  return (
    <Modal
      classes={modalClasses}
      handleConfirm={handleConfirmCallback}
      PaperProps={paperProps}
      {...props}
    >
      <DatePicker value={defaultDate} onChange={setDate} />
    </Modal>
  );
}
