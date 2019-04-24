import React from 'react';
import { TaskInput, TaskInputProps } from './TaskInput';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

interface Props extends TaskInputProps {
  onDueDateBtnClick?(): void;
}

export function TaskInputWithDate({
  children,
  task,
  onDueDateBtnClick,
  ...props
}: Props) {
  return (
    <TaskInput task={task} {...props}>
      {task && task.due && (
        <div
          className="task-due-date-button"
          onClick={onDueDateBtnClick}
          data-date={dateFormat(new Date(task.due))}
        >
          <EventAvailableIcon />
        </div>
      )}
    </TaskInput>
  );
}

function dateFormat(d: Date) {
  const now = new Date();
  const dayDiff = Math.floor((+now - +d) / 1000 / 60 / 60 / 24);

  if (dayDiff === 0) {
    return 'Today';
  }

  if (dayDiff === -1) {
    return 'Tomorrow';
  }

  if (dayDiff < -1) {
    return d.format('D, j M');
  }

  if (dayDiff === 1) {
    return 'Yesterday';
  }

  if (dayDiff < 7) {
    return `${dayDiff} days ago`;
  }

  return `${Math.floor(dayDiff / 7)} weeks ago`;
}
