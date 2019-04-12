import React, { useCallback, ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

export interface ModalProps {
  title: string;
  open: boolean;
  children?: ReactNode;
  handleClose(): void;
  handleConfirm(): void;
}

export function Modal({
  title,
  open,
  children,
  handleClose,
  handleConfirm
}: ModalProps) {
  const confirm = useCallback(() => {
    handleConfirm();
    handleClose();
  }, [handleClose, handleConfirm]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ root: 'mui-modal', paper: 'mui-modal-paper' }}
    >
      <div className="modal-title">{title}</div>
      <div className="modal-content">{children}</div>
      <div className="modal-actions">
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={confirm} color="secondary">
          Done
        </Button>
      </div>
    </Dialog>
  );
}
