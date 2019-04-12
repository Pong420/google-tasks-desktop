import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { tasks_v1 } from 'googleapis';
import { Task } from '../Task';
import { NewTask } from '../NewTask';
import { TaskState, TaskActionCreators, RootState } from '../../store';
import { Schema$Task } from '../../typings';

interface Props {
  taskListId: string;
}

const mapStateToProps = ({ task }: RootState) => ({ ...task });
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

function TaskListContentComponent({
  tasks,
  taskListId,
  getAllTasks,
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
    (task: Schema$Task) => {
      return deleteTask({
        taskListId,
        ...task
      });
    },
    [deleteTask, taskListId]
  );

  const toggleCompletedCllaback = useCallback(
    (task: Schema$Task) => {
      return updateTask({
        tasklist: taskListId,
        task: task.id,
        requestBody: {
          id: task.id,
          status: task.status === 'completed' ? 'needsAction' : 'completed'
        }
      });
    },
    [taskListId, updateTask]
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
    <div className="task-list-content">
      <NewTask addTask={addTaskCallback} />
      {tasks.map(task => (
        <Task
          key={task.uuid}
          task={task}
          onChange={onChangeCallback}
          deleteTask={deleteTaskCallback}
          toggleCompleted={toggleCompletedCllaback}
        />
      ))}
    </div>
  );
}

export const TaskListContent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListContentComponent);
