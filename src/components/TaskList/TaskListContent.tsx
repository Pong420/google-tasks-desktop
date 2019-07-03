import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { TodoTasksList, TodoTasksListSortByDate } from './TodoTasksList';
import { CompletedTasksList } from './CompletedTasksList';
import { NewTask } from './NewTask';
import { ScrollContent } from '../ScrollContent';
import { RootState, getAllTasks, newTask } from '../../store';

const mapStateToProps = ({
  task: { completedTasks },
  taskList: { currentTaskList, sortByDate }
}: RootState) => ({
  completedTasksLength: completedTasks.length,
  currentTaskList,
  sortByDate
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ getAllTasks, newTask }, dispatch);

function TaskListContentComponent({
  completedTasksLength,
  currentTaskList,
  getAllTasks,
  sortByDate,
  newTask
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  const fetch = currentTaskList && currentTaskList.id;

  useEffect(() => {
    fetch && getAllTasks();
  }, [fetch, getAllTasks]);

  return (
    <>
      <div className="task-list-content">
        <NewTask newTask={newTask} />
        <ScrollContent className="task-list-scroll-content">
          {sortByDate ? <TodoTasksListSortByDate /> : <TodoTasksList />}
        </ScrollContent>
        {!!completedTasksLength && (
          <CompletedTasksList length={completedTasksLength} />
        )}
      </div>
    </>
  );
}

export const TaskListContent = React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskListContentComponent)
);
