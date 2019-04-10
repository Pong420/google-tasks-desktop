import React from 'react';
import { NavLink, generatePath } from 'react-router-dom';
import { TaskListState } from '../../store';
import { PATHS } from '../../constants';

interface Props {
  taskLists: TaskListState['taskLists'];
}

export function TaskListHeader({ taskLists }: Props) {
  return (
    <div className="task-list-header">
      {taskLists.map(({ title, id }) => (
        <NavLink
          key={id}
          to={generatePath(PATHS.TASKLIST, {
            taskListId: id
          })}
        >
          {title}
        </NavLink>
      ))}
    </div>
  );
}
