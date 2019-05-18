import React, { useCallback, SyntheticEvent, useState } from 'react';
import { Omit } from 'react-redux';
import { InputBaseProps } from '@material-ui/core/InputBase';
import { Modal, ModalProps } from './Modal';
import { Input } from '../Input';

interface Props extends Omit<ModalProps, 'handleConfirm' | 'confirmLabel'> {
  defaultValue?: string;
  inputProps?: InputBaseProps;
  handleConfirm(val: string): void;
  errorMsg?: string;
}

export function FormModal({
  defaultValue = '',
  handleClose,
  handleConfirm,
  inputProps,
  errorMsg,
  ...props
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(false);

  const handleConfirmCallback = useCallback(() => {
    const realVal = value.trim();

    if (!realVal) {
      setError(true);
      return false;
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

  const onExitedCallback = useCallback(() => {
    setValue(defaultValue);
    setError(false);
  }, [defaultValue]);

  return (
    <Modal
      confirmLabel="Done"
      handleConfirm={handleConfirmCallback}
      handleClose={handleClose}
      onExited={onExitedCallback}
      autoFocusConfirmButon={false}
      {...props}
    >
      <form onSubmit={submitCallback}>
        <Input
          autoFocus
          className="filled bottom-border"
          value={value}
          onChange={evt => setValue(evt.currentTarget.value)}
          placeholder="Enter name"
          error={error}
          {...inputProps}
        />
        <div className="form-modal-error-message">{error && errorMsg}</div>
      </form>
    </Modal>
  );
}
