import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { matchPath } from 'react-router-dom';
import { TaskListActionCreators, RootState } from '../../store';
import { useMenuItem, Menu } from '../Mui';
import { PATHS } from '../../constants';
import Divider from '@material-ui/core/Divider';
import pkg from '../../../package.json';

interface Props {
  anchorEl: HTMLElement | null;
  onClose(): void;
}

interface MatchParams {
  taskListId?: string;
}

const mapStateToProps = ({ taskList, router }: RootState) => ({
  ...taskList,
  match: matchPath<MatchParams>(router.location.pathname, {
    path: PATHS.TASKLIST
  })!
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskListActionCreators, dispatch);

function TaskListMenuComponent({
  anchorEl,
  onClose,
  taskLists,
  delteTaskList,
  completedTaskLists,
  match
}: Props & ReturnType<typeof mapStateToProps> & typeof TaskListActionCreators) {
  const MenuItem = useMenuItem(onClose);
  const delteTaskListCallback = useCallback(
    () => match.params.taskListId && delteTaskList(match.params.taskListId),
    [delteTaskList, match.params.taskListId]
  );

  return (
    <Menu
      classes={{ paper: 'task-list-menu-paper' }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      <div className="task-list-menu-title">Sort by</div>
      <MenuItem text="My order" selected />
      <MenuItem text="Date" />
      <Divider />
      <MenuItem text="Rename list" />
      <MenuItem
        text="Delete list"
        disabled={!taskLists[0] || taskLists[0].id === match.params.taskListId}
        onClick={delteTaskListCallback}
      />
      <MenuItem
        text="Delete all completed tasks"
        disabled={!completedTaskLists.length}
      />
      <Divider />
      <MenuItem text="Keyboard shortcuts" />
      <MenuItem
        text="Github"
        onClick={() => window.open(pkg.repository.url, 'blank')}
      />
    </Menu>
  );
}

export const TaskListMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListMenuComponent);
