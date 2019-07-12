import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect, Omit } from 'react-redux';
import { Task } from '../Task';
import { TodoTaskMenu } from './TodoTaskMenu';
import { TaskDetailsView, EditTaskButton } from './TaskDetailsView';
import { classes } from '../../../utils/classes';
import { useBoolean } from '../../../utils/useBoolean';
import { useMouseTrap } from '../../../utils/useMouseTrap';
import {
  RootState,
  TaskActionCreators,
  getTodoTasksOrder
} from '../../../store';
import { Schema$Task } from '../../../typings';
import { useMuiMenu } from '../../Mui';
import DateTimeDialog from './DateTimeDialog';

export interface TodoTaskProps extends Pick<Schema$Task, 'uuid'> {
  className?: string;
}

const mapStateToProps = (state: RootState, ownProps: TodoTaskProps) => {
  const todoTasks = getTodoTasksOrder(state);
  const index = todoTasks.indexOf(ownProps.uuid);
  const { focused, byIds } = state.task;
  return {
    task: byIds[ownProps.uuid],
    focused: focused === ownProps.uuid || focused === index,
    prevTask: todoTasks[Math.max(0, index - 1)],
    nextTask: todoTasks[Math.min(todoTasks.length, index + 1)],
    sortByDate: state.taskList.sortByDate
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

export function TodoTaskComponent({
  className,
  task,
  focused,
  setFocused,
  prevTask,
  nextTask,
  newTask,
  moveTask,
  deleteTask,
  updateTask,
  sortByDate
}: ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  TodoTaskProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();
  const [dateTimeDialogOpened, dateTimeDialog] = useBoolean();
  const [
    detailsViewOpened,
    { on: openDetailsView, off: closeDetailView }
  ] = useBoolean();
  const [
    taskListDropdownOpened,
    { on: openTaskListDropdown, off: closeTaskListDropdown }
  ] = useBoolean();

  const [onFocus, onBlur] = useMemo(
    () => [() => setFocused(task.uuid), () => setFocused(null)],
    [setFocused, task.uuid]
  );

  const onClickCallback = useCallback((evt: MouseEvent<HTMLDivElement>) => {
    const el = inputRef.current;
    if (el && el !== evt.target) {
      el.focus();
    }
  }, []);

  const newTaskCallback = useCallback(() => {
    newTask({
      prevUUID: task.uuid,
      due: sortByDate ? task.due : undefined
    });
    return false;
  }, [newTask, task.uuid, task.due, sortByDate]);

  const deleteTaskCallback = useCallback(
    (args?: Omit<Parameters<typeof deleteTask>[0], 'uuid'>) => {
      deleteTask({ uuid: task.uuid, ...args });
    },
    [deleteTask, task.uuid]
  );

  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) =>
      updateTask({
        uuid: task.uuid,
        title: evt.target.value
      }),
    [updateTask, task.uuid]
  );

  const onDueDateChangeCallback = useCallback(
    (date?: Date) =>
      updateTask({
        uuid: task.uuid,
        due: date && date.toISODateString()
      }),
    [updateTask, task.uuid]
  );

  const handleDetailsClose = useCallback(() => {
    closeDetailView();
    closeTaskListDropdown();
  }, [closeDetailView, closeTaskListDropdown]);

  const [focusPrevTask, focusNextTask] = useMemo(() => {
    const handler = (type: 'start' | 'end', uuid?: string) => () => {
      const input = inputRef.current;
      if (input && uuid && uuid !== task.uuid) {
        const { selectionStart, selectionEnd, value } = input;
        const notHightlighted = selectionStart === selectionEnd;
        const shouldFocusPrev = type === 'start' && selectionStart === 0;
        const shouldFocusNext =
          type === 'end' && selectionStart === value.length;

        if (notHightlighted && (shouldFocusPrev || shouldFocusNext)) {
          setFocused(uuid);
        }
      }
    };

    return [handler('start', prevTask), handler('end', nextTask)];
  }, [prevTask, nextTask, setFocused, task.uuid]);

  const [moveTaskUp, moveTaskDown] = useMemo(() => {
    const handler = (prevUUID: Schema$Task['uuid'], step: number) => () => {
      if (prevUUID) {
        if (sortByDate) {
          const now = new Date();
          const currDate = task.due && new Date(task.due);
          const canMoveUp = !currDate || currDate.dayDiff(now) < 0;
          const canMoveDown = !!currDate;
          if ((step === -1 && canMoveUp) || (step === 1 && canMoveDown)) {
            let newDate = currDate ? currDate.addDays(step) : now;
            if (newDate.dayDiff(now) > 0) {
              newDate = now;
            }
            onDueDateChangeCallback(newDate);
          }
        } else if (prevUUID !== task.uuid) {
          moveTask({ uuid: task.uuid, prevUUID });
        }
        return false;
      }
    };

    return [handler(prevTask, -1), handler(nextTask, 1)];
  }, [
    moveTask,
    onDueDateChangeCallback,
    prevTask,
    nextTask,
    sortByDate,
    task.uuid,
    task.due
  ]);

  const onKeydownCallback = useCallback(
    (evt: KeyboardEvent<HTMLTextAreaElement>) => {
      if (evt.key === 'Backspace' && !evt.currentTarget.value.trim()) {
        evt.preventDefault();
        deleteTaskCallback({
          prevUUID: prevTask === task.uuid ? nextTask : prevTask
        });
      }

      if (evt.key === 'Escape') {
        evt.currentTarget.blur();
      }
    },
    [deleteTaskCallback, prevTask, nextTask, task.uuid]
  );

  useEffect(() => {
    const input = inputRef.current;
    if (input && focused) {
      if (document.activeElement !== input) {
        const { length } = input.value;

        input.focus();
        // make sure cursor place at end of textarea
        input.setSelectionRange(length, length);
      }
    }
  }, [focused]);

  useMouseTrap(inputRef, 'enter', newTaskCallback);
  useMouseTrap(inputRef, 'up', focusPrevTask);
  useMouseTrap(inputRef, 'down', focusNextTask);
  useMouseTrap(inputRef, 'shift+enter', openDetailsView);
  useMouseTrap(inputRef, 'option+up', moveTaskUp);
  useMouseTrap(inputRef, 'option+down', moveTaskDown);

  return (
    <>
      <Task
        className={classes(`todo-task`, focused && 'focused', className)}
        due={sortByDate ? undefined : task.due}
        endAdornment={<EditTaskButton onClick={openDetailsView} />}
        notes={task.notes}
        inputRef={inputRef}
        onClick={onClickCallback}
        onChange={onChangeCallback}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeydownCallback}
        onContextMenu={setAnchorPosition}
        onDueDateBtnClick={dateTimeDialog.on}
        title={task.title}
        uuid={task.uuid}
      />
      <TodoTaskMenu
        anchorPosition={anchorPosition}
        anchorReference="anchorPosition"
        due={task.due}
        open={!!anchorPosition}
        onClose={onClose}
        onDelete={deleteTaskCallback}
        openDateTimeDialog={dateTimeDialog.on}
        openTaskListDropdown={openTaskListDropdown}
      />
      <TaskDetailsView
        open={taskListDropdownOpened || detailsViewOpened}
        onClose={handleDetailsClose}
        taskListDropdownOpened={taskListDropdownOpened}
        uuid={task.uuid}
      />
      <DateTimeDialog
        date={task.due ? new Date(task.due) : undefined}
        open={dateTimeDialogOpened}
        onClose={dateTimeDialog.off}
        onConfirm={onDueDateChangeCallback}
      />
    </>
  );
}

export const TodoTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoTaskComponent);
