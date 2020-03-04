import { useBoolean } from '../../../../hooks/useBoolean';
import { useMouseTrap } from '../../../../hooks/useMouseTrap';
import { useMemo } from 'react';

export function useFocusTask(el: HTMLElement | null) {
  const [focused, onFocus, onBlur] = useBoolean();
  const { focus, focusPrev, focusNext } = useMemo(() => {
    const input = el && el.querySelector<HTMLTextAreaElement>('textarea');

    const handler = (
      type: 'start' | 'end',
      getInput: () => HTMLTextAreaElement | null
    ) => () => {
      if (input) {
        const { selectionStart, selectionEnd, value } = input;
        const notHightlighted = selectionStart === selectionEnd;
        const shouldFocusPrev = type === 'start' && selectionStart === 0;
        const shouldFocusNext =
          type === 'end' && selectionStart === value.length;
        const toInput = getInput();

        setTimeout(() => {
          if (
            toInput &&
            notHightlighted &&
            (shouldFocusPrev || shouldFocusNext)
          ) {
            const length = toInput.value.length;
            toInput.focus();
            toInput.setSelectionRange(length, length);
          }
        }, 0);
      }
    };

    return {
      focus: () => input && input.focus(),
      focusPrev: handler(
        'start',
        () =>
          el &&
          el.previousElementSibling &&
          el.previousElementSibling.querySelector<HTMLTextAreaElement>(
            'textarea'
          )
      ),
      focusNext: handler(
        'end',
        () =>
          el &&
          el.nextElementSibling &&
          el.nextElementSibling.querySelector<HTMLTextAreaElement>('textarea')
      )
    };
  }, [el]);

  useMouseTrap(focused ? 'up' : '', focusPrev, false);
  useMouseTrap(focused ? 'down' : '', focusNext, false);

  return { focused, focus, focusPrev, focusNext, onFocus, onBlur };
}
