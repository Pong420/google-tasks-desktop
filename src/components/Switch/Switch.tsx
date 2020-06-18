import React, { useMemo, useCallback, CSSProperties } from 'react';

interface Props {
  checked?: boolean;
  onChange?(checked: boolean): void;
  width?: number;
}

export const Switch = React.memo<Props>(
  ({ checked = false, width, onChange }) => {
    const style = useMemo<CSSProperties>(() => ({ width }), [width]);

    const onClick = useCallback(() => {
      onChange && onChange(!checked);
    }, [onChange, checked]);

    return (
      <div
        className={['switch', checked && 'checked'].filter(Boolean).join(' ')}
        onClick={onClick}
        style={style}
      >
        <div className="switch-bar" />
        <div className="switch-icon" />
      </div>
    );
  }
);
