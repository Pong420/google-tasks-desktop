import React from 'react';
import { Task, TaskProps } from '../Task';

export function TodoTask({ ...props }: TaskProps) {
  return <Task {...props} className="todo-task" />;
}
