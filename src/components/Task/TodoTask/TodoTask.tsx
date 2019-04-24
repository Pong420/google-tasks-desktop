import React, {
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
  ChangeEvent
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { InputBaseProps } from '@material-ui/core/InputBase';
import { Task } from '../Task';
import { TodoTaskMenu } from './TodoTaskMenu';
import { DateTimeModal } from './DateTimeModal';
import { TaskDetailsView, EditTaskButton } from './TaskDetailsView';
import { TaskInputWithDate } from '../TaskInputWithDate';
import { useMuiMenu } from '../../Mui/Menu/useMuiMenu';
import { useBoolean, classes, useHotkeys } from '../../../utils';
import { RootState, TaskActionCreators } from '../../../store';
import { Schema$Task } from '../../../typings';

export interface TodoTaskProps {
  className?: string;
  index: number;
  task: Schema$Task;
  toggleCompleted(task: Schema$Task): void;
  focused: boolean;
  setFocusIndex(indxe: number | null): void;
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
  focused,
  setFocusIndex,
  toggleCompleted,
  task,
  todoTasks,
  taskLists,
  currentTaskList,
  newTask,
  updateTask,
  deleteTask,
  moveTask,
  inputBaseProps,
  sortByDate
}: ReturnType<typeof mapStatetoProps> & ReturnType<typeof mapDispatchToProps>) {
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();
  const [detailsViewOpened, detailsView] = useBoolean();
  const [dateTimeModalOpened, dateTimeModal] = useBoolean();

  const inputRef = useRef<HTMLInputElement>(null);
  const clickToFocusCallback = useCallback(
    (evt: MouseEvent<HTMLElement>) =>
      evt.target !== inputRef.current && inputRef.current!.focus(),
    []
  );

  const deleteTaskCallback = useCallback(() => deleteTask(task), [
    deleteTask,
    task
  ]);

  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      updateTask({
        ...task,
        title: evt.currentTarget.value
      });
    },
    [task, updateTask]
  );

  const onDueDateChangeCallback = useCallback(
    (date: Date) => {
      updateTask({
        ...task,
        due: date.toISOString()
      });
    },
    [task, updateTask]
  );

  // auto focus on mount
  useEffect(() => {
    !task.id && setFocusIndex(index);
  }, [index, setFocusIndex, task.id]);

  useEffect(() => {
    if (inputRef.current) {
      if (focused) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [focused]);

  const newTaskCallback = useCallback(() => {
    // TODO: check setTimeout
    setTimeout(() => {
      newTask({
        previousTask: task,
        due: sortByDate ? task.due : undefined
      });
    }, 0);
  }, [newTask, task, sortByDate]);

  const backspaceCallback = useCallback(
    evt => {
      if (task.title === '') {
        evt.preventDefault();
        deleteTask(task);
        setFocusIndex(index - 1);
      }
    },
    [deleteTask, index, setFocusIndex, task]
  );

  const moveTaskCallback = useCallback(
    (step: number) => {
      const oldIndex = index;
      const newIndex = oldIndex + step;
      if (newIndex >= 0 && newIndex < todoTasks.length) {
        // TODO: check setTimeout
        // not sure the reason of setTimeout but required

        setTimeout(() => {
          moveTask({ newIndex, oldIndex });
          setFocusIndex(newIndex);
        }, 0);
      }
    },
    [index, moveTask, setFocusIndex, todoTasks.length]
  );

  const moveUpCallback = useCallback(() => moveTaskCallback(-1), [
    moveTaskCallback
  ]);
  const moveDownCallback = useCallback(() => moveTaskCallback(1), [
    moveTaskCallback
  ]);
  const escKeyDownCallback = useCallback(() => () => setFocusIndex(null), [
    setFocusIndex
  ]);

  useHotkeys('enter', newTaskCallback, focused);
  useHotkeys('backspace', backspaceCallback, focused, false);
  useHotkeys('shift+enter', detailsView.on, focused);
  useHotkeys('option+up', moveUpCallback, focused);
  useHotkeys('option+down', moveDownCallback, focused);
  useHotkeys('esc', escKeyDownCallback, focused);

  return (
    <>
      <Task
        className={classes(`todo-task`, className, focused && 'focused')}
        task={task}
        inputBaseProps={{
          inputRef,
          onFocus: () => setFocusIndex(index),
          onBlur: () => setFocusIndex(null),
          onClick: clickToFocusCallback,
          onChange: onChangeCallback,
          inputComponent: TaskInputWithDate,
          inputProps: {
            task,
            onDueDateBtnClick: dateTimeModal.on
          },
          ...inputBaseProps
        }}
        endAdornment={<EditTaskButton onClick={detailsView.on} />}
        onContextMenu={setAnchorPosition}
        toggleCompleted={toggleCompleted}
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
        openDateTimeModal={dateTimeModal.on}
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
