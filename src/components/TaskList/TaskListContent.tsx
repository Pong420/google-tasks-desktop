import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { TodoTasksList } from './TodoTasksList';
import { CompletedTasksList } from './CompletedTasksList';
import { NewTask } from '../NewTask';
import { TaskState, TaskActionCreators, RootState } from '../../store';
import { Schema$Task, Schema$TaskList } from '../../typings';

interface Props {
  taskListId: string;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
}

const mapStateToProps = ({ task }: RootState) => ({ ...task });
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

function TaskListContentComponent({
  todoTasks,
  completedTasks,
  taskListId,
  getAllTasks,
  moveTask,
  addTask,
  deleteTask,
  updateTask
}: TaskState & typeof TaskActionCreators & Props) {
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
    taskListId && getAllTasks();
  }, [getAllTasks, taskListId]);

  return (
    <>
      <div className="task-list-content">
        <div className="task-list-scroll-content">
          <NewTask addTask={addTask} setFocusIndex={setFocusIndex} />
          <TodoTasksList
            onSortEnd={moveTask}
            todoTasks={todoTasks}
            toggleCompleted={toggleCompletedCllaback}
            focusIndex={focusIndex}
            setFocusIndex={setFocusIndex}
          />
        </div>
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
