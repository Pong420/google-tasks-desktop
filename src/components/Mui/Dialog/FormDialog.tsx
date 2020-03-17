import React, { useCallback, useState, useRef, FormEvent } from 'react';
import { ConfirmDialog, ConfirmDialogProps } from './ConfirmDialog';
import { Input } from '../Input';

interface Props extends Omit<ConfirmDialogProps, 'onConfirm' | 'confirmLabel'> {
  defaultValue?: string;
  errorMsg?: string;
  onConfirm(payload: string): void;
}

const INPUT_NAME = 'NAME';

export function FormDialog({
  defaultValue = '',
  errorMsg,
  onClose,
  onConfirm,
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
          onConfirm(trimedValue);
          onClose();
        }
      }
    },
    [onClose, onConfirm, defaultValue]
  );

  const onExitedCallback = useCallback(() => {
    setError(false);
  }, []);

  return (
    <ConfirmDialog
      {...props}
      autoFocusConfirmButon={false}
      confirmLabel="Done"
      onConfirm={submitCallback}
      onClose={onClose}
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
        <div className="form-dialog-error-message">{error && errorMsg}</div>
      </form>
    </ConfirmDialog>
  );
}
