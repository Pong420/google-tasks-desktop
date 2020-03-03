import React from 'react';
import { useSelector } from 'react-redux';
import { taskSelector } from '../../store';

export interface TaskProps {
  uuid: string;
}

export function Task({ uuid }: TaskProps) {
  const task = useSelector(taskSelector(uuid));
  return <div className="task">{task && task.title}</div>;
}
