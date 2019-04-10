import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Task } from '../Task';
import { NewTask } from '../NewTask';
import { TaskState, TaskActionCreators, RootState } from '../../store';

interface Props {
  taskListId: string;
}

const mapStateToProps = ({ task }: RootState) => ({ ...task });
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

function TaskListContentComponent({
  tasks,
  taskListId,
  getAllTasks
}: TaskState & typeof TaskActionCreators & Props) {
  useEffect(() => {
    taskListId &&
      getAllTasks({
        tasklist: taskListId
      });
  }, [getAllTasks, taskListId]);

  return (
    <div className="task-list-content">
      <NewTask />
      {tasks.map(task => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
}

export const TaskListContent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListContentComponent);
