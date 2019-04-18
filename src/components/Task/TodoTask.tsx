import React, {
  useRef,
  useCallback,
  MouseEvent,
  ChangeEvent,
  useMemo,
  useEffect
} from 'react';
import { Omit } from 'react-redux';
import { HotKeys, KeyMap } from 'react-hotkeys';
import { Task, TaskProps } from './Task';
import { TaskDetailsView, EditTaskButton } from '../TaskDetailsView';
import { useBoolean, classes } from '../../utils';
import { Schema$TaskList, Schema$Task } from '../../typings';
import { Payload$Optional$AddTask } from '../../store';

export interface TodoTaskProps extends Omit<TaskProps, 'endAdornment'> {
  className?: string;
  index: number;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
  addTask(payload?: Payload$Optional$AddTask): void;
  updateTask(task: Schema$Task): void;
}

interface HotKeysHandler {
  [key: string]: (keyEvent?: KeyboardEvent) => void;
}

const keyMap: KeyMap = {
  ADD_TASK: 'enter',
  ENTER_EDIT_TASK: 'shift+enter'
};

function withPreventDefault(
  callback: () => void
): (evt?: KeyboardEvent) => void {
  return evt => {
    evt && evt.preventDefault();
    callback();
  };
}

export function TodoTask({
  task,
  taskLists,
  className = '',
  index,
  currentTaskList,
  inputProps,
  addTask,
  updateTask,
  ...props
}: TodoTaskProps) {
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

  const handlers = useMemo<HotKeysHandler>(
    () => ({
      ADD_TASK: withPreventDefault(() => addTask({ insertAfter: index })),
      ENTER_EDIT_TASK: withPreventDefault(detailsView.on)
    }),
    [addTask, detailsView.on, index]
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
          {...props}
        />
      </HotKeys>
      <TaskDetailsView
        open={detailsViewOpened}
        handleClose={detailsView.off}
        task={task}
        taskLists={taskLists}
        currentTaskList={currentTaskList}
        updateTask={updateTask}
        deleteTask={props.deleteTask}
      />
    </>
  );
}
