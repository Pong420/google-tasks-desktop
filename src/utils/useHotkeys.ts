import { useEffect, useCallback } from 'react';
import hotkeys, { KeyHandler } from 'hotkeys-js';

hotkeys.filter = () => true;

export function useHotkeys(
  key: string,
  method: KeyHandler,
  focused: boolean,
  preventDefault: boolean = true
) {
  const withPreventDefault = useCallback<KeyHandler>(
    (evt, hotkeys) => {
      method(evt, hotkeys);
      preventDefault && evt.preventDefault();
    },
    [method, preventDefault]
  );

  useEffect(() => {
    if (focused) {
      hotkeys(key, withPreventDefault);
      return () => {
        hotkeys.unbind(key, withPreventDefault);
      };
    }
  }, [focused, key, withPreventDefault]);
}
