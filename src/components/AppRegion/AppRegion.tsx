import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '../Mui';
import { titleBarSelector } from '../../store';
import { WindowsTitleBar } from './WindowsTitleBar';
import Close from '@material-ui/icons/Close';

const { close } = window.getCurrentWindow();

export function AppRegion() {
  const titleBar = useSelector(titleBarSelector);
  let content: ReactNode = null;

  if (window.platform === 'darwin') {
    content = <div className="app-region-drag" />;
  } else if (titleBar === 'simple') {
    content = (
      <div className="simple-title-bar">
        {/* should not pass `close` function directly into `onClick` props */}
        <IconButton icon={Close} onClick={() => close()} />
      </div>
    );
  } else {
    // native
    if (window.platform === 'win32') {
      content = <WindowsTitleBar />;
    }
  }

  return <div className="app-region">{content}</div>;
}
