import React, { useMemo, ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import mergeWith from 'lodash/mergeWith';

export interface ConfirmDialogProps extends DialogProps {
  title?: string;
  confirmLabel: string;
  open: boolean;
  children?: ReactNode;
  onClose(): void;
  onConfirm(): any;
  autoFocusConfirmButon?: boolean;
}

const backdropProps = { classes: { root: 'mui-menu-backdrop' } };

export function ConfirmDialog({
  title,
  confirmLabel,
  children,
  onClose,
  onConfirm,
  autoFocusConfirmButon = true,
  classes,
  ...props
}: ConfirmDialogProps) {
  const mergedClasses = useMemo<ConfirmDialogProps['classes']>(
    () =>
      mergeWith(
        { root: 'mui-dialog', paper: 'mui-dialog-paper' },
        classes,
        (a, b) => a + ' ' + b
      ),
    [classes]
  );

  return (
    <Dialog
      {...props}
      onClose={onClose}
      classes={mergedClasses}
      BackdropProps={backdropProps}
    >
      <div className="dialog-scroll-content">
        <div className="dialog-title">{title}</div>
        <div className="dialog-content">{children}</div>
        <div className="dialog-actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => onConfirm() !== false && onClose()}
            autoFocus={autoFocusConfirmButon}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
