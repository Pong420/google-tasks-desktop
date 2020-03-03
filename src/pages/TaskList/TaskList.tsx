import React, { useEffect } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { TaskListHeader } from '../../components/TaskListHeader';
import { TaskListContent } from '../../components/TaskListContent';
import { getAllTasklist } from '../../service';
import { useTaskListActions } from '../../store';
import { NProgress } from '../../utils/nprogress';
import { useCurrenTaskList } from '../../hooks/useCurrenTaskList';

export function TaskList() {
  const { paginateTaskList } = useTaskListActions();
  const takslist = useCurrenTaskList();

  useRxAsync(getAllTasklist, {
    onSuccess: paginateTaskList
  });

  useEffect(() => {
    NProgress.start();
  }, []);

  return (
    <div className="task-list">
      <TaskListHeader />
      <TaskListContent tasklist={takslist && takslist.id} />
    </div>
  );
}
