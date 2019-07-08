import { useState, ChangeEvent } from 'react';

export function useInput(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    setValue(evt.currentTarget.value);
  }

  return { value, onChange: handleChange };
}
