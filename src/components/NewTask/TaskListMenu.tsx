import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TaskListState, TaskListActionCreators, RootState } from '../../store';
import { useMenuItem } from '../Mui';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import pkg from '../../../package.json';

interface Props {
  anchorEl: HTMLElement | null;
  onClose(): void;
}

interface MatchParams {
  taskListId: string;
}

const mapStateToProps = ({ taskList }: RootState) => ({ ...taskList });
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskListActionCreators, dispatch);

function TaskListMenuComponent({
  match: { params },
  anchorEl,
  onClose,
  taskLists,
  completedTaskLists
}: Props & RouteComponentProps<MatchParams> & TaskListState) {
  const MenuItem = useMenuItem(onClose);

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
        disabled={!taskLists[0] || taskLists[0].id === params.taskListId}
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

export const TaskListMenu = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskListMenuComponent)
);
