import React, { useRef, useCallback, MouseEvent, ChangeEvent } from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from './Task';
import { EditTaskButton } from '../EditTaskButton';
import { Schema$TaskList } from '../../typings';
import { useBoolean } from '../../utils/useBoolean';

export interface TodoTaskProps extends Omit<TaskProps, 'endAdornment'> {
  className?: string;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
}

export function TodoTask({
  task,
  taskLists,
  className = '',
  currentTaskList,
  inputProps,
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
      props.updateTask &&
        props.updateTask({ ...task, title: evt.currentTarget.value });
    },
    [props, task]
  );

  return (
    <Task
      className={[`todo-task`, focused ? 'focused' : '', className]
        .filter(Boolean)
        .join(' ')
        .trim()}
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
          updateTask={props.updateTask}
        />
      }
      {...props}
    />
  );
}
