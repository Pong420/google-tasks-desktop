import React, { useState, useCallback } from 'react';
import { Input, Modal, ModalProps } from './Mui';

interface Props extends Pick<ModalProps, 'open' | 'handleClose'> {
  addTaskList(title: string): void;
}

export function NewTaskListModal({ addTaskList, ...props }: Props) {
  const [title, setTitle] = useState('');
  const onChangeCallback = useCallback(evt => setTitle(evt.target.value), []);
  const handleConfirmCallback = useCallback(() => addTaskList(title), [
    addTaskList,
    title
  ]);

  return (
    <Modal
      title="Create new list"
      {...props}
      handleConfirm={handleConfirmCallback}
    >
      <Input
        className="filled"
        placeholder="Enter name"
        value={title}
        onChange={onChangeCallback}
        autoFocus
      />
    </Modal>
  );
}
