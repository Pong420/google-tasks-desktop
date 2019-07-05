import React from 'react';
import { connect } from 'react-redux';
import { Task } from '../Task';
import { RootState } from '../../../store';
import { Schema$Task } from '../../../typings';

interface Props extends Pick<Schema$Task, 'uuid'> {}

const mapStateToProps = (state: RootState, ownProps: Props) => {
  return {
    ...ownProps,
    task: state.task.byIds[ownProps.uuid]
  };
};

export function TodoTaskComponent({
  task
}: ReturnType<typeof mapStateToProps>) {
  return <Task uuid={task.uuid} title={task.title} className="todo-task" />;
}

export const TodoTask = connect(mapStateToProps)(TodoTaskComponent);
