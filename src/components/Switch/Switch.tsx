import React, { useState, useEffect, useMemo } from 'react';
import { classes } from '../../utils/classes';

interface Props {
  checked?: boolean;
  onChange?(checked: boolean): void;
  width?: number;
}

export function Switch({ checked = false, width, onChange }: Props) {
  const [isChecked, setChecked] = useState(checked);
  const style = useMemo(() => ({ width }), [width]);

  useEffect(() => {
    onChange && onChange(isChecked);
  }, [onChange, isChecked]);

  return (
    <div
      className={classes('switch', isChecked && 'checked')}
      onClick={() => setChecked(!isChecked)}
      style={style}
    >
      <div className="switch-bar" />
      <div className="switch-icon" />
    </div>
  );
}
