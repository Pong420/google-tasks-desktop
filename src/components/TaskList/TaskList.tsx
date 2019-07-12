import React, { useEffect, useRef } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { TaskListHeader } from '../TaskListHeader';
import { TodoTaskList } from './TodoTaskList';
import { CompletedTaskList } from './CompletedTaskList';
import { TodoTasksListSortByDate } from './TodoTasksListSortByDate';
import { NewTask } from '../NewTask';
import { ScrollContent } from '../ScrollContent';
import {
  RootState,
  getAllTasks,
  getAllTaskList,
  currentTaskListIdSelector
} from '../../store';
import { SimplebarAPI } from '../../typings';
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
  const simplebarRef = useRef<SimplebarAPI>(null);

  useEffect(() => {
    dispatch(getAllTaskList());
  }, [dispatch]);

  useEffect(() => {
    currentTaskListId && dispatch(getAllTasks(currentTaskListId));
  }, [dispatch, currentTaskListId]);

  useEffect(() => {
    const el = simplebarRef.current && simplebarRef.current.getScrollElement();
    el && el.scrollTo(0, 0);
  }, [sortByDate]);

  return (
    <div className={classes('task-list', creatingNewTaskList && 'disabled')}>
      <TaskListHeader />
      <div className="task-list-content">
        <NewTask />
        <ScrollContent simplebarRef={simplebarRef}>
          {sortByDate ? <TodoTasksListSortByDate /> : <TodoTaskList />}
        </ScrollContent>
        {showCompletedTaskList && <CompletedTaskList />}
      </div>
    </div>
  );
}

export const TaskList = connect(mapStateToProps)(TaskListComponent);
