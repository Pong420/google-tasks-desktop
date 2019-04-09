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
  getAllTaskList,
  addTaskList
}: AuthsState &
  TaskListState &
  RouteComponentProps<MatchParams> &
  typeof TaskListActionCreators) {
  const currentTaskList = useMemo(() => {
    let current = taskLists[0];
    if (params.taskListId) {
      current =
        taskLists.find(({ tid }) => tid === params.taskListId) || current;
    }

    return current || null;
  }, [params.taskListId, taskLists]);

  useEffect(() => {
    loggedIn && getAllTaskList();
  }, [getAllTaskList, loggedIn]);

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
