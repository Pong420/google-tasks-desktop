import React, {
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  KeyboardEvent,
  MouseEvent,
  useEffect
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect, Omit } from 'react-redux';
import { Task } from '../Task';
import { classes } from '../../../utils/classes';
import { useMouseTrap } from '../../../utils/useMouseTrap';
import { RootState, TaskActionCreators } from '../../../store';
import { Schema$Task } from '../../../typings';

interface Props extends Pick<Schema$Task, 'uuid'> {}

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const index = state.task.todo.indexOf(ownProps.uuid);
  return {
    task: state.task.byIds[ownProps.uuid],
    focused: state.task.focused === ownProps.uuid,
    prevTask: state.task.todo[Math.max(0, index - 1)],
    nextTask: state.task.todo[Math.min(state.task.todo.length, index + 1)]
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

const disableMouseDown = (evt: MouseEvent<HTMLElement>) => evt.preventDefault();

export function TodoTaskComponent({
  task,
  focused,
  setFocused,
  prevTask,
  nextTask,
  newTask,
  deleteTask
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [onFocus, onBlur] = useMemo(
    () => [
      () => !focused && setFocused(task.uuid),
      () => focused && setFocused(null)
    ],
    [focused, setFocused, task.uuid]
  );

  const newTaskCallback = useCallback(() => {
    newTask({
      previousTask: { id: task.id, uuid: task.uuid }
    });
    return false;
  }, [newTask, task.id, task.uuid]);

  const deleteTaskCallback = useCallback(
    (args?: Omit<Parameters<typeof deleteTask>[0], 'id' | 'uuid'>) => {
      deleteTask({ id: task.id, uuid: task.uuid, ...args });
    },
    [deleteTask, task.id, task.uuid]
  );

  const [focusPrevTask, focusNextTask] = useMemo(() => {
    const handler = (type: 'start' | 'end', uuid?: string) => () => {
      const input = inputRef.current;
      if (input && focused) {
        const { selectionStart, selectionEnd, value } = input;
        const notHightlighted = selectionStart === selectionEnd;
        const shouldFocusPrev = type === 'start' && selectionStart === 0;
        const shouldFocusNext =
          type === 'end' && selectionStart === value.length;

        if (notHightlighted && uuid && (shouldFocusPrev || shouldFocusNext)) {
          setFocused(uuid);
        }
      }
    };

    return [handler('start', prevTask), handler('end', nextTask)];
  }, [prevTask, nextTask, focused, setFocused]);

  const onKeydownCallback = useCallback(
    (evt: KeyboardEvent<HTMLTextAreaElement>) => {
      if (evt.key === 'Backspace' && !evt.currentTarget.value.trim()) {
        deleteTaskCallback({ prevTask });
      }

      if (evt.key === 'Escape') {
        evt.currentTarget.blur();
      }
    },
    [deleteTaskCallback, prevTask]
  );

  useEffect(() => {
    const input = inputRef.current;
    if (input && focused) {
      if (document.activeElement !== input) {
        setTimeout(() => {
          const { length } = input.value;

          input.focus();
          // make sure cursor place at end of textarea
          input.setSelectionRange(length, length);
        }, 0);
      }
    }
  }, [focused]);

  useMouseTrap(inputRef, 'enter', newTaskCallback);
  useMouseTrap(inputRef, 'up', focusPrevTask);
  useMouseTrap(inputRef, 'down', focusNextTask);
  // useMouseTrap(inputRef, 'shift+enter', console.log);
  // useMouseTrap(inputRef, 'option+up', console.log);
  // useMouseTrap(inputRef, 'option+down', console.log);

  return (
    <Task
      className={classes(`todo-task`, focused && 'focused')}
      uuid={task.uuid}
      title={task.title}
      inputRef={inputRef}
      onClick={onFocus}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={disableMouseDown}
      onKeyDown={onKeydownCallback}
    />
  );
}

export const TodoTask = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoTaskComponent)
);
