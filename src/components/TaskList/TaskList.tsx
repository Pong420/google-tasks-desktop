import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TaskListHeader } from '../TaskListHeader';
import { TodoTaskList } from '../TaskList/TodoTaskList';
import { CompletedTaskList } from '../TaskList/CompletedTaskList';
import { NewTask } from '../NewTask';
import { ScrollContent } from '../ScrollContent';
import {
  RootState,
  getAllTasks,
  getAllTaskList,
  currentTaskListIdSelector
} from '../../store';

const mapStateToProps = (state: RootState) => ({
  currentTaskListId: currentTaskListIdSelector(state),
  showCompleted: !!state.task.completed.length
});

function TaskListComponent({
  dispatch,
  currentTaskListId,
  showCompleted
}: ReturnType<typeof mapStateToProps> & { dispatch: Dispatch }) {
  useEffect(() => {
    dispatch(getAllTaskList());
  }, [dispatch]);

  useEffect(() => {
    currentTaskListId && dispatch(getAllTasks(currentTaskListId));
  }, [dispatch, currentTaskListId]);

  return (
    <div className="task-list">
      <TaskListHeader />
      <div className="task-list-content">
        <NewTask />
        <ScrollContent>
          <TodoTaskList />
        </ScrollContent>
        {showCompleted && <CompletedTaskList />}
      </div>
    </div>
  );
}

export const TaskList = connect(mapStateToProps)(TaskListComponent);
