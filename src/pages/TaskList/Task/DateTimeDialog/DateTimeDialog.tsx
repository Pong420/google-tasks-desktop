import React, { useState } from 'react';
import {
  ConfirmDialog,
  ConfirmDialogProps
} from '../../../../components/Mui/Dialog';
import { DatePicker } from '../DatePicker';

interface Props
  extends Omit<ConfirmDialogProps, 'onChange' | 'onConfirm' | 'confirmLabel'> {
  date?: Date;
  onConfirm(date: Date): void;
}

const dialogClasses: ConfirmDialogProps['classes'] = {
  paper: 'date-time-dialog-paper'
};

export const DateTimeDialog = ({
  date: defaultDate,
  onConfirm,
  ...props
}: Props) => {
  const [date, setDate] = useState(defaultDate || new Date());

  return (
    <ConfirmDialog
      confirmLabel="OK"
      classes={dialogClasses}
      onConfirm={() => {
        onConfirm(date);
      }}
      {...props}
    >
      <DatePicker value={defaultDate} onChange={setDate} />
    </ConfirmDialog>
  );
};
