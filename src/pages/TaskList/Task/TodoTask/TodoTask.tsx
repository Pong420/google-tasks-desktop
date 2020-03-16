import React, { useRef, useMemo, useEffect, KeyboardEvent } from 'react';
import { Task, TaskProps } from '../Task';
import { useSelector } from 'react-redux';
import { focusedSelector, useTaskActions } from '../../../../store';

interface Props extends TaskProps {
  prev?: string;
  next?: string;
}

export const TodoTask = React.memo(({ uuid, prev, next, ...props }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { createTask, deleteTask, setFocus } = useTaskActions();
  const handler = useMemo(() => {
    return {
      onClick: () => setFocus(uuid),
      onBlur: () => {
        setTimeout(() => {
          document.activeElement === document.body && setFocus(null);
        }, 0);
      },
      onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
        const input = event.currentTarget;

        if (event.key === 'Enter') {
          event.preventDefault();
          createTask({ prevTask: uuid });
        }

        if (event.key === 'Backspace' && !input.value.trim()) {
          event.preventDefault();
          deleteTask({ uuid, prevTask: prev });
        }

        if (event.key === 'Escape') {
          input.blur();
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          const { selectionStart, selectionEnd, value } = input;
          const notHightlighted = selectionStart === selectionEnd;
          const shouldFocusPrev =
            event.key === 'ArrowUp' && selectionStart === 0;
          const shouldFocusNext =
            event.key === 'ArrowDown' && selectionStart === value.length;

          const to = event.key === 'ArrowUp' ? prev : next;

          if (notHightlighted && (shouldFocusPrev || shouldFocusNext) && to) {
            event.preventDefault();
            setFocus(to);
          }
        }
      }
    };
  }, [uuid, prev, next, createTask, deleteTask, setFocus]);

  const focused = useSelector(focusedSelector(uuid));

  useEffect(() => {
    const el = ref.current;
    const input = el && el.querySelector<HTMLTextAreaElement>('textarea');
    if (input && focused) {
      const { length } = input.value;
      input.focus();
      // make sure cursor place at end of textarea
      input.setSelectionRange(length, length);
    }
  }, [focused]);

  return (
    <Task
      {...props}
      {...handler}
      ref={ref}
      uuid={uuid}
      className={['todo-task', focused ? 'focused' : ''].join(' ').trim()}
    />
  );
});
