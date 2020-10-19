import React from 'react';
import { FullScreenDialog } from '../Mui/Dialog/FullScreenDialog';
import { Control } from '../../utils/form';

const accentColors: AccentColor[] = [
  'blue',
  'purple',
  'red',
  'amber',
  'green',
  'grey'
];

export function AccentColor({ onChange }: Control) {
  return (
    <FullScreenDialog.Row>
      <div className="preferences-label">Accent color</div>
      <div className="preferences-accent-color-selector">
        {accentColors.map((color, index) => (
          <div
            key={index}
            className={color}
            onClick={() => onChange && onChange(color)}
          />
        ))}
      </div>
    </FullScreenDialog.Row>
  );
}
