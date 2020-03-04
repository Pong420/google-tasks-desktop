import React from 'react';
import { CompletedTask } from '../Task';
import { IconButton } from '../Mui/IconButton';
import { useBoolean } from '../../hooks/useBoolean';
import ExpandIcon from '@material-ui/icons/ExpandLess';
import CollapseIcon from '@material-ui/icons/ExpandMore';

interface Props {
  tasks: string[];
}

export function CompletedTaskList({ tasks }: Props) {
  const [expanded, , , toggle] = useBoolean();

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
