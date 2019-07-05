import React from 'react';
import { Task, TaskProps } from './Task';

export function TodoTask({ ...props }: TaskProps) {
  return <Task className="todo-task" {...props} />;
}
