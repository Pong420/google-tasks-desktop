import React from 'react';
import { FullScreenDialog } from '../Mui/Dialog/FullScreenDialog';
import { Control } from '../../utils/form';

export function ThemeSelector({ value, onChange }: Control<Theme>) {
  const handleChange = onChange || (() => {});
  return (
    <FullScreenDialog.Row>
      <div className="preferences-label">Theme</div>
      <div className="preferences-theme-selector">
        <div className="preferences-theme light">
          <div onClick={() => handleChange('light')} />
        </div>
        <div className="preferences-theme dark">
          <div onClick={() => handleChange('dark')} />
        </div>
      </div>
    </FullScreenDialog.Row>
  );
}
