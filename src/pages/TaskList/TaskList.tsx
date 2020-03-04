import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { TaskListHeader } from '../../components/TaskListHeader';
import { TodoTaskList } from '../../components/TodoTaskList';
import { CompletedTaskList } from '../../components/CompletedTaskList';
import { getAllTasklist, getAllTasks } from '../../service';
import {
  useTaskListActions,
  useTaskActions,
  taskIdsSelector
} from '../../store';
import { NProgress } from '../../utils/nprogress';
import { useCurrenTaskList } from '../../hooks/useCurrenTaskList';

export function TaskList() {
  const { paginateTaskList } = useTaskListActions();
  const { paginateTask } = useTaskActions();
  const { run } = useRxAsync(getAllTasks, {
    defer: true,
    onSuccess: paginateTask
  });

  const tasklist = useCurrenTaskList();

  const { todo, completed } = useSelector(taskIdsSelector);

  useRxAsync(getAllTasklist, {
    onSuccess: paginateTaskList
  });

  useEffect(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    if (tasklist) {
      NProgress.start();
      run({ tasklist: tasklist.id });
    }
  }, [run, tasklist]);

  return (
    <div className="task-list">
      <TaskListHeader />
      <div className="task-list-content">
        <TodoTaskList tasks={todo} />
        <CompletedTaskList tasks={completed} />
      </div>
    </div>
  );
}
