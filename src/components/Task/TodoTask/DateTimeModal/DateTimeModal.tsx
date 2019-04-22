import React from 'react';
import { Modal, ModalProps } from '../../../Mui/Modal';
import { DatePicker } from '../DatePicker';
import { TimeDropdown } from '../TimeDropdown';
import Button from '@material-ui/core/Button';
import TimeIcon from '@material-ui/icons/AccessTime';
import RepeatIcon from '@material-ui/icons/Repeat';

interface Props extends ModalProps {
  tbc?: string;
}

export function DateTimeModal({ ...props }: Props) {
  return (
    <Modal classes={{ paper: 'date-time-modal-paper' }} {...props}>
      <DatePicker />
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
