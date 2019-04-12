import React, { useState, useCallback, SyntheticEvent } from 'react';
import { Input, Modal, ModalProps } from './Mui';

interface Props extends Pick<ModalProps, 'open' | 'handleClose'> {
  addTaskList(title: string): void;
}

export function NewTaskListModal({
  addTaskList,
  handleClose,
  ...props
}: Props) {
  const [title, setTitle] = useState('');
  const onChangeCallback = useCallback(evt => setTitle(evt.target.value), []);
  const handleConfirmCallback = useCallback(
    (evt?: SyntheticEvent<any>) => {
      evt && evt.preventDefault();
      addTaskList(title);
      setTitle('');
      handleClose();
    },
    [addTaskList, handleClose, title]
  );

  return (
    <Modal
      title="Create new list"
      handleClose={handleClose}
      handleConfirm={handleConfirmCallback}
      {...props}
    >
      <form onSubmit={handleConfirmCallback}>
        <Input
          className="filled"
          placeholder="Enter name"
          value={title}
          onChange={onChangeCallback}
          autoFocus
        />
      </form>
    </Modal>
  );
}
