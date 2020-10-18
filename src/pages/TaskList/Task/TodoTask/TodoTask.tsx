import React, {
  useRef,
  useMemo,
  useEffect,
  MouseEvent,
  KeyboardEvent
} from 'react';
import { useSelector } from 'react-redux';
import { Task, TaskProps } from '../Task';
import { useTodoTaskDetails, EditTaskButton } from '../TodoTaskDetails';
import { useDateTimeDialog } from '../DateTimeDialog';
import { useTodoTaskMenu } from './TodoTaskMenu';
import {
  focusedSelector,
  useTaskActions,
  todoTaskSelector,
  getDateLabel
} from '../../../../store';
import { useMouseTrap } from '../../../../hooks/useMouseTrap';
import { Schema$Task } from '../../../../typings';

export interface TodoTaskProps extends TaskProps {
  index: number;
  inherit?: (keyof Schema$Task)[];
  prevDue?: string | null;
  sortByDate?: boolean;
  prevIndex?: number;
  nextIndex?: number;
}

export const TodoTask = React.memo(
  ({
    uuid,
    index,
    className,
    inherit,
    prevDue,
    sortByDate,
    prevIndex = index - 1,
    nextIndex = index + 1,
    ...props
  }: TodoTaskProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const {
      createTask,
      deleteTask,
      update: updateTask,
      moveTask,
      setFocus
    } = useTaskActions();

    const focused = useSelector(focusedSelector(uuid));

    const { title, due } = useSelector(todoTaskSelector(uuid)) || {};

    const { onDelete, moveTaskUp, moveTaskDown, ...handler } = useMemo(() => {
      return {
        moveTaskUp: () => moveTask({ uuid, from: index, to: index - 1 }),
        moveTaskDown: () => moveTask({ uuid, from: index, to: index + 1 }),
        onDelete: () => deleteTask({ uuid }),
        // prevent focused task trigger `onBlur` event
        onMouseDown: (event: MouseEvent<HTMLElement>) => {
          !(event.target instanceof HTMLTextAreaElement) &&
            event.preventDefault();
        },
        onClick: (event: MouseEvent<HTMLElement>) => {
          event.currentTarget
            .querySelector<HTMLTextAreaElement>('textarea')!
            .focus();
        },
        onBlur: () => {
          // reduce unnecessary `FOCUS_TASK` action
          setTimeout(() => {
            const el =
              document.activeElement?.parentElement?.parentElement
                ?.parentElement?.parentElement;
            (!el || !el.classList.contains('task')) && setFocus(null);
          }, 0);
        },
        onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
          const input = event.currentTarget;

          if (event.key === 'Enter') {
            event.preventDefault();
            createTask({
              prevTask: uuid,
              inherit: inherit && { uuid, keys: inherit }
            });
          }

          if (event.key === 'Backspace' && !input.value.trim()) {
            event.preventDefault();
            deleteTask({ uuid, prevTaskIndex: index - 1 });
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

            const to = event.key === 'ArrowUp' ? prevIndex : nextIndex;

            if (notHightlighted && (shouldFocusPrev || shouldFocusNext)) {
              event.preventDefault();
              setFocus(to);
            }
          }
        }
      };
    }, [
      uuid,
      index,
      createTask,
      deleteTask,
      moveTask,
      setFocus,
      inherit,
      prevIndex,
      nextIndex
    ]);

    const { updateDue, moveDownByDate, moveUpByDate } = useMemo(() => {
      // const now = new Date();
      const date = due ? new Date(due) : null;
      const updateDue = (date?: Date) => {
        date && updateTask({ uuid, due: date.toISODateString() });
      };

      const moveDownByDate = () => {
        const now = new Date();
        const label = getDateLabel(due, now);
        let newDate: Date | null = null;
        if (label === 'Past') newDate = now;
        else if (label !== 'No date') newDate = date!.addDays(1);

        newDate && updateDue(newDate);
      };

      const moveUpByDate = () => {
        const now = new Date();
        const label = getDateLabel(due, now);
        let newDate: Date | null = null;
        if (label === 'No date') newDate = prevDue ? new Date(prevDue) : now;
        else if (label !== 'Past' && label !== 'Today')
          newDate = date!.addDays(-1);

        newDate && updateDue(newDate);
      };

      return { updateDue, moveUpByDate, moveDownByDate };
    }, [uuid, due, prevDue, updateTask]);

    const { openDateTimeDialog: _openDateTimeDialog } = useDateTimeDialog();
    const openDateTimeDialog = () =>
      _openDateTimeDialog({
        date: due ? new Date(due) : undefined,
        onConfirm: updateDue
      });

    const { openTodoTaskDetails: _openTodoTaskDetails } = useTodoTaskDetails();
    const openTodoTaskDetails = () =>
      _openTodoTaskDetails({ openDateTimeDialog, uuid });

    const { openTodoTaskMenu: _openTodoTaskMenu } = useTodoTaskMenu();
    const openTodoTaskMenu = (event: MouseEvent<HTMLElement>) =>
      _openTodoTaskMenu({
        event,
        uuid,
        onDelete,
        openDateTimeDialog,
        moveToAnotherList: () =>
          _openTodoTaskDetails({
            taskListDropdownOpened: true,
            openDateTimeDialog,
            uuid
          })
      });

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

    useMouseTrap(focused ? 'shift+enter' : '', openTodoTaskDetails);
    useMouseTrap(
      focused ? 'option+up' : '',
      sortByDate ? moveUpByDate : moveTaskUp
    );
    useMouseTrap(
      focused ? 'option+down' : '',
      sortByDate ? moveDownByDate : moveTaskDown
    );

    return (
      <>
        <Task
          {...props}
          {...handler}
          ref={ref}
          uuid={uuid}
          value={title}
          isEmpty={!(title && title.trim())}
          onContextMenu={openTodoTaskMenu}
          onDueDateBtnClick={openDateTimeDialog}
          onFocus={() => !focused && setFocus(uuid)}
          onChange={event =>
            updateTask({ uuid, title: event.currentTarget.value })
          }
          className={['todo-task', focused ? 'focused' : '', className]
            .join(' ')
            .trim()}
          endAdornment={<EditTaskButton onClick={openTodoTaskDetails} />}
        />
      </>
    );
  }
);
