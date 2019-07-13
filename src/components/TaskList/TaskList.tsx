import React, { useEffect } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { TaskListHeader } from '../TaskListHeader';
import { TodoTaskList } from './TodoTaskList';
import { CompletedTaskList } from './CompletedTaskList';
import { TodoTasksListSortByDate } from './TodoTasksListSortByDate';
import { NewTask } from '../NewTask';
import {
  RootState,
  getAllTasks,
  getAllTaskList,
  currentTaskListIdSelector
} from '../../store';
import { classes } from '../../utils/classes';

const mapStateToProps = (state: RootState) => {
  const { creatingNewTaskList, sortByDate } = state.taskList;
  return {
    creatingNewTaskList,
    currentTaskListId: currentTaskListIdSelector(state),
    showCompletedTaskList: !!state.task.completed.length,
    sortByDate
  };
};

function TaskListComponent({
  creatingNewTaskList,
  currentTaskListId,
  dispatch,
  showCompletedTaskList,
  sortByDate
}: ReturnType<typeof mapStateToProps> & DispatchProp) {
  useEffect(() => {
    dispatch(getAllTaskList());
  }, [dispatch]);

  useEffect(() => {
    currentTaskListId && dispatch(getAllTasks(currentTaskListId));
  }, [dispatch, currentTaskListId]);

  return (
    <div className={classes('task-list', creatingNewTaskList && 'disabled')}>
      <TaskListHeader />
      <div className="task-list-content">
        <NewTask />
        {sortByDate ? <TodoTasksListSortByDate /> : <TodoTaskList />}
        {showCompletedTaskList && <CompletedTaskList />}
      </div>
    </div>
  );
}

export const TaskList = connect(mapStateToProps)(TaskListComponent);
