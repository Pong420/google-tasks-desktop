import { useState, ChangeEvent, useCallback } from 'react';

export function useInput(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.currentTarget.value);
  }, []);

  return { value, onChange: handleChange };
}
