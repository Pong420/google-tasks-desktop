import React, { useMemo } from 'react';
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
  const [expanded, { toggle }] = useBoolean(false);
  const Icon = useMemo(() => (expanded ? CollapseIcon : ExpandIcon), [
    expanded
  ]);

  const style = useMemo(() => ({ height: expanded ? 'auto' : 0 }), [expanded]);

  if (!completedTasks.length) {
    return null;
  }

  return (
    <div className="completed-tasks-list">
      <div className="completed-tasks-list-header" onClick={toggle}>
        Completed ({completedTasks.length})
        <IconButton>
          <Icon fontSize="default" />
        </IconButton>
      </div>
      <div className="completed-tasks-list-content" style={style}>
        <ScrollContent>
          {completedTasks.map(task => {
            return (
              <CompletedTask
                key={task.uuid}
                task={task}
                deleteTask={deleteTask}
              />
            );
          })}
        </ScrollContent>
      </div>
    </div>
  );
}
