import React, {
  useRef,
  useCallback,
  MouseEvent,
  ChangeEvent,
  useEffect,
  useMemo
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Task } from '..';
import { TodoTaskInput } from './TodoTaskInput';
import { TodoTaskMenu } from './TodoTaskMenu';
import { TaskDetailsView, EditTaskButton } from '../../TaskDetailsView';
import { useMuiMenu } from '../../Mui/Menu/useMuiMenu';
import { useBoolean, classes } from '../../../utils';
import { useHotkeys } from '../../../utils/useHotkeys';
import { RootState, TaskActionCreators } from '../../../store';
import { Schema$Task } from '../../../typings';

export interface TodoTaskProps {
  className?: string;
  index: number;
  task: Schema$Task;
  toggleCompleted(task: Schema$Task): void;
  focused: boolean;
  setFocusIndex(indxe: number | null): void;
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
  moveTask
}: ReturnType<typeof mapStatetoProps> & ReturnType<typeof mapDispatchToProps>) {
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();

  const inputRef = useRef<HTMLInputElement>(null);
  const onClickCallback = useCallback(
    (evt: MouseEvent<HTMLElement>) =>
      evt.target === inputRef.current!.parentElement &&
      inputRef.current!.focus(),
    []
  );

  const [detailsViewOpened, detailsView] = useBoolean();

  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      updateTask({
        ...task,
        title: evt.currentTarget.value
      });
    },
    [task, updateTask]
  );

  // auto focus
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
    newTask({ insertAfter: index });
    setFocusIndex(index + 1);
  }, [newTask, index, setFocusIndex]);

  const deleteTaskCallback = useCallback(() => {
    if (task.title === '') {
      deleteTask(task);
      setFocusIndex(index - 1);
    }
  }, [deleteTask, index, setFocusIndex, task]);

  const moveTaskCallback = useCallback(
    (step: number) => {
      const oldIndex = index;
      const newIndex = oldIndex + step;
      if (newIndex >= 0 && newIndex < todoTasks.length) {
        setFocusIndex(newIndex);
        // not sure the reason of setTimeout but required
        setTimeout(() => moveTask({ newIndex, oldIndex }), 0);
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
  useHotkeys('backspace', deleteTaskCallback, focused, false);
  useHotkeys('shift+enter', detailsView.on, focused);
  useHotkeys('option+up', moveUpCallback, focused);
  useHotkeys('option+down', moveDownCallback, focused);
  useHotkeys('esc', escKeyDownCallback, focused);

  const todoInputProps = useMemo(() => {
    return {
      notes: task.notes
    };
  }, [task.notes]);

  return (
    <>
      <Task
        className={classes(`todo-task`, className, focused && 'focused')}
        task={task}
        inputBaseProps={{
          inputRef,
          onFocus: () => setFocusIndex(index),
          onBlur: () => setFocusIndex(null),
          onClick: onClickCallback,
          onChange: onChangeCallback,
          inputComponent: TodoTaskInput,
          inputProps: todoInputProps
        }}
        endAdornment={<EditTaskButton onClick={detailsView.on} />}
        onContextMenu={setAnchorPosition}
        toggleCompleted={toggleCompleted}
      />
      <TodoTaskMenu
        onClose={onClose}
        onDelete={deleteTaskCallback}
        anchorPosition={anchorPosition}
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
    </>
  );
}

export const TodoTask = connect(
  mapStatetoProps,
  mapDispatchToProps
)(TodoTaskComponent);
