import React, { useState, useEffect } from 'react';
import {
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui/FullScreenDialog';
import { Input } from '../Mui/Input';
import { TOKEN_PATH } from '../../constants';

export function Preferences({ ...props }: FullScreenDialogProps) {
  const [theme, setTheme] = useState<THEME>(
    document.documentElement.getAttribute('data-theme') as THEME
  );

  useEffect(() => {
    window.__setTheme(theme);
  }, [theme]);

  return (
    <FullScreenDialog className="preferences" {...props}>
      <h4>Preferences</h4>
      <FullScreenDialog.Section>
        <FullScreenDialog.Title children="General" />
        <FullScreenDialog.Row>
          <div className="preferences-label">Appearance:</div>
          <div className="preferences-theme-selector">
            <div className="preferences-theme light">
              <div
                className={theme === 'light' ? 'selected' : ''}
                onClick={() => setTheme('light')}
              />
            </div>
            <div className="preferences-theme dark">
              <div
                className={theme === 'dark' ? 'selected' : ''}
                onClick={() => setTheme('dark')}
              />
            </div>
          </div>
        </FullScreenDialog.Row>
      </FullScreenDialog.Section>
      <FullScreenDialog.Section>
        <FullScreenDialog.Title children="Storage ( Read-Only )" />
        <FullScreenDialog.Row>
          <div className="preferences-label">Token Path:</div>
          <Input value={TOKEN_PATH} readOnly className="filled" />
        </FullScreenDialog.Row>
      </FullScreenDialog.Section>
    </FullScreenDialog>
  );
}
