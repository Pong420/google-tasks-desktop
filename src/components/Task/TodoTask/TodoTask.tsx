import React, {
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect, Omit } from 'react-redux';
import { Task, TaskProps } from '../Task';
import { TodoTaskMenu } from './TodoTaskMenu';
import { DateTimeModal } from './DateTimeModal';
import { TaskDetailsView, EditTaskButton } from './TaskDetailsView';
import { useMuiMenu } from '../../Mui/Menu/useMuiMenu';
import { useBoolean, classes, useHotkeys } from '../../../utils';
import { RootState, TaskActionCreators } from '../../../store';
import { Schema$Task } from '../../../typings';

export interface TodoTaskProps extends Omit<TaskProps, 'ref' | 'endAdornment'> {
  className?: string;
  index: number;
  task: Schema$Task;
}

const mapStatetoProps = (
  {
    task: { focusIndex, todoTasks },
    taskList: { taskLists, currentTaskList, sortByDate }
  }: RootState,
  ownProps: TodoTaskProps
) => ({
  ...ownProps,
  currentTaskList,
  sortByDate,
  todoTasks,
  taskLists,
  focused: focusIndex === ownProps.index || focusIndex === ownProps.task.uuid
});
const mapDispatchToProps = (dispath: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispath);

const disableMouseDown = (evt: MouseEvent<HTMLElement>) => evt.preventDefault();

function TodoTaskComponent({
  className = '',
  index,
  task,
  todoTasks,
  taskLists,
  currentTaskList,
  sortByDate,
  focused,
  newTask,
  updateTask,
  deleteTask,
  moveTask,
  moveToAnotherList,
  setFocusIndex,
  inputProps
}: ReturnType<typeof mapStatetoProps> & ReturnType<typeof mapDispatchToProps>) {
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();
  const [detailsViewOpened, detailsView] = useBoolean();
  const [dateTimeModalOpened, dateTimeModal] = useBoolean();
  const [taskListDropdownOpened, taskListDropdown] = useBoolean();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateTaskCallback = useCallback(
    (args: Omit<Parameters<typeof updateTask>[0], 'id' | 'uuid'>) => {
      updateTask({ id: task.id, uuid: task.uuid, ...args });
    },
    [task.id, task.uuid, updateTask]
  );

  const deleteTaskCallback = useCallback(
    (args?: Omit<Parameters<typeof deleteTask>[0], 'id' | 'uuid'>) => {
      deleteTask({ id: task.id, uuid: task.uuid, ...args });
    },
    [deleteTask, task.id, task.uuid]
  );

  const { onFocus, onBlur } = useMemo(() => {
    return {
      onFocus: () => !focused && setFocusIndex(index),
      onBlur: () => focused && setFocusIndex(null)
    };
  }, [focused, index, setFocusIndex]);

  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) =>
      updateTaskCallback({
        title: evt.target.value
      }),
    [updateTaskCallback]
  );

  const onDueDateChangeCallback = useCallback(
    (date: Date) =>
      updateTaskCallback({
        due: date.toISOString()
      }),
    [updateTaskCallback]
  );

  const taskListChangeCallback = useCallback(
    (tasklist: string) => {
      moveToAnotherList({ task, tasklist });
    },
    [task, moveToAnotherList]
  );

  const handleDetailsClose = useCallback(() => {
    detailsView.off();
    taskListDropdown.off();
  }, [detailsView, taskListDropdown]);

  const newTaskCallback = useCallback(() => {
    newTask({
      previousTask: task,
      due: sortByDate ? task.due : undefined
    });
    return false;
  }, [newTask, task, sortByDate]);

  const { moveTaskUp, moveTaskDown } = useMemo(() => {
    const handler = (step: number) => () => {
      if (sortByDate) {
        // if (task.due) {
        //   const date = new Date(task.due);
        //   if (!(date.isToday() && step < 0)) {
        //     setTimeout(() => {
        //       updateTask({ ...task, due: date.addDays(step).toISOString() });
        //     }, 0);
        //   }
        // }
      } else {
        const oldIndex = index;
        const newIndex = oldIndex + step;
        if (newIndex >= 0 && newIndex < todoTasks.length) {
          moveTask({ newIndex, oldIndex, uuid: task.uuid });
        }
      }

      return false;
    };

    return {
      moveTaskUp: handler(-1),
      moveTaskDown: handler(1)
    };
  }, [index, moveTask, sortByDate, todoTasks.length, task.uuid]);

  const { focusPrevTask, focusNextTask } = useMemo(() => {
    const handler = (step: number) => () => {
      const { selectionStart, selectionEnd } = inputRef.current!;
      const notHightlighted = selectionStart === selectionEnd;
      const newIndex = index + step;
      const focusPrev = step === -1 && newIndex >= 0 && selectionStart === 0;
      const focusNext =
        step === 1 &&
        newIndex < todoTasks.length &&
        selectionStart === (task.title || '').length;

      if (notHightlighted && (focusPrev || focusNext)) {
        setFocusIndex(newIndex);
        return false;
      }
    };

    return {
      focusPrevTask: handler(-1),
      focusNextTask: handler(1)
    };
  }, [index, setFocusIndex, task.title, todoTasks.length]);

  const mergedInputProps = useMemo(
    () => ({
      ...(inputProps && inputProps),
      onDueDateBtnClick: dateTimeModal.on
    }),
    [inputProps, dateTimeModal]
  );

  const onKeydownCallback = useCallback(
    (evt: KeyboardEvent<HTMLTextAreaElement>) => {
      if (evt.key === 'Backspace' && !evt.currentTarget.value.trim()) {
        deleteTaskCallback({
          previousTaskIndex: Math.max(0, index - 1)
        });
      }

      if (evt.key === 'Escape') {
        evt.currentTarget.blur();
      }
    },
    [deleteTaskCallback, index]
  );

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input && focused) {
      if (document.activeElement !== input) {
        // FIXME: remove timeout
        setTimeout(() => {
          const textLength = (task.title || '').length;

          input.focus();
          // place cursor at end of textarea
          input.setSelectionRange(textLength, textLength);
        }, 0);
      }
    }
  }, [focused, task.title]);

  useHotkeys('enter', newTaskCallback, focused);
  useHotkeys('up', focusPrevTask, focused);
  useHotkeys('down', focusNextTask, focused);
  useHotkeys('shift+enter', detailsView.on, focused);
  useHotkeys('option+up', moveTaskUp, focused);
  useHotkeys('option+down', moveTaskDown, focused);

  return (
    <>
      <Task
        className={classes(`todo-task`, className, focused && 'focused')}
        task={task}
        inputRef={inputRef}
        inputProps={mergedInputProps}
        onContextMenu={setAnchorPosition}
        onBlur={onBlur}
        onClick={onFocus}
        onFocus={onFocus}
        onChange={onChangeCallback}
        onKeyDown={onKeydownCallback}
        onMouseDown={disableMouseDown} // this avoid trigger SET_FOCUS_INDEX when not click on input element directly
        endAdornment={<EditTaskButton onClick={detailsView.on} />}
      />
      <TodoTaskMenu
        onClose={onClose}
        onDelete={deleteTaskCallback}
        anchorPosition={anchorPosition}
        openDateTimeModal={dateTimeModal.on}
        openTaskListDropdown={taskListDropdown.on}
      />
      <TaskDetailsView
        currentTaskList={currentTaskList}
        deleteTask={deleteTask}
        handleClose={handleDetailsClose}
        open={taskListDropdownOpened || detailsViewOpened}
        task={task}
        taskLists={taskLists}
        taskListChange={taskListChangeCallback}
        taskListDropdownOpened={taskListDropdownOpened}
        updateTask={updateTask}
      />
      <DateTimeModal
        confirmLabel="OK"
        due={task.due}
        open={dateTimeModalOpened}
        handleClose={dateTimeModal.off}
        handleConfirm={onDueDateChangeCallback}
      />
    </>
  );
}

export const TodoTask = connect(
  mapStatetoProps,
  mapDispatchToProps
)(TodoTaskComponent);
