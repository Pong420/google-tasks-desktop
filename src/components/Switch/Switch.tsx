import React, { useState, useEffect } from 'react';

interface Props {
  checked?: boolean;
  onChange?(checked: boolean): void;
  width?: number;
}

export function Switch({ checked = false, width, onChange }: Props) {
  const [isChecked, setChecked] = useState(checked);

  useEffect(() => {
    onChange && onChange(isChecked);
  }, [onChange, isChecked]);

  return (
    <div
      className={`switch ${isChecked ? 'checked' : ''}`.trim()}
      onClick={() => setChecked(!isChecked)}
      style={{ width }}
    >
      <div className="switch-bar" />
      <div className="switch-icon" />
    </div>
  );
}
