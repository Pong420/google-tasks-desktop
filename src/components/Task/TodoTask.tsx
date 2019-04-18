import React, { useRef, useCallback, MouseEvent, ChangeEvent } from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from './Task';
import { EditTaskButton } from '../EditTaskButton';
import { Schema$TaskList, Schema$Task } from '../../typings';
import { useBoolean, classes } from '../../utils';

export interface TodoTaskProps extends Omit<TaskProps, 'endAdornment'> {
  className?: string;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
  updateTask(task: Schema$Task): void;
}

export function TodoTask({
  task,
  taskLists,
  className = '',
  currentTaskList,
  inputProps,
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

  return (
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
  );
}
