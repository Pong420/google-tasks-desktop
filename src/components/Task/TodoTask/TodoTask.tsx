import React from 'react';
import { Task, TaskProps } from '../Task';

interface Props extends TaskProps {}

export function TodoTask(prosp: Props) {
  return <Task {...prosp} className="todo-task" />;
}
