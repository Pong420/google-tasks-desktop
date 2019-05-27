import React from 'react';
import {
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui/FullScreenDialog';
import { Input } from '../Mui/Input';
import { STORAGE_DIRECTORY } from '../../constants';

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
        <FullScreenDialog.Title children="Storage Directory ( Read-Only )" />
        <FullScreenDialog.Row>
          <Input value={STORAGE_DIRECTORY} readOnly className="filled" />
        </FullScreenDialog.Row>
      </FullScreenDialog.Section>
    </FullScreenDialog>
  );
}
