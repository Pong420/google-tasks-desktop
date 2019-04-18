import React, {
  useRef,
  useCallback,
  MouseEvent,
  ChangeEvent,
  useMemo
} from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from './Task';
import { EditTaskButton } from '../EditTaskButton';
import { Schema$TaskList, Schema$Task } from '../../typings';
import { useBoolean, classes } from '../../utils';
import { HotKeys, KeyMap } from 'react-hotkeys';

export interface TodoTaskProps extends Omit<TaskProps, 'endAdornment'> {
  className?: string;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
  addTask(task?: Schema$Task): void;
  updateTask(task: Schema$Task): void;
}

interface HotKeysHandler {
  [key: string]: (keyEvent?: KeyboardEvent) => void;
}

const keyMap: KeyMap = {
  ADD_TASK: 'enter'
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
  currentTaskList,
  inputProps,
  addTask,
  updateTask,
  ...props
}: TodoTaskProps) {
  const [focused, { on, off }] = useBoolean(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    (evt: MouseEvent<HTMLElement>) =>
      evt.target === inputRef.current!.parentElement &&
      inputRef.current!.focus(),
    []
  );

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
      ADD_TASK: withPreventDefault(() => addTask())
    }),
    [addTask]
  );

  return (
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
        endAdornment={
          <EditTaskButton
            task={task}
            taskLists={taskLists}
            currentTaskList={currentTaskList}
            deleteTask={props.deleteTask}
            updateTask={updateTask}
          />
        }
        {...props}
      />
    </HotKeys>
  );
}
