import React, { ReactNode } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { IconButton } from '../../Mui/IconButton';

export interface FullScreenDialogProps extends DialogProps {
  className?: string;
  children?: ReactNode;
  open: boolean;
  handleClose(): void;
  headerComponents?: ReactNode;
}

interface ContainerProps {
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
  headerComponents,
  ...props
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
      {...props}
    >
      <div className="fullscreen-diaglog-header">
        {headerComponents}
        <IconButton
          tooltip="Close task"
          icon={CloseIcon}
          onClick={handleClose}
        />
      </div>
      <div className="fullscreen-dialog-content">{children}</div>
    </Dialog>
  );
}

FullScreenDialog.Section = ({ children }: ContainerProps) => {
  return <div className="fullscreen-dialog-section">{children}</div>;
};

FullScreenDialog.Title = ({ children }: ContainerProps) => {
  return <div className="fullscreen-dialog-section-title">{children}</div>;
};

FullScreenDialog.Row = ({ children }: ContainerProps) => {
  return <div className="fullscreen-dialog-row">{children}</div>;
};

export default FullScreenDialog;
