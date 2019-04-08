import React, {
  useState,
  useCallback,
  KeyboardEvent,
  ChangeEvent
} from 'react';
import { Input } from './Input';

interface Props {
  onSubmit(title: string): void;
}

export function NewTask({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const onKeyDown = useCallback(
    ({ which }: KeyboardEvent<HTMLInputElement>) => {
      if (which === 13) {
        onSubmit(title);
        setTitle('');
      }
    },
    [onSubmit, title]
  );

  return (
    <Input
      className="new-task"
      onKeyDown={onKeyDown}
      value={title}
      onChange={(evt: ChangeEvent<HTMLInputElement>) =>
        setTitle(evt.target.value)
      }
    />
  );
}
