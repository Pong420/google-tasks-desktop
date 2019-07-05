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

function instanceOfAnchorEl(object: any): object is AnchorEl {
  return object === null || object instanceof HTMLElement;
}

function instanceOfAnchorPosition(object: any): object is AnchorPosition {
  return typeof object === 'undefined' || (object.top && object.left);
}

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
    (props: SyntheticEvent<HTMLElement> | AnchorEl) => {
      if (instanceOfAnchorEl(props)) {
        setAnchorEl(props);
      } else {
        setAnchorEl(props.currentTarget);
      }
    },
    []
  );

  const setAnchorPositionCallback = useCallback(
    (props: MouseEvent<HTMLElement> | AnchorPosition) => {
      if (instanceOfAnchorPosition(props)) {
        setAnchorPosition(props);
      } else {
        const evt = props;
        evt && evt.preventDefault();
        setAnchorPosition({
          top: evt.pageY,
          left: evt.pageX
        });
      }
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
