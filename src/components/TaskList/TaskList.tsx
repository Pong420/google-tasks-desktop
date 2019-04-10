import React, { useMemo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import {
  RootState,
  AuthsState,
  TaskListState,
  TaskListActionCreators
} from '../../store';
import { RouteComponentProps } from 'react-router-dom';
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent } from './TaskListContent';

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
  getAllTaskList
}: AuthsState &
  TaskListState &
  RouteComponentProps<MatchParams> &
  typeof TaskListActionCreators) {
  const currentTaskList = useMemo(() => {
    let current = taskLists[0];
    if (params.taskListId) {
      current = taskLists.find(({ id }) => id === params.taskListId) || current;
    }

    return current || null;
  }, [params.taskListId, taskLists]);

  useEffect(() => {
    loggedIn && getAllTaskList();
  }, [getAllTaskList, loggedIn]);

  return (
    <div className="task-list">
      <TaskListHeader taskLists={taskLists} />
      <TaskListContent
        taskListId={currentTaskList ? currentTaskList.id! : ''}
      />
    </div>
  );
}

export const TaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListComponent);
