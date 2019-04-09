import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import {
  RootState,
  AuthsState,
  TaskListState,
  TaskListActionCreators
} from '../../store';
import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  taskListId: string;
}

const mapStateToProps = ({ auth, taskList }: RootState, ownProps: any) => ({
  ...auth,
  ...taskList,
  ...ownProps
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskListActionCreators, dispatch);

function TaskListComponent({
  match: { params },
  loggedIn,
  taskLists,
  syncTaskList,
  addTaskList
}: AuthsState &
  TaskListState &
  RouteComponentProps<MatchParams> &
  typeof TaskListActionCreators) {
  const currentTaskList = useMemo(() => {
    let current = taskLists[0];
    if (params.taskListId) {
      current =
        taskLists.find(([uuid]) => uuid === params.taskListId) || current;
    }

    return current ? current[1] : null;
  }, [params.taskListId, taskLists]);

  useEffect(() => {
    if (!taskLists.length && loggedIn) {
      syncTaskList();
    }
  }, [syncTaskList, loggedIn, taskLists.length]);

  return (
    <div className="task-list">
      <div className="task-list-header">
        {currentTaskList && currentTaskList.title}
      </div>
    </div>
  );
}

export const TaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListComponent);
