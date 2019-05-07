import { useEffect } from 'react';
import hotkeys, { KeyHandler } from 'hotkeys-js';

hotkeys.filter = () => true;

export function useHotkeys(key: string, method: KeyHandler, focused: boolean) {
  useEffect(() => {
    if (focused) {
      hotkeys(key, method);
      return () => {
        hotkeys.unbind(key, method);
      };
    }
  }, [focused, key, method]);
}
