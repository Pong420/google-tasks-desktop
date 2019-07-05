import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { generatePath } from 'react-router-dom';
import { push } from 'connected-react-router';
import { TaskListDropdown } from '../TaskListDropdown';
import { MenuItem } from '../Mui/Menu/MenuItem';
import { Schema$TaskList } from '../../typings';
import { RootState, currentTaskListSelector } from '../../store';
import { PATHS } from '../../constants';
import Divider from '@material-ui/core/Divider';

const mapStateToProps = (state: RootState) => ({
  currentTaskList: currentTaskListSelector(state)
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ push }, dispatch);

// TODO: Add create new task list

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

function TaskListHeaderComponent({ push }: Props) {
  const onSelectCallback = useCallback(
    ({ id }: Schema$TaskList) => {
      push(generatePath(PATHS.TASKLIST, { taskListId: id }));
    },
    [push]
  );

  return (
    <div className="task-list-header">
      <div />
      <div className="task-list-header-dropdown-container">
        <div className="task-list-header-dropdown-label">
          <span>TASKS</span>
        </div>
        <TaskListDropdown
          onSelect={onSelectCallback}
          paperClassName="task-list-header-dropdown-paper"
          outOfScrollContent={onClose => (
            <>
              <Divider />
              <MenuItem text="Create new list" onClose={onClose} />
            </>
          )}
        />
      </div>
    </div>
  );
}

export const TaskListHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListHeaderComponent);
