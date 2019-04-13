import React, { ReactNode } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { DeleteIcon } from '../DeleteIcon';

export interface FullScreenDialogProps {
  className?: string;
  open: boolean;
  handleClose(): void;
  onDelete?(): void;
  children?: ReactNode;
}

function Transition(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

export function FullScreenDialog({
  className = '',
  children,
  open,
  handleClose,
  onDelete
}: FullScreenDialogProps) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      className={className}
      classes={{ paper: 'fullscreen-dialog-paper' }}
      transitionDuration={300}
      BackdropProps={{
        open: false
      }}
    >
      <div className="fullscreen-diaglog-header">
        {onDelete && (
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        )}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="fullscreen-dialog-content">{children}</div>
    </Dialog>
  );
}

export default FullScreenDialog;
