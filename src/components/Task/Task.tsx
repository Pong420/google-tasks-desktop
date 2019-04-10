import React, { useState, useEffect } from 'react';
import { Input } from '../Input';
import { tasks_v1 } from 'googleapis';

interface Props {
  className?: string;
  task: tasks_v1.Schema$Task;
  // onUpdate?(task: TaskData): void;
  // onDelete?(task: TaskData): void;
  // onToggleComplete?(task: TaskData): void;
}

// TODO:
// update on value change instead of blur

export function Task({
  className = '',
  task: defaultTask
}: // onToggleComplete,
// onDelete,
// onUpdate
Props) {
  const [task, setTask] = useState(defaultTask);

  useEffect(() => {
    setTask(defaultTask);
  }, [defaultTask]);

  return (
    <div className={`task ${className}`.trim()}>
      <div className="task-complete-toggle">
        <input type="checkbox" />
      </div>
      <Input
        className="task-title"
        value={task.title}
        onChange={evt =>
          setTask({
            ...task,
            title: evt.currentTarget.value
          })
        }
      />
    </div>
  );
}
