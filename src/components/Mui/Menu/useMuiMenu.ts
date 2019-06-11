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

  const setAnchorElCallback = useCallback(
    (evt: SyntheticEvent<HTMLElement>) => {
      setAnchorEl(evt.currentTarget);
    },
    []
  );

  const setAnchorPositionCallback = useCallback(
    (evt: MouseEvent<HTMLElement>) => {
      evt.preventDefault();
      setAnchorPosition({
        top: evt.pageY,
        left: evt.pageX
      });
    },
    []
  );

  return {
    anchorEl,
    anchorPosition,
    setAnchorEl: setAnchorElCallback,
    setAnchorPosition: setAnchorPositionCallback,
    onClose
  };
}
