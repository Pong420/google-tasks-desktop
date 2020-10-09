import React from 'react';
import { FullScreenDialog } from '../Mui/Dialog/FullScreenDialog';

const accentColors: AccentColor[] = [
  'blue',
  'purple',
  'red',
  'amber',
  'green',
  'grey'
];

export function AccentColor() {
  return (
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
  );
}
