import React, { ReactNode } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { SlideProps } from '@material-ui/core/Slide';
import { IconButton } from '../IconButton';
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

const Transition = React.forwardRef<unknown, SlideProps>((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

const backdropProps = {
  open: false
};

const paperClasses = { paper: 'fullscreen-dialog-paper' };

export function FullScreenDialog({
  children,
  onClose,
  headerComponents,
  ...props
}: FullScreenDialogProps) {
  return (
    <Dialog
      {...props}
      fullScreen
      BackdropProps={backdropProps}
      classes={paperClasses}
      onClose={onClose}
      transitionDuration={FULLSCREEN_DIALOG_TRANSITION}
      TransitionComponent={Transition}
    >
      <div className="fullscreen-diaglog-header">
        {headerComponents}
        <IconButton tooltip="Close task" icon={CloseIcon} onClick={onClose} />
      </div>
      <div className="fullscreen-dialog-content">
        <div className="fullscreen-dialog-inner-content">{children}</div>
      </div>
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
