import React from 'react';
import {
  FullScreenDialog,
  FullScreenDialogProps
} from '../Mui/FullScreenDialog';
import shortcuts from './shortcuts.json';

interface Props extends FullScreenDialogProps {
  temp?: string;
}

export function KeyboardShortcuts({ ...props }: Props) {
  return (
    <FullScreenDialog {...props} className="keyboard-shortcuts">
      <h4>Keyboard shortcuts</h4>
      <div className="keyboard-shortcuts-content">
        {Object.entries(shortcuts).map(([type, rows]) => {
          return (
            <div className="keyboard-shortcuts-section" key={type}>
              <div className="keyboard-shortcuts-type">{type}</div>
              {rows.map(({ label, key }, index) => {
                return (
                  <div className="keyboard-shortcuts-row" key={index}>
                    <div className="keyboard-shortcuts-label">{label}</div>
                    <div className="keyboard-shortcuts-keys">{key}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </FullScreenDialog>
  );
}
