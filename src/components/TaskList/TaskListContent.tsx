import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { TodoTasksList, TodoTasksListSortByDate } from './TodoTasksList';
import { CompletedTasksList } from './CompletedTasksList';
import { NewTask } from './NewTask';
import { ScrollContent } from '../ScrollContent';
import { RootState, TaskActionCreators } from '../../store';

const mapStateToProps = ({
  task: { todoTasks, completedTasks },
  taskList: { currentTaskList, sortByDate }
}: RootState) => ({
  todoTasks,
  completedTasksLength: completedTasks.length,
  currentTaskList,
  sortByDate
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

function TaskListContentComponent({
  todoTasks,
  completedTasksLength,
  currentTaskList,
  getAllTasks,
  moveTask,
  deleteTask,
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
          {sortByDate ? (
            <TodoTasksListSortByDate todoTasks={todoTasks} />
          ) : (
            <TodoTasksList onSortEnd={moveTask} todoTasks={todoTasks} />
          )}
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
