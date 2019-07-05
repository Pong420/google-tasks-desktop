import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';

export interface TaskProps {
  className?: string;
  uuid: number;
}

const mapStateToProps = (state: RootState, ownProps: TaskProps) => {
  return {
    ...ownProps,
    task: state.task.byIds[ownProps.uuid]
  };
};

function TaskComponent({
  className = '',
  task
}: ReturnType<typeof mapStateToProps>) {
  return <div className={`task ${className}`.trim()}>{task.title}</div>;
}

export const Task = connect(mapStateToProps)(TaskComponent);
