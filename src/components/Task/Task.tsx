import React, { useState, useEffect, useCallback } from 'react';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskMenu } from './TaskMenu';
import { useMuiMenu } from '../Mui';
import { useAdvancedCallback, useBoolean } from '../../utils';
import { Schema$Task } from '../../typings';

interface Props {
  className?: string;
  task: Schema$Task;
  onChange(task: Schema$Task): void;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
}

export function Task({
  className = '',
  task: initialTask,
  onChange,
  deleteTask,
  toggleCompleted
}: Props) {
  const [task, setTask] = useState(initialTask);
  const [focus, { on, off }] = useBoolean(false);
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();

  const deleteTaskCallback = useAdvancedCallback(deleteTask, [task]);
  const toggleCompletedCallback = useAdvancedCallback(toggleCompleted, [task]);
  // const debouncedOnChangeCallback = useCallback(debounce(onChange, 500), [
  //   onChange
  // ]);

  // FIXME:
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <div
      className={[`task`, className, focus ? 'focus' : '']
        .filter(Boolean)
        .join(' ')
        .trim()}
      onContextMenu={setAnchorPosition}
    >
      <ToggleCompleted onClick={toggleCompletedCallback} />
      <input
        className="task-input"
        defaultValue={task.title}
        onChange={evt => {
          const title = evt.currentTarget.value;
          const updatedTask = { ...task, title };
          setTask(updatedTask);
          onChange(updatedTask);
        }}
        onFocus={on}
        onBlur={off}
      />
      <TaskMenu
        onClose={onClose}
        anchorPosition={anchorPosition}
        onDelete={deleteTaskCallback}
      />
    </div>
  );
}
