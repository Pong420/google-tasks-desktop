import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { RootState, getAllTaskList } from '../../store';
import { TaskListHeader } from './TaskListHeader';
import { TaskListContent } from './TaskListContent';
import { classes } from '../../utils/classes';

const mapStateToProps = ({
  auth: { loggedIn },
  taskList: { creatingNewTaskList }
}: RootState) => ({
  loggedIn,
  creatingNewTaskList
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ getAllTaskList }, dispatch);

function TaskListComponent({
  loggedIn,
  getAllTaskList,
  creatingNewTaskList
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  useEffect(() => {
    loggedIn && getAllTaskList();
  }, [getAllTaskList, loggedIn]);

  return (
    <div className={classes('task-list', creatingNewTaskList && 'disabled')}>
      <TaskListHeader />
      <TaskListContent />
    </div>
  );
}

export const TaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListComponent);
