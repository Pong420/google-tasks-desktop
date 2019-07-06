import React, { useState, useCallback } from 'react';
import { Omit } from 'react-redux';
import { ConfirmDialog, ConfirmDialogProps } from '../../../Mui/Dialog';
import { DatePicker } from '../../../DatePicker';

interface Props extends Omit<ConfirmDialogProps, 'onChange' | 'onConfirm'> {
  date: Date;
  onConfirm(date: Date): void;
}

const modalClasses: ConfirmDialogProps['classes'] = {
  paper: 'date-time-modal-paper'
};

const paperProps: ConfirmDialogProps['PaperProps'] = {
  style: { overflow: 'hidden' }
};

export function DateTimeDialog({
  date: defaultDate,
  onConfirm,
  ...props
}: Props) {
  const [date, setDate] = useState(defaultDate);

  const onConfirmCallback = useCallback(() => {
    onConfirm(date);
  }, [date, onConfirm]);

  return (
    <ConfirmDialog
      classes={modalClasses}
      onConfirm={onConfirmCallback}
      PaperProps={paperProps}
      {...props}
    >
      <DatePicker value={defaultDate} onChange={setDate} />
    </ConfirmDialog>
  );
}
