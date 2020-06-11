import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { TaskListHeader } from './TaskListHeader';
import { TodoTaskList } from './TodoTaskList';
import { NewTask } from './NewTask';
import { CompletedTaskList } from './CompletedTaskList';
import { getAllTasklist, getAllTasks } from '../../service';
import {
  useTaskListActions,
  useTaskActions,
  RootState,
  currentTaskListsSelector
} from '../../store';
import { NProgress } from '../../utils/nprogress';

export function TaskList() {
  const { paginateTaskList, newTaskList } = useTaskListActions();
  const { paginateTask } = useTaskActions();

  const currentTasklist = useSelector(currentTaskListsSelector);
  const taskListId = currentTasklist && currentTasklist.id;

  const disabled = useSelector((state: RootState) => state.taskList.loading);

  useRxAsync(getAllTasklist, {
    onSuccess: paginateTaskList
  });

  const { run } = useRxAsync(getAllTasks, {
    defer: true,
    onSuccess: paginateTask
  });

  useEffect(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    if (taskListId) {
      NProgress.start();
      run({ tasklist: taskListId });
    }
  }, [run, taskListId]);

  return (
    <div className={[`task-list`, disabled ? 'disabled' : ''].join(' ').trim()}>
      <TaskListHeader onConfirm={newTaskList} />
      <div className="task-list-content">
        <NewTask />
        <div className="scroll-content">
          <TodoTaskList />
        </div>
        <CompletedTaskList key={taskListId} />
      </div>
    </div>
  );
}
