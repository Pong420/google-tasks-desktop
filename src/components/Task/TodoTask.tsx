import React from 'react';
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
  const [focus, { on, off }] = useBoolean(false);

  return (
    <Task
      className={[`todo-task`, focus ? 'focused' : '', className]
        .filter(Boolean)
        .join(' ')
        .trim()}
      task={task}
      inputProps={{
        onFocus: on,
        onBlur: off,
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
