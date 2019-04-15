import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { tasks_v1 } from 'googleapis';
import { SortEnd } from 'react-sortable-hoc';
import { TodoTask } from '../Task';
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
  taskLists,
  taskListId,
  currentTaskList,
  getAllTasks,
  sortTasks,
  addTask,
  deleteTask,
  updateTask
}: TaskState & typeof TaskActionCreators & Props) {
  const addTaskCallback = useCallback(
    (requestBody?: tasks_v1.Schema$Task) => {
      return addTask({
        tasklist: taskListId,
        requestBody
      });
    },
    [addTask, taskListId]
  );

  const deleteTaskCallback = useCallback(
    (requestBody: Schema$Task) => {
      return deleteTask({
        tasklist: taskListId,
        task: requestBody.id,
        requestBody
      });
    },
    [deleteTask, taskListId]
  );

  const toggleCompletedCllaback = useCallback(
    (task: Schema$Task) => {
      if (!task.title || !task.title.trim()) {
        return deleteTaskCallback(task);
      }

      return updateTask({
        tasklist: taskListId,
        task: task.id,
        requestBody: {
          ...task,
          id: task.id,
          status: task.status === 'completed' ? 'needsAction' : 'completed'
        }
      });
    },
    [deleteTaskCallback, taskListId, updateTask]
  );

  const onChangeCallback = useCallback(
    (task: Schema$Task) => {
      return updateTask({
        tasklist: taskListId,
        task: task.id,
        requestBody: {
          ...task,
          id: task.id,
          title: task.title
        }
      });
    },
    [taskListId, updateTask]
  );

  useEffect(() => {
    taskListId &&
      getAllTasks({
        tasklist: taskListId
      });
  }, [getAllTasks, taskListId]);

  return (
    <>
      <div className="task-list-content">
        <div className="task-list-scroll-content">
          <NewTask addTask={addTaskCallback} />
          <TodoTasksList
            todoTasks={todoTasks}
            taskLists={taskLists}
            currentTaskList={currentTaskList}
            onChange={onChangeCallback}
            deleteTask={deleteTaskCallback}
            toggleCompleted={toggleCompletedCllaback}
            onSortEnd={sortTasks}
          />
        </div>
        <CompletedTasksList
          completedTasks={completedTasks}
          deleteTask={deleteTaskCallback}
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
