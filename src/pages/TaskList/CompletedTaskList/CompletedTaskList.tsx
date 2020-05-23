import React from 'react';
import { useSelector } from 'react-redux';
import { CompletedTask } from '../Task';
import { IconButton } from '../../../components/Mui';
import { useBoolean } from '../../../hooks/useBoolean';
import { completedTaskIdsSelector } from '../../../store';
import ExpandIcon from '@material-ui/icons/ExpandLess';
import CollapseIcon from '@material-ui/icons/ExpandMore';

export function CompletedTaskList() {
  const tasks = useSelector(completedTaskIdsSelector);
  const [expanded, , , toggle] = useBoolean();

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="completed-tasks-list">
      <div
        className="completed-tasks-list-inner"
        style={{
          transform: expanded ? 'translateY(0)' : undefined
        }}
      >
        <div className="completed-tasks-list-header" onClick={toggle}>
          Completed ({tasks.length})
          <IconButton icon={expanded ? CollapseIcon : ExpandIcon} />
        </div>
        <div className="completed-tasks-list-content">
          <div className="scroll-content">
            {tasks.map(uuid => (
              <CompletedTask key={uuid} uuid={uuid} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
