import React, { ReactNode } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { IconButton } from '../IconButton';
import { ScrollContent } from '../../ScrollContent';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';

export interface FullScreenDialogProps extends DialogProps {
  headerComponents?: ReactNode;
  onClose(): void;
}

interface ContainerProps {
  children?: ReactNode;
}

export const FULLSCREEN_DIALOG_TRANSITION = 300;

const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

const backdropProps = {
  open: false
};

const paperClasses = { paper: 'FullScreen-dialog-paper' };

export function FullScreenDialog({
  children,
  onClose,
  headerComponents,
  ...props
}: FullScreenDialogProps) {
  return (
    <Dialog
      {...props}
      BackdropProps={backdropProps}
      classes={paperClasses}
      fullScreen
      onClose={onClose}
      transitionDuration={FULLSCREEN_DIALOG_TRANSITION}
      TransitionComponent={Transition}
    >
      <div className="FullScreen-diaglog-header">
        {headerComponents}
        <IconButton tooltip="Close task" icon={CloseIcon} onClick={onClose} />
      </div>
      <div className="FullScreen-dialog-content">
        <ScrollContent>{children}</ScrollContent>
      </div>
    </Dialog>
  );
}

FullScreenDialog.Section = ({ children }: ContainerProps) => {
  return <div className="FullScreen-dialog-section">{children}</div>;
};

FullScreenDialog.Title = ({ children }: ContainerProps) => {
  return <div className="FullScreen-dialog-section-title">{children}</div>;
};

FullScreenDialog.Row = ({ children }: ContainerProps) => {
  return <div className="FullScreen-dialog-row">{children}</div>;
};

export default FullScreenDialog;
