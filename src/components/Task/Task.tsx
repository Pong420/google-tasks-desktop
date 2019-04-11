import React, { useState, useEffect, useCallback, MouseEvent } from 'react';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskMenu, AnchorPosition } from './TaskMenu';
import { Schema$Task } from '../../typings';

interface Props {
  className?: string;
  task: Schema$Task;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
}

// FIXME:
// A component is changing an uncontrolled input of type undefined to be controlled
function wrapper<T extends (...args: any[]) => any>(
  callback: T,
  args: Parameters<T>
): any {
  return useCallback(() => callback(...args), [args, callback]);
}

export function Task({
  className = '',
  task: initialTask,
  deleteTask,
  toggleCompleted
}: Props) {
  const [task, setTask] = useState(initialTask);
  const [focus, setFocus] = useState<string>('');

  const wrappedDeleteTask = wrapper(deleteTask, [task]);
  const wrappedToggleCompleted = wrapper(toggleCompleted, [task]);

  const onClose = useCallback(() => setAnchorPosition(undefined), []);
  const [anchorPosition, setAnchorPosition] = useState<
    AnchorPosition | undefined
  >();

  const onContextMenu = useCallback((evt: MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setAnchorPosition({
      top: evt.pageY,
      left: evt.pageX
    });
  }, []);

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
      onContextMenu={onContextMenu}
    >
      <ToggleCompleted onClick={wrappedToggleCompleted} />
      <input
        className="task-input"
        value={task.title}
        onChange={evt => setTask({ ...task, title: evt.currentTarget.value })}
        onFocus={() => setFocus('focus')}
        onBlur={() => setFocus('')}
      />
      <TaskMenu
        anchorPosition={anchorPosition}
        onClose={onClose}
        onDelete={wrappedDeleteTask}
      />
    </div>
  );
}
