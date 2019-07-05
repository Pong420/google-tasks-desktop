import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TodoTaskList } from './TodoTaskList';
import {
  RootState,
  getAllTasks,
  getAllTaskList,
  currentTaskListIdSelector
} from '../../store';

const mapStateToProps = (state: RootState) => ({
  currentTaskListId: currentTaskListIdSelector(state)
});

function TaskListComponent({
  dispatch,
  currentTaskListId
}: ReturnType<typeof mapStateToProps> & { dispatch: Dispatch }) {
  useEffect(() => {
    dispatch(getAllTaskList());
  }, [dispatch]);

  useEffect(() => {
    currentTaskListId && dispatch(getAllTasks(currentTaskListId));
  }, [dispatch, currentTaskListId]);

  return (
    <>
      <TodoTaskList />
    </>
  );
}

export const TaskList = connect(mapStateToProps)(TaskListComponent);
