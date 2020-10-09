import React from 'react';
import { FullScreenDialog } from '../Mui/Dialog/FullScreenDialog';

export function ThemeSelector() {
  return (
    <FullScreenDialog.Row>
      <div className="preferences-label">Theme</div>
      <div className="preferences-theme-selector">
        <div className="preferences-theme light">
          <div onClick={() => window.__setTheme('light')} />
        </div>
        <div className="preferences-theme dark">
          <div onClick={() => window.__setTheme('dark')} />
        </div>
      </div>
    </FullScreenDialog.Row>
  );
}
