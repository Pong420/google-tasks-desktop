import React from 'react';
import { IconButton } from '../Mui';
import Close from '@material-ui/icons/Close';

const { close } = window.getCurrentWindow();

export function AppRegion() {
  return (
    <div className="app-region">
      <div className="simple-title-bar">
        {/* should not pass `close` function directly into `onClick` props */}
        <IconButton icon={Close} onClick={() => close()} />
      </div>
    </div>
  );
}
