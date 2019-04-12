import React, { ReactNode } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import CloseIcon from '@material-ui/icons/Close';
import { TransitionProps } from '@material-ui/core/transitions/transition';

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

function DeleteIcon() {
  return (
    <SvgIcon>
      <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z" />
      <path d="M9 8h2v9H9zm4 0h2v9h-2z" />
    </SvgIcon>
  );
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
