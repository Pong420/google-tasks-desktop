import React from 'react';
import { Task } from '../Task';
import { Schema$Task } from '../../typings';

interface Props {
  tasks: Schema$Task[];
}

export function TodoTasks({ tasks }: Props) {
  return <div className="todo-tasks" />;
}
