import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { TodoTasksList, TodoTasksListSortByDate } from './TodoTasksList';
import { CompletedTasksList } from './CompletedTasksList';
import { NewTask } from '../NewTask';
import { ScrollContent } from '../ScrollContent';
import { TaskActionCreators, RootState } from '../../store';
import { Schema$Task } from '../../typings';

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
  newTask,
  deleteTask,
  updateTask,
  sortByDate,
  todoTasksSortByDate
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const toggleCompletedCllaback = useCallback(
    (task: Schema$Task) => {
      if (!task.title || !task.title.trim()) {
        return deleteTask(task);
      }

      return updateTask({
        ...task,
        status: task.status === 'completed' ? 'needsAction' : 'completed'
      });
    },
    [deleteTask, updateTask]
  );

  useEffect(() => {
    currentTaskListId && getAllTasks();
  }, [getAllTasks, currentTaskListId]);

  return (
    <>
      <div className="task-list-content">
        <NewTask newTask={newTask} />
        <ScrollContent className="task-list-scroll-content">
          {sortByDate ? (
            <TodoTasksListSortByDate
              todoTasksSortByDate={todoTasksSortByDate}
              toggleCompleted={toggleCompletedCllaback}
              focusIndex={focusIndex}
              setFocusIndex={setFocusIndex}
            />
          ) : (
            <TodoTasksList
              onSortEnd={moveTask}
              todoTasks={todoTasks}
              toggleCompleted={toggleCompletedCllaback}
              focusIndex={focusIndex}
              setFocusIndex={setFocusIndex}
            />
          )}
        </ScrollContent>
        <CompletedTasksList
          completedTasks={completedTasks}
          deleteTask={deleteTask}
          toggleCompleted={toggleCompletedCllaback}
        />
      </div>
    </>
  );
}

export const TaskListContent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListContentComponent);
