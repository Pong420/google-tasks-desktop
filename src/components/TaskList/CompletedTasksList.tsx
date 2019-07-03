import React, { useMemo, CSSProperties } from 'react';
import { CompletedTask } from '../Task';
import { ScrollContent } from '../ScrollContent';
import { IconButton } from '../Mui/IconButton';
import { Schema$Task } from '../../typings';
import { useBoolean } from '../../utils/useBoolean';
import ExpandIcon from '@material-ui/icons/ExpandLess';
import CollapseIcon from '@material-ui/icons/ExpandMore';

interface Props {
  completedTasks: Schema$Task[];
  deleteTask(task: Schema$Task): void;
}

export function CompletedTasksList({ completedTasks, deleteTask }: Props) {
  const [expanded, { toggle }] = useBoolean();

  const style = useMemo<CSSProperties>(
    () => ({
      transform: expanded ? 'translateY(0)' : undefined
    }),
    [expanded]
  );

  return (
    <div className="completed-tasks-list">
      <div className="completed-tasks-list-inner" style={style}>
        <div className="completed-tasks-list-header" onClick={toggle}>
          Completed ({completedTasks.length})
          <IconButton icon={expanded ? CollapseIcon : ExpandIcon} />
        </div>
        <div className="completed-tasks-list-content">
          <ScrollContent>
            {completedTasks.map(task => (
              <CompletedTask
                key={task.uuid}
                task={task}
                deleteTask={deleteTask}
              />
            ))}
          </ScrollContent>
        </div>
      </div>
    </div>
  );
}
