import React from 'react';
import { NavLink, generatePath } from 'react-router-dom';
import { tasks_v1 } from 'googleapis';
import { TaskListState } from '../../store';
import { PATHS } from '../../constants';

interface Props {
  taskLists: TaskListState['taskLists'];
  currentTaskList: tasks_v1.Schema$TaskList;
}

export function TaskListHeader({ taskLists, currentTaskList }: Props) {
  return (
    <div className="task-list-header">
      <div className="task-list-menu">
        <div className="task-list-menu-label">TASKS</div>
        <div>{currentTaskList && currentTaskList.title}</div>
      </div>
    </div>
  );
}
