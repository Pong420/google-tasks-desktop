import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { TaskListHeader } from './TaskListHeader';
import { TodoTaskList } from './TodoTaskList';
import { NewTask } from './NewTask';
import { CompletedTaskList } from './CompletedTaskList';
import { tasklists, getAllTasklist, getAllTasks } from '../../service';
import {
  useTaskListActions,
  useTaskActions,
  taskIdsSelector
} from '../../store';
import { NProgress } from '../../utils/nprogress';
import { useCurrenTaskList } from '../../hooks/useCurrenTaskList';

const newTaskListReq = (title: string) =>
  tasklists.insert({ requestBody: { title } }).then(res => res.data);

export function TaskList() {
  const tasklistActions = useTaskListActions();
  const taskActions = useTaskActions();

  const { run: _getAllTasks } = useRxAsync(getAllTasks, {
    defer: true,
    onSuccess: taskActions.paginateTask
  });

  const { run: createTaskList, loading: loadingNewTaskList } = useRxAsync(
    newTaskListReq,
    {
      defer: true,
      onSuccess: tasklistActions.createTaskList
    }
  );

  const tasklist = useCurrenTaskList();

  const { todo, completed } = useSelector(taskIdsSelector);

  useRxAsync(getAllTasklist, {
    onSuccess: tasklistActions.paginateTaskList
  });

  useEffect(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    if (tasklist) {
      NProgress.start();
      _getAllTasks({ tasklist: tasklist.id });
    }
  }, [_getAllTasks, tasklist]);

  return (
    <div
      className={[`task-list`, loadingNewTaskList ? 'disabled' : '']
        .join(' ')
        .trim()}
    >
      <TaskListHeader onConfirm={createTaskList} />
      <div className="task-list-content">
        <NewTask />
        <div className="scroll-content">
          <TodoTaskList tasks={todo} />
        </div>
        {!!completed.length && <CompletedTaskList tasks={completed} />}
      </div>
    </div>
  );
}
