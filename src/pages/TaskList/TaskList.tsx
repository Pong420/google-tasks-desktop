import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { TaskListHeader } from '../../components/TaskListHeader';
import { getAllTasklist } from '../../service';
import { useTaskListActions } from '../../store/actions/taskList';

export function TaskList() {
  const { paginateTaskList } = useTaskListActions();

  useRxAsync(getAllTasklist, {
    onSuccess: paginateTaskList
  });

  return (
    <div className="task-list">
      <TaskListHeader />
    </div>
  );
}
