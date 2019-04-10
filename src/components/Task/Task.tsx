import React, { useState, useEffect } from 'react';
import { ToggleCompleted } from './ToggleCompleted';
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
  const [focus, setFocus] = useState<string>('');

  useEffect(() => {
    setTask(defaultTask);
  }, [defaultTask]);

  return (
    <div
      className={[`task`, className, focus]
        .filter(Boolean)
        .join(' ')
        .trim()}
    >
      <ToggleCompleted />
      <input
        className="task-input"
        value={task.title}
        onChange={evt =>
          setTask({
            ...task,
            title: evt.currentTarget.value
          })
        }
        onFocus={() => setFocus('focus')}
        onBlur={() => setFocus('')}
      />
    </div>
  );
}
