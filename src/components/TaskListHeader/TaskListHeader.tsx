import React from 'react';
import { generatePath } from 'react-router-dom';
import { TaskListDropdown } from '../TaskListDropdown';
import { history } from '../../store';
import { PATHS } from '../../constants';

export function TaskListHeader() {
  return (
    <div className="task-list-header">
      <div className="status" /> {/* TODO: */}
      <div className="task-list-header-dropdown-container">
        <div className="task-list-header-dropdown-label">
          <span>TASKS</span>
        </div>
        <TaskListDropdown
          paperClassName="task-list-header-dropdown-paper"
          onSelect={({ id }) =>
            history.push(generatePath(PATHS.TASKLIST, { taskListId: id }))
          }
        />
      </div>
    </div>
  );
}
