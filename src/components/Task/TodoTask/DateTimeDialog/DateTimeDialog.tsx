import React, { useState, useCallback } from 'react';
import { Omit } from 'react-redux';
import { ConfirmDialog, ConfirmDialogProps } from '../../../Mui/Dialog';
import { DatePicker } from '../../../DatePicker';

interface Props extends Omit<ConfirmDialogProps, 'onChange' | 'onConfirm'> {
  date?: Date;
  onConfirm(date: Date): void;
}

const modalClasses: ConfirmDialogProps['classes'] = {
  paper: 'date-time-modal-paper'
};

export const DateTimeDialog = React.memo(
  ({ date: defaultDate, onConfirm, ...props }: Props) => {
    const [date, setDate] = useState(defaultDate || new Date());

    const onConfirmCallback = useCallback(() => {
      onConfirm(date);
    }, [date, onConfirm]);

    return (
      <ConfirmDialog
        classes={modalClasses}
        onConfirm={onConfirmCallback}
        {...props}
      >
        <DatePicker value={defaultDate} onChange={setDate} />
      </ConfirmDialog>
    );
  }
);
