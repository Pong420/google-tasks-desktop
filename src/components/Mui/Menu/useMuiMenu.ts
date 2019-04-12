import {
  useState,
  useCallback,
  useEffect,
  SyntheticEvent,
  MouseEvent
} from 'react';
import { MenuProps } from '@material-ui/core/Menu';

export type AnchorEl = HTMLElement | null;
export type AnchorPosition = MenuProps['anchorPosition'];

export function useMuiMenu() {
  const [anchorEl, setAnchorEl] = useState<AnchorEl>(null);
  const [anchorPosition, setAnchorPosition] = useState<AnchorPosition>();
  const onClose = useCallback(() => {
    setAnchorEl(null);
    setAnchorPosition(undefined);
  }, []);

  useEffect(() => {
    setAnchorEl(anchorEl);
  }, [anchorEl]);

  useEffect(() => {
    setAnchorPosition(anchorPosition);
  }, [anchorPosition]);

  return {
    anchorEl,
    anchorPosition,
    setAnchorEl(evt: SyntheticEvent<HTMLElement>) {
      setAnchorEl(evt.currentTarget);
    },
    setAnchorPosition(evt: MouseEvent<HTMLElement>) {
      evt.preventDefault();
      setAnchorPosition({
        top: evt.pageY,
        left: evt.pageY
      });
    },
    onClose
  };
}
