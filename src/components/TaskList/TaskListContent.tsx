import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { TaskState, TaskActionCreators, RootState } from '../../store';
import { Task } from '../Task';

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
