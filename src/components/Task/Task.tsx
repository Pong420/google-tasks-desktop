import React, { useState, useEffect } from 'react';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskMenu } from './TaskMenu';
import { useMuiMenu } from '../Mui';
import { useAdvancedCallback } from '../../utils';
import { Schema$Task } from '../../typings';

interface Props {
  className?: string;
  task: Schema$Task;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
}

// FIXME:
// A component is changing an uncontrolled input of type undefined to be controlled

export function Task({
  className = '',
  task: initialTask,
  deleteTask,
  toggleCompleted
}: Props) {
  const [task, setTask] = useState(initialTask);
  const [focus, setFocus] = useState<string>('');
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();

  const deleteTaskCallback = useAdvancedCallback(deleteTask, [task]);
  const toggleCompletedCallback = useAdvancedCallback(toggleCompleted, [task]);

  // FIXME:
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <div
      className={[`task`, className, focus]
        .filter(Boolean)
        .join(' ')
        .trim()}
      onContextMenu={setAnchorPosition}
    >
      <ToggleCompleted onClick={toggleCompletedCallback} />
      <input
        className="task-input"
        value={task.title}
        onChange={evt => setTask({ ...task, title: evt.currentTarget.value })}
        onFocus={() => setFocus('focus')}
        onBlur={() => setFocus('')}
      />
      <TaskMenu
        onClose={onClose}
        anchorPosition={anchorPosition}
        onDelete={deleteTaskCallback}
      />
    </div>
  );
}
