import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { TaskListHeader } from './TaskListHeader';
import { TodoTaskList } from './TodoTaskList';
import { NewTask } from './NewTask';
import { CompletedTaskList } from './CompletedTaskList';
import { getAllTasklist, getAllTasks } from '../../service';
import { useTaskListActions, useTaskActions, RootState } from '../../store';
import { NProgress } from '../../utils/nprogress';
import { useCurrenTaskList } from '../../hooks/useCurrenTaskList';

export function TaskList() {
  const tasklistActions = useTaskListActions();
  const taskActions = useTaskActions();

  const { run } = useRxAsync(getAllTasks, {
    defer: true,
    onSuccess: taskActions.paginateTask
  });

  const tasklist = useCurrenTaskList();

  const loading = useSelector((state: RootState) => state.taskList.loading);

  useRxAsync(getAllTasklist, {
    onSuccess: tasklistActions.paginateTaskList
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
    <div className={[`task-list`, loading ? 'disabled' : ''].join(' ').trim()}>
      <TaskListHeader onConfirm={tasklistActions.newTaskList} />
      <div className="task-list-content">
        <NewTask />
        <div className="scroll-content">
          <TodoTaskList />
        </div>
        {<CompletedTaskList />}
      </div>
    </div>
  );
}
