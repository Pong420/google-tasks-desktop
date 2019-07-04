import React, { useCallback, useState, useRef, FormEvent } from 'react';
import { Omit } from 'react-redux';
import { Modal, ModalProps } from './Modal';
import { Input } from '../Input';

interface Props extends Omit<ModalProps, 'handleConfirm' | 'confirmLabel'> {
  defaultValue?: string;
  errorMsg?: string;
  handleConfirm(val: string): void;
}

const INPUT_NAME = 'NAME';

export function FormModal({
  defaultValue = '',
  errorMsg,
  handleClose,
  handleConfirm,
  ...props
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState(false);

  const submitCallback = useCallback(
    (evt?: FormEvent<HTMLFormElement>) => {
      evt && evt.preventDefault();

      const formEl = formRef.current;
      if (formEl) {
        const formData = new FormData(formEl);
        const trimedValue = (formData.get(INPUT_NAME) as string).trim();

        if (!trimedValue) {
          setError(true);
          return false;
        } else if (trimedValue !== defaultValue) {
          handleConfirm(trimedValue);
          handleClose();
        }
      }
    },
    [handleClose, handleConfirm, defaultValue]
  );

  const onExitedCallback = useCallback(() => {
    setError(false);
  }, []);

  return (
    <Modal
      {...props}
      autoFocusConfirmButon={false}
      confirmLabel="Done"
      handleConfirm={submitCallback}
      handleClose={handleClose}
      onExited={onExitedCallback}
    >
      <form onSubmit={submitCallback} ref={formRef}>
        <Input
          autoFocus
          className="filled bottom-border"
          defaultValue={defaultValue}
          error={error}
          name={INPUT_NAME}
          placeholder="Enter name"
        />
        <div className="form-modal-error-message">{error && errorMsg}</div>
      </form>
    </Modal>
  );
}
