import React, { useState, useEffect } from 'react';
import { Input } from '../Input';
import { Task as TaskData } from '../../typings';

interface Props {
  className?: string;
  task: TaskData;
  onUpdate?(task: TaskData): void;
  onDelete?(task: TaskData): void;
  onToggleComplete?(task: TaskData): void;
}

// TODO:
// update on value change instead of blur

export function Task({
  className = '',
  task: defaultTask,
  onToggleComplete,
  onDelete,
  onUpdate
}: Props) {
  const [task, setTask] = useState(defaultTask);

  useEffect(() => {
    setTask(defaultTask);
  }, [defaultTask]);

  return (
    <div className={`task ${className}`.trim()}>
      <Input
        value={task.title}
        onChange={evt =>
          setTask({
            ...task,
            title: evt.currentTarget.value
          })
        }
        onBlur={() => onUpdate && onUpdate(task)}
      />
      <button>{!!task.completed ? 'Undo' : 'Complete'}</button>
      <button onClick={() => onDelete && onDelete(task)}>Delete</button>
    </div>
  );
}
