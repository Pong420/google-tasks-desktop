import React from 'react';
import { Input, Modal, ModalProps } from './Mui';

interface Props extends Pick<ModalProps, 'open' | 'handleClose'> {}

export function NewTaskListModal({ ...props }: Props) {
  return (
    <Modal title="Create new list" {...props}>
      <Input className="filled" placeholder="Enter name" autoFocus />
    </Modal>
  );
}
