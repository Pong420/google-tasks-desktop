import { useState, useCallback, useEffect, SyntheticEvent } from 'react';
import { MenuProps } from '@material-ui/core/Menu';

type AnchorEl = HTMLElement | null;

export function useMuiMenu(anchorEl_: AnchorEl) {
  const [anchorEl, setAnchorEl] = useState<AnchorEl>(null);
  const onClose = useCallback(() => setAnchorEl(null), []);

  useEffect(() => {
    setAnchorEl(anchorEl_);
  }, [anchorEl_]);

  return {
    anchorEl,
    onClose,
    setAnchorEl(evt: SyntheticEvent<HTMLElement>) {
      setAnchorEl(evt.currentTarget);
    }
  };
}
