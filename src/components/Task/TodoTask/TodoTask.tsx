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
  setFocusIndex
}: ReturnType<typeof mapStatetoProps> & ReturnType<typeof mapDispatchToProps>) {
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();
  const [detailsViewOpened, detailsView] = useBoolean();
  const [dateTimeModalOpened, dateTimeModal] = useBoolean();
  const focused = focusIndex === index || focusIndex === task.uuid;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      if (focused) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [focused]);

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

    return true;
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
          moveTask({ newIndex, oldIndex });
        }
      }

      return false;
    };

    return {
      moveTaskUp: handler(-1),
      moveTaskDown: handler(1)
    };
  }, [index, moveTask, sortByDate, todoTasks.length]);

  const { focusPrevTask, focusNextTask } = useMemo(() => {
    const handler = (step: number) => () => {
      const newIndex = index + step;
      if (newIndex < todoTasks.length && newIndex >= 0) {
        setFocusIndex(newIndex);
      }

      return false;
    };

    return {
      focusPrevTask: handler(-1),
      focusNextTask: handler(1)
    };
  }, [index, setFocusIndex, todoTasks.length]);

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
        onDueDateBtnClick: dateTimeModal.on
      },
      ...inputBaseProps
    }),
    [dateTimeModal.on, inputBaseProps, onBlur, onChangeCallback, onFocus]
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
        openDateTimeModal={dateTimeModal.on}
      />
      <TaskDetailsView
        open={detailsViewOpened}
        handleClose={detailsView.off}
        task={task}
        taskLists={taskLists}
        currentTaskList={currentTaskList}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
      <DateTimeModal
        task={task}
        confirmLabel="OK"
        open={dateTimeModalOpened}
        handleClose={dateTimeModal.off}
        handleConfirm={dateTimeModal.off}
        onDueDateChange={onDueDateChangeCallback}
      />
    </>
  );
}

export const TodoTask = connect(
  mapStatetoProps,
  mapDispatchToProps
)(TodoTaskComponent);
