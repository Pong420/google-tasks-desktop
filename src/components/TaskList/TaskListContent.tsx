import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { TodoTasksList, TodoTasksListSortByDate } from './TodoTasksList';
import { CompletedTasksList } from './CompletedTasksList';
import { NewTask } from '../NewTask';
import { ScrollContent } from '../ScrollContent';
import { TaskActionCreators, RootState } from '../../store';

const mapStateToProps = ({ task, taskList }: RootState) => ({
  ...task,
  ...taskList
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

function TaskListContentComponent({
  todoTasks,
  completedTasks,
  currentTaskListId,
  getAllTasks,
  moveTask,
  deleteTask,
  sortByDate,
  newTask
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  useEffect(() => {
    currentTaskListId && getAllTasks();
  }, [getAllTasks, currentTaskListId]);

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
        <CompletedTasksList
          deleteTask={deleteTask}
          completedTasks={completedTasks}
        />
      </div>
    </>
  );
}

export const TaskListContent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListContentComponent);
