import React, { useRef } from 'react';
import { Task, TaskProps } from '../Task';
import { useFocusTask } from './useFocusTask';

interface Props extends TaskProps {}

export function TodoTask(prosp: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { focus, focused, onFocus, onBlur } = useFocusTask(ref.current);

  return (
    <Task
      {...prosp}
      onClick={focus}
      onFocus={onFocus}
      onBlur={onBlur}
      className={['todo-task', focused ? 'focused' : ''].join(' ').trim()}
      ref={ref}
    />
  );
}
