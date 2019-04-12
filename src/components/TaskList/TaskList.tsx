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
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent } from './TaskListContent';

interface MatchParams {
  taskListId?: string;
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
  creatingNewTaskList,
  getAllTaskList,
  addTaskList
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
    <div
      className={['task-list', creatingNewTaskList && 'disabled']
        .filter(Boolean)
        .join(' ')
        .trim()}
    >
      <TaskListHeader
        addTaskList={addTaskList}
        currentTaskList={currentTaskList}
        taskLists={taskLists}
      />
      <TaskListContent
        taskListId={currentTaskList ? currentTaskList.id! : ''}
        taskLists={taskLists}
        currentTaskList={currentTaskList}
      />
    </div>
  );
}

export const TaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListComponent);
