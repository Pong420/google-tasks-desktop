import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import {
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui/Dialog/FullScreenDialog';
import { Input } from '../Mui/Input';
import { Switch } from '../Switch';
import { RootState, usePreferenceActions } from '../../store';

const accentColors: ACCENT_COLOR[] = [
  'blue',
  'purple',
  'red',
  'amber',
  'green',
  'grey'
];

const normalizeNumber = (value: string) => {
  const num = Number(value);
  return value === '' ||
    value === '-0' ||
    isNaN(num) ||
    /^0\d+/.test(value) ||
    /\.(0+)?$/.test(value)
    ? String(value)
    : num;
};

export function Preferences(props: FullScreenDialogProps) {
  const {
    setInactiveHour,
    toggleSync,
    toggleSyncOnReconnection
  } = usePreferenceActions();
  const { sync } = useSelector((state: RootState) => state.preferences);

  return (
    <FullScreenDialog {...props} className="preferences">
      <h4>Preferences</h4>

      <FullScreenDialog.Section>
        <FullScreenDialog.Title children="General" />
        <FullScreenDialog.Row>
          <div className="preferences-label">Appearance</div>
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
          <div className="preferences-label">Accent color</div>
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
        <FullScreenDialog.Title children="Synchronization" />

        <FullScreenDialog.Row>
          <div className="preferences-label">Enable synchronization</div>
          <div className="preferences-switch">
            <Switch checked={sync.enabled} onChange={toggleSync} />
          </div>
        </FullScreenDialog.Row>

        {sync.enabled && (
          <>
            <FullScreenDialog.Row>
              <div className="preferences-label">Sync on reconnection</div>
              <div className="preferences-hours">
                <Switch
                  checked={sync.reconnection}
                  onChange={toggleSyncOnReconnection}
                />
              </div>
            </FullScreenDialog.Row>

            <FullScreenDialog.Row>
              <div className="preferences-label">Sync after inactive</div>
              <div className="preferences-hours">
                <Input
                  className="filled"
                  value={sync.inactiveHours}
                  onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                    const normalized = normalizeNumber(evt.target.value);
                    const value = Number(normalized);
                    if (!isNaN(value)) {
                      setInactiveHour(value);
                    }
                  }}
                />
                Hours
              </div>
            </FullScreenDialog.Row>
          </>
        )}
      </FullScreenDialog.Section>

      <FullScreenDialog.Section>
        <FullScreenDialog.Title children="Storage ( Read-Only )" />
        <FullScreenDialog.Row>
          <div className="preferences-label">Path</div>
          <Input value={window.STORAGE_DIRECTORY} readOnly className="filled" />
        </FullScreenDialog.Row>
      </FullScreenDialog.Section>
    </FullScreenDialog>
  );
}
