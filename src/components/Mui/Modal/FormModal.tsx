import React, { useCallback, SyntheticEvent, useState } from 'react';
import { Omit } from 'react-redux';
import { InputBaseProps } from '@material-ui/core/InputBase';
import { Modal, ModalProps } from './Modal';
import { Input } from '../Input';

interface Props extends Omit<ModalProps, 'handleConfirm' | 'confirmLabel'> {
  defaultValue?: string;
  inputProps?: InputBaseProps;
  handleConfirm(val: string): void;
}

export function FormModal({
  defaultValue = '',
  handleClose,
  handleConfirm,
  inputProps,
  ...props
}: Props) {
  const [value, setValue] = useState(defaultValue);

  const handleConfirmCallback = useCallback(() => {
    const realVal = value.trim();

    if (!realVal) {
      // TODO: show warning
    } else if (realVal !== defaultValue) {
      handleConfirm(value);
    }
  }, [defaultValue, handleConfirm, value]);

  const submitCallback = useCallback(
    (evt?: SyntheticEvent<any>) => {
      evt && evt.preventDefault();
      handleConfirmCallback();
      handleClose();
    },
    [handleClose, handleConfirmCallback]
  );

  return (
    <Modal
      confirmLabel="Done"
      handleConfirm={handleConfirmCallback}
      handleClose={handleClose}
      onExited={() => setValue(defaultValue)}
      {...props}
    >
      <form onSubmit={submitCallback}>
        <Input
          autoFocus
          className="filled bottom-border"
          value={value}
          onChange={evt => setValue(evt.currentTarget.value)}
          placeholder="Enter name"
          {...inputProps}
        />
      </form>
    </Modal>
  );
}
