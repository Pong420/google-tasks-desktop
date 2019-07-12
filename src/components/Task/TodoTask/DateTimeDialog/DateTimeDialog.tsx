import React, { useState, useCallback, useRef } from 'react';
import { Omit } from 'react-redux';
import { ConfirmDialog, ConfirmDialogProps } from '../../../Mui/Dialog';
import { DatePicker } from '../../../DatePicker';

interface Props
  extends Omit<ConfirmDialogProps, 'onChange' | 'onConfirm' | 'confirmLabel'> {
  date?: Date;
  onConfirm(date: Date): void;
}

const dialogClasses: ConfirmDialogProps['classes'] = {
  paper: 'date-time-dialog-paper'
};

export const DateTimeDialog = React.memo(
  ({ date: defaultDate, onConfirm, ...props }: Props) => {
    const [date, setDate] = useState(defaultDate || new Date());

    const onConfirmCallback = useCallback(() => {
      onConfirm(date);
    }, [date, onConfirm]);

    return (
      <ConfirmDialog
        confirmLabel="OK"
        classes={dialogClasses}
        onConfirm={onConfirmCallback}
        {...props}
      >
        <DatePicker value={defaultDate} onChange={setDate} />
      </ConfirmDialog>
    );
  }
);
