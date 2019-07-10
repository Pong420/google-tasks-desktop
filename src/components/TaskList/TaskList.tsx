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

const mapStateToProps = (state: RootState) => ({
  currentTaskListId: currentTaskListIdSelector(state),
  showCompletedTaskList: !!state.task.completed.length,
  sortByDate: state.taskList.sortByDate
});

function TaskListComponent({
  dispatch,
  currentTaskListId,
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
    <div className="task-list">
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
