import React from 'react';
import { TodoTask } from '../Task';

interface Props {
  tasks: string[];
}

export function TodoTaskList({ tasks }: Props) {
  return (
    <div className="todo-tasks-list">
      {tasks.map((uuid, index) => (
        <TodoTask
          key={uuid}
          uuid={uuid}
          prevPrev={tasks[index - 2]}
          prev={tasks[index - 1]}
          next={tasks[index + 1]}
        />
      ))}
    </div>
  );
}
