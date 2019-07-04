import React, { useMemo, useCallback, CSSProperties } from 'react';
import { classes } from '../../utils/classes';

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
        className={classes('switch', checked && 'checked')}
        onClick={onClick}
        style={style}
      >
        <div className="switch-bar" />
        <div className="switch-icon" />
      </div>
    );
  }
);
