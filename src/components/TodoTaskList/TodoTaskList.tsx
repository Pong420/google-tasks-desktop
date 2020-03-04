import React from 'react';
import { TodoTask } from '../Task';

interface Props {
  tasks: string[];
}

export function TodoTaskList({ tasks }: Props) {
  return (
    <div className="todo-tasks-list">
      {tasks.map(uuid => (
        <TodoTask key={uuid} uuid={uuid} />
      ))}
    </div>
  );
}
