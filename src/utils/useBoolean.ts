import { useState, useCallback } from 'react';

type Props = [
  boolean,
  {
    on(): void;
    off(): void;
    toogle(): void;
  }
];

export function useBoolean(initialState: boolean = false): Props {
  const [flag, setFlag] = useState(initialState);

  return [
    flag,
    {
      on: () => setFlag(true),
      off: () => setFlag(false),
      toogle: useCallback(() => setFlag(!flag), [flag])
    }
  ];
}
