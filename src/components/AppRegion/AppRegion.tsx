import React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '../Mui';
import { titleBarSelector } from '../../store';
import Close from '@material-ui/icons/Close';

const { close } = window.getCurrentWindow();

export function AppRegion() {
  const titleBar = useSelector(titleBarSelector);

  return (
    <div className="app-region">
      {window.platform === 'darwin' ? (
        <div className="app-region-drag" />
      ) : titleBar === 'simple' ? (
        <div className="simple-title-bar">
          {/* should not pass `close` function directly into `onClick` props */}
          <IconButton icon={Close} onClick={() => close()} />
        </div>
      ) : null}
    </div>
  );
}
