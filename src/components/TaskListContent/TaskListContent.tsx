import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { TodoTask } from '../Task';
import { getAllTasks } from '../../service';
import { useTaskActions, taskIdsSelector } from '../../store';
import { NProgress } from '../../utils/nprogress';

interface Props {
  tasklist?: string;
}

export function TaskListContent({ tasklist }: Props) {
  const { paginateTask } = useTaskActions();
  const { run } = useRxAsync(getAllTasks, {
    defer: true,
    onSuccess: paginateTask
  });

  const { todo } = useSelector(taskIdsSelector);

  useEffect(() => {
    if (tasklist) {
      NProgress.start();
      run({ tasklist });
    }
  }, [run, tasklist]);

  return (
    <div className="task-list-content">
      {todo.map(uuid => (
        <TodoTask key={uuid} uuid={uuid} />
      ))}
    </div>
  );
}
