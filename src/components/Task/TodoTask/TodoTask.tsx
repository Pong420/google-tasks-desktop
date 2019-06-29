import React, {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  ChangeEvent
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { InputBaseProps } from '@material-ui/core/InputBase';
import { Task } from '../Task';
import { TodoTaskMenu } from './TodoTaskMenu';
import { DateTimeModal } from './DateTimeModal';
import { TaskDetailsView, EditTaskButton } from './TaskDetailsView';
import { useMuiMenu } from '../../Mui/Menu/useMuiMenu';
import { useBoolean, classes, useHotkeys } from '../../../utils';
import { RootState, TaskActionCreators } from '../../../store';
import { Schema$Task } from '../../../typings';

export interface TodoTaskProps {
  className?: string;
  index: number;
  task: Schema$Task;
  inputBaseProps?: InputBaseProps;
}

const mapStatetoProps = (
  { task, taskList }: RootState,
  ownProps: TodoTaskProps
) => ({
  ...task,
  ...taskList,
  ...ownProps
});
const mapDispatchToProps = (dispath: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispath);

function TodoTaskComponent({
  className = '',
  index,
  task,
  todoTasks,
  taskLists,
  currentTaskList,
  newTask,
  updateTask,
  deleteTask,
  moveTask,
  inputBaseProps,
  sortByDate,
  focusIndex,
  moveToAnotherList,
  setFocusIndex
}: ReturnType<typeof mapStatetoProps> & ReturnType<typeof mapDispatchToProps>) {
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();
  const [detailsViewOpened, detailsView] = useBoolean();
  const [
    dateTimeModalOpened,
    { on: openDateTimeModal, off: closeDateTimeModal }
  ] = useBoolean();
  const [taskListDropdownOpened, taskListDropdown] = useBoolean();
  const focused = focusIndex === index || focusIndex === task.uuid;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      if (focused) {
        if (document.activeElement !== inputRef.current) {
          inputRef.current.focus();
          // place cursot at end of textarea
          inputRef.current.setSelectionRange(
            (task.title || '').length,
            (task.title || '').length
          );
        }
      } else {
        inputRef.current.blur();
      }
    }
  }, [focused, task.title]);

  const { onFocus, onBlur } = useMemo(() => {
    return {
      onFocus: () => !focused && setFocusIndex(index),
      onBlur: () => focused && setFocusIndex(null)
    };
  }, [focused, index, setFocusIndex]);

  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      updateTask({
        ...task,
        title: evt.target.value
      });
    },
    [task, updateTask]
  );

  const deleteTaskCallback = useCallback(() => deleteTask(task), [
    deleteTask,
    task
  ]);

  const onDueDateChangeCallback = useCallback(
    (date: Date) => {
      updateTask({
        ...task,
        due: date.toISOString()
      });
    },
    [task, updateTask]
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

  const backspaceCallback = useCallback(() => {
    if (!task.title) {
      deleteTask({ ...task, previousTaskIndex: Math.max(0, index - 1) });
      return false;
    }
  }, [deleteTask, index, task]);

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

  useHotkeys('enter', newTaskCallback, focused);
  useHotkeys('backspace', backspaceCallback, focused);
  useHotkeys('shift+enter', detailsView.on, focused);
  useHotkeys('esc', onBlur, focused);
  useHotkeys('option+up', moveTaskUp, focused);
  useHotkeys('option+down', moveTaskDown, focused);
  useHotkeys('up', focusPrevTask, focused);
  useHotkeys('down', focusNextTask, focused);

  const memoInputBaseProps = useMemo(
    () => ({
      inputRef,
      onFocus,
      onBlur,
      onClick: onFocus,
      onChange: onChangeCallback,
      inputProps: {
        onDueDateBtnClick: openDateTimeModal
      },
      ...inputBaseProps
    }),
    [openDateTimeModal, inputBaseProps, onBlur, onChangeCallback, onFocus]
  );

  return (
    <>
      <Task
        className={classes(`todo-task`, className, focused && 'focused')}
        task={task}
        inputBaseProps={memoInputBaseProps}
        onContextMenu={setAnchorPosition}
        endAdornment={<EditTaskButton onClick={detailsView.on} />}
      />
      <TodoTaskMenu
        onClose={onClose}
        onDelete={deleteTaskCallback}
        anchorPosition={anchorPosition}
        openDateTimeModal={openDateTimeModal}
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
        handleClose={closeDateTimeModal}
        handleConfirm={onDueDateChangeCallback}
      />
    </>
  );
}

export const TodoTask = connect(
  mapStatetoProps,
  mapDispatchToProps
)(TodoTaskComponent);
