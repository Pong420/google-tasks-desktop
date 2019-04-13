import React from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from './Task';
import { EditTaskButton } from '../EditTaskButton';
import { Schema$TaskList } from '../../typings';
import { useBoolean } from '../../utils/useBoolean';

interface Props extends Omit<TaskProps, 'endAdornment'> {
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
}

export function TodoTask({
  task,
  taskLists,
  currentTaskList,
  ...props
}: Props) {
  const [focus, { on, off }] = useBoolean(false);

  return (
    <Task
      className={[`todo-task`, focus ? 'focused' : '']
        .filter(Boolean)
        .join(' ')
        .trim()}
      task={task}
      inputProps={{
        onFocus: on,
        onBlur: off
      }}
      endAdornment={
        <EditTaskButton
          task={task}
          taskLists={taskLists}
          currentTaskList={currentTaskList}
          onDelete={() => {}}
        />
      }
      {...props}
    />
  );
}
