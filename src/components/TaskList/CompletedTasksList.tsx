import React, { useMemo, CSSProperties } from 'react';
import { CompletedTask } from '../Task';
import { ScrollContent } from '../ScrollContent';
import { IconButton } from '../Mui/IconButton';
import { useBoolean } from '../../utils/useBoolean';
import ExpandIcon from '@material-ui/icons/ExpandLess';
import CollapseIcon from '@material-ui/icons/ExpandMore';

interface Props {
  length: number;
}

export const CompletedTasksList = React.memo<Props>(({ length }) => {
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
          Completed ({length})
          <IconButton icon={expanded ? CollapseIcon : ExpandIcon} />
        </div>
        <div className="completed-tasks-list-content">
          <ScrollContent>
            {Array.from({ length }, (_, index) => (
              <CompletedTask key={index} index={index} />
            ))}
          </ScrollContent>
        </div>
      </div>
    </div>
  );
});
