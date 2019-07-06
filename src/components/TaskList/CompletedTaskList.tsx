import React, { useMemo, CSSProperties } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { CompletedTask } from '../Task';
import { ScrollContent } from '../ScrollContent';
import { IconButton } from '../Mui/IconButton';
import { RootState } from '../../store';
import { useBoolean } from '../../utils/useBoolean';
import ExpandIcon from '@material-ui/icons/ExpandLess';
import CollapseIcon from '@material-ui/icons/ExpandMore';

// TODO: check slice();
const mapStateToProps = (state: RootState) => ({
  completedTasks: state.task.completed.slice()
});

function CompletedTasksListComponent({
  completedTasks
}: ReturnType<typeof mapStateToProps> & DispatchProp) {
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
            {completedTasks.map(uuid => (
              <CompletedTask key={uuid} uuid={uuid} />
            ))}
          </ScrollContent>
        </div>
      </div>
    </div>
  );
}

export const CompletedTaskList = connect(mapStateToProps)(
  CompletedTasksListComponent
);
