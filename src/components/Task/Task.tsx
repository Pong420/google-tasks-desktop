import React, { useState, useEffect, useCallback } from 'react';
import { ToggleCompleted } from './ToggleCompleted';
import { Schema$Task } from '../../typings';

interface Props {
  className?: string;
  task: Schema$Task;
  deleteTask(task: Schema$Task): void;
  // onUpdate?(task: TaskData): void;
  // onDelete?(task: TaskData): void;
  // onToggleComplete?(task: TaskData): void;
}

// FIXME:
// A component is changing an uncontrolled input of type undefined to be controlled

export function Task({ className = '', task: initialTask, deleteTask }: Props) {
  const [task, setTask] = useState(initialTask);
  const [focus, setFocus] = useState<string>('');
  const wrappedDeleteTask = useCallback(() => deleteTask(task), [
    deleteTask,
    task
  ]);

  return (
    <div
      className={[`task`, className, focus]
        .filter(Boolean)
        .join(' ')
        .trim()}
    >
      <ToggleCompleted onClick={wrappedDeleteTask} />
      <input
        className="task-input"
        value={task.title}
        onChange={evt => setTask({ ...task, title: evt.currentTarget.value })}
        onFocus={() => setFocus('focus')}
        onBlur={() => setFocus('')}
      />
    </div>
  );
}
