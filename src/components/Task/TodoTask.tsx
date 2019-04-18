import React, {
  useRef,
  useCallback,
  MouseEvent,
  ChangeEvent,
  useMemo,
  useEffect
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HotKeys, KeyMap } from 'react-hotkeys';
import { Task } from './Task';
import { TaskDetailsView, EditTaskButton } from '../TaskDetailsView';
import { useBoolean, classes } from '../../utils';
import { RootState, TaskActionCreators } from '../../store';
import { Schema$Task } from '../../typings';

export interface TodoTaskProps {
  className?: string;
  index: number;
  task: Schema$Task;
}

interface HotKeysHandler {
  [key: string]: (keyEvent?: KeyboardEvent) => void;
}

const keyMap: KeyMap = {
  ADD_TASK: 'enter',
  ENTER_EDIT_TASK: 'shift+enter',
  MOVE_TASK_UP: 'option+up',
  MOVE_TASK_DOWN: 'option+down'
};

function withPreventDefault(
  callback: () => void
): (evt?: KeyboardEvent) => void {
  return evt => {
    evt && evt.preventDefault();
    callback();
  };
}

const mapStatetoProps = ({ task, taskList }: RootState, ownProps: any) => ({
  ...task,
  ...taskList,
  ...ownProps
});
const mapDispatchToProps = (dispath: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispath);

function TodoTaskComponent({
  task,
  todoTasks,
  taskLists,
  className = '',
  index,
  currentTaskList,
  inputProps,
  addTask,
  updateTask,
  deleteTask,
  moveTask
}: TodoTaskProps &
  ReturnType<typeof mapStatetoProps> &
  ReturnType<typeof mapDispatchToProps>) {
  const [focused, { on, off }] = useBoolean();
  const inputRef = useRef<HTMLInputElement>(null);
  const focus = useCallback(
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

  const moveTaskCallback = useCallback(
    (step: 1 | -1) => {
      // TODO: keep focus
      const oldIndex = index;
      const newIndex = oldIndex + step;
      if (newIndex >= 0 && newIndex < todoTasks.length) {
        moveTask({ newIndex, oldIndex });
      }
    },
    [index, moveTask, todoTasks.length]
  );

  const handlers = useMemo<HotKeysHandler>(
    () => ({
      ADD_TASK: withPreventDefault(() => addTask({ insertAfter: index })),
      ENTER_EDIT_TASK: withPreventDefault(detailsView.on),
      MOVE_TASK_UP: withPreventDefault(() => moveTaskCallback(-1)),
      MOVE_TASK_DOWN: withPreventDefault(() => moveTaskCallback(1))
    }),
    [addTask, detailsView.on, index, moveTaskCallback]
  );

  // auto focus
  useEffect(() => {
    if (inputRef.current && !task.id) {
      inputRef.current.focus();
    }
  }, [task.id]);

  return (
    <>
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <Task
          className={classes(`todo-task`, focused && 'focused', className)}
          task={task}
          inputProps={{
            inputRef,
            onFocus: on,
            onBlur: off,
            onClick: focus,
            onChange: onChangeCallback,
            ...inputProps
          }}
          endAdornment={<EditTaskButton onClick={detailsView.on} />}
          deleteTask={deleteTask}
          toggleCompleted={() => {}}
        />
      </HotKeys>
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
