import React, {
  useRef,
  useCallback,
  MouseEvent,
  ChangeEvent,
  useEffect
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Task } from './Task';
import { TaskDetailsView, EditTaskButton } from '../TaskDetailsView';
import { useBoolean, classes } from '../../utils';
import { useHotkeys } from '../../utils/useHotkeys';
import { RootState, TaskActionCreators } from '../../store';
import { Schema$Task } from '../../typings';

export interface TodoTaskProps {
  className?: string;
  index: number;
  task: Schema$Task;
  focused: boolean;
  setFocusIndex(indxe: number): void;
}

const mapStatetoProps = ({ task, taskList }: RootState, ownProps: any) => ({
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
  task,
  todoTasks,
  taskLists,
  currentTaskList,
  inputProps,
  addTask,
  updateTask,
  deleteTask,
  moveTask
}: TodoTaskProps &
  ReturnType<typeof mapStatetoProps> &
  ReturnType<typeof mapDispatchToProps>) {
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
    if (inputRef.current && focused) {
      inputRef.current.focus();
    }
  }, [focused]);

  const addTaskCallback = useCallback(() => {
    addTask({ insertAfter: index });
    setFocusIndex(index + 1);
  }, [addTask, index, setFocusIndex]);

  const deleteTaskCallback = useCallback(() => {
    if (task.title === '') {
      deleteTask(task);
      setFocusIndex(index - 1);
    }
  }, [deleteTask, index, setFocusIndex, task]);

  const moveTaskCallback = useCallback(
    (step: 1 | -1) => {
      const oldIndex = index;
      const newIndex = oldIndex + step;
      if (newIndex >= 0 && newIndex < todoTasks.length) {
        setFocusIndex(newIndex);
        setTimeout(() => moveTask({ newIndex, oldIndex }), 0); // not sure the reason but required
      }
    },
    [index, moveTask, setFocusIndex, todoTasks.length]
  );

  useHotkeys('enter', addTaskCallback, focused);
  useHotkeys('backspace', deleteTaskCallback, focused, false);
  useHotkeys('shift+enter', detailsView.on, focused);
  useHotkeys('option+up', () => moveTaskCallback(-1), focused);
  useHotkeys('option+down', () => moveTaskCallback(1), focused);

  return (
    <>
      <Task
        className={classes(`todo-task`, className, focused && 'focused')}
        task={task}
        inputProps={{
          inputRef,
          onFocus: () => setFocusIndex(index),
          onBlur: () => setFocusIndex(null),
          onClick: onClickCallback,
          onChange: onChangeCallback,
          ...inputProps
        }}
        endAdornment={<EditTaskButton onClick={detailsView.on} />}
        deleteTask={deleteTask}
        toggleCompleted={() => {}} // TODO:
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
