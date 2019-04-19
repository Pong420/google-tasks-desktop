import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import {
  RootState,
  AuthsState,
  TaskListState,
  TaskListActionCreators
} from '../../store';
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent } from './TaskListContent';
import { classes } from '../../utils/classes';

const mapStateToProps = ({ auth, taskList }: RootState) => ({
  ...auth,
  ...taskList
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskListActionCreators, dispatch);

function TaskListComponent({
  loggedIn,
  taskLists,
  currentTaskList,
  creatingNewTaskList,
  getAllTaskList,
  newTaskList
}: AuthsState & TaskListState & typeof TaskListActionCreators) {
  useEffect(() => {
    loggedIn && getAllTaskList();
  }, [getAllTaskList, loggedIn]);

  return (
    <div className={classes('task-list', creatingNewTaskList && 'disabled')}>
      <TaskListHeader
        newTaskList={newTaskList}
        currentTaskList={currentTaskList!}
        taskLists={taskLists}
      />
      <TaskListContent
        taskListId={currentTaskList ? currentTaskList.id! : ''}
        taskLists={taskLists}
        currentTaskList={currentTaskList!}
      />
    </div>
  );
}

export const TaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListComponent);
