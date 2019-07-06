import React, { useMemo, useCallback, ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { ScrollContent } from '../../ScrollContent';
import mergeWith from 'lodash.mergewith';

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
  const handleConfirm = useCallback(() => {
    if (onConfirm() !== false) {
      onClose();
    }
  }, [onClose, onConfirm]);

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
      onClose={onClose}
      classes={mergedClasses}
      BackdropProps={backdropProps}
      {...props}
    >
      <ScrollContent className="dialog-scroll-content">
        <div className="dialog-title">{title}</div>
        <div className="dialog-content">{children}</div>
        <div className="dialog-actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus={autoFocusConfirmButon}>
            {confirmLabel}
          </Button>
        </div>
      </ScrollContent>
    </Dialog>
  );
}
