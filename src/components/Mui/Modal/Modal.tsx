import React, { useMemo, useCallback, ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { ScrollContent } from '../../ScrollContent';
import mergeWith from 'lodash.mergewith';

export interface ModalProps extends DialogProps {
  title?: string;
  confirmLabel: string;
  open: boolean;
  children?: ReactNode;
  handleClose(): void;
  handleConfirm(): any;
  autoFocusConfirmButon?: boolean;
}

const backdropProps = { classes: { root: 'mui-menu-backdrop' } };

export function Modal({
  title,
  confirmLabel,
  open,
  children,
  handleClose,
  handleConfirm,
  autoFocusConfirmButon = true,
  classes,
  ...props
}: ModalProps) {
  const confirm = useCallback(() => {
    if (handleConfirm() !== false) {
      handleClose();
    }
  }, [handleClose, handleConfirm]);

  const mergedClasses = useMemo(
    () =>
      mergeWith(
        { root: 'mui-modal', paper: 'mui-modal-paper' },
        classes,
        (a, b) => a + ' ' + b
      ),
    [classes]
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={mergedClasses}
      BackdropProps={backdropProps}
      {...props}
    >
      {/* TODO: check div */}
      <div>
        <ScrollContent className="modal-scroll-content">
          <div className="modal-title">{title}</div>
          <div className="modal-content">{children}</div>
          <div className="modal-actions">
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={confirm} autoFocus={autoFocusConfirmButon}>
              {confirmLabel}
            </Button>
          </div>
        </ScrollContent>
      </div>
    </Dialog>
  );
}
