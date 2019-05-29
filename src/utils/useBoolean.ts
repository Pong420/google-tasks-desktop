import { useState, useCallback } from 'react';

type Props = [
  boolean,
  {
    on(): void;
    off(): void;
    toggle(): void;
  }
];

export function useBoolean(initialState: boolean = false): Props {
  const [flag, setFlag] = useState(initialState);
  const on = useCallback(() => setFlag(true), [setFlag]);
  const off = useCallback(() => setFlag(false), [setFlag]);
  const toggle = useCallback(() => setFlag(!flag), [setFlag, flag]);

  return [flag, { on, off, toggle }];
}
