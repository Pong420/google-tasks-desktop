import React from 'react';
import { TaskListHeader } from '../TaskListHeader';
import { TaskList } from '../TaskList';

export function Main() {
  return (
    <div className="main">
      <TaskListHeader />
      <TaskList />
    </div>
  );
}
