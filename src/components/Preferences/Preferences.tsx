import React from 'react';
import {
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui/FullScreenDialog';
import { Input } from '../Mui/Input';
import { TOKEN_PATH, OAUTH2_KEYS_PATH } from '../../constants';

const accentColors: ACCENT_COLOR[] = [
  'blue',
  'purple',
  'red',
  'amber',
  'green',
  'grey'
];

export function Preferences({ ...props }: FullScreenDialogProps) {
  return (
    <FullScreenDialog className="preferences" {...props}>
      <h4>Preferences</h4>

      <FullScreenDialog.Section>
        <FullScreenDialog.Title children="General" />
        <FullScreenDialog.Row>
          <div className="preferences-label">Appearance:</div>
          <div className="preferences-theme-selector">
            <div className="preferences-theme light">
              <div onClick={() => window.__setTheme('light')} />
            </div>
            <div className="preferences-theme dark">
              <div onClick={() => window.__setTheme('dark')} />
            </div>
          </div>
        </FullScreenDialog.Row>
        <FullScreenDialog.Row>
          <div className="preferences-label">Accent color:</div>
          <div className="preferences-accent-color-selector">
            {accentColors.map((color, index) => (
              <div
                key={index}
                className={color}
                onClick={() => window.__setAccentColor(color)}
              />
            ))}
          </div>
        </FullScreenDialog.Row>
      </FullScreenDialog.Section>

      <FullScreenDialog.Section>
        <FullScreenDialog.Title children="Storage ( Read-Only )" />
        <FullScreenDialog.Row>
          <div className="preferences-label">OAuth Keys Path:</div>
          <Input value={OAUTH2_KEYS_PATH} readOnly className="filled" />
        </FullScreenDialog.Row>
        <FullScreenDialog.Row>
          <div className="preferences-label">Token Path:</div>
          <Input value={TOKEN_PATH} readOnly className="filled" />
        </FullScreenDialog.Row>
      </FullScreenDialog.Section>
    </FullScreenDialog>
  );
}
