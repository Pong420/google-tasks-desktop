import React from 'react';
import {
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui/FullScreenDialog';
import shortcuts from './shortcuts.json';

interface Props extends FullScreenDialogProps {
  temp?: string;
}

function replaceKeyName(str: string) {
  switch (process.platform) {
    case 'darwin':
      return str.replace('Alt', '⌥');

    default:
      return str;
  }
}

export function KeyboardShortcuts({ ...props }: Props) {
  return (
    <FullScreenDialog {...props} className="keyboard-shortcuts">
      <h4>Keyboard shortcuts</h4>
      <div className="keyboard-shortcuts-content">
        {Object.entries(shortcuts).map(([type, rows]) => {
          return (
            <FullScreenDialog.Section key={type}>
              <FullScreenDialog.Title children={type} />
              {rows.map(({ label, key }, index) => {
                return (
                  <FullScreenDialog.Row key={index}>
                    <div className="keyboard-shortcuts-label">{label}</div>
                    <div className="keyboard-shortcuts-key">
                      {replaceKeyName(key)}
                    </div>
                  </FullScreenDialog.Row>
                );
              })}
            </FullScreenDialog.Section>
          );
        })}
      </div>
    </FullScreenDialog>
  );
}
