import React, { useState, useCallback } from 'react';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskMenu } from './TaskMenu';
import { EditTaskButton } from '../EditTaskButton';
import { useMuiMenu, Input } from '../Mui';
import { useAdvancedCallback, useBoolean } from '../../utils';
import { Schema$Task } from '../../typings';
import debounce from 'lodash/debounce';

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
  const debouncedOnChangeCallback = useCallback(debounce(onChange, 1000), [
    onChange
  ]);

  return (
    <div
      className={[`task`, className, focus ? 'focused' : '']
        .filter(Boolean)
        .join(' ')
        .trim()}
      onContextMenu={setAnchorPosition}
    >
      <ToggleCompleted onClick={toggleCompletedCallback} />
      <Input
        defaultValue={task.title}
        onChange={evt => {
          const title = evt.currentTarget.value;
          const updatedTask = { ...task, title };
          setTask(updatedTask);
          debouncedOnChangeCallback(updatedTask);
        }}
        onFocus={on}
        onBlur={off}
        endAdornment={<EditTaskButton />}
        fullWidth
        autoFocus
      />
      <TaskMenu
        onClose={onClose}
        anchorPosition={anchorPosition}
        onDelete={deleteTaskCallback}
      />
    </div>
  );
}
