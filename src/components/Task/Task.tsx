import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  MouseEvent,
  ChangeEvent
} from 'react';
import { InputProps } from '@material-ui/core/Input';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskContextMenu } from './TaskContextMenu';
import { useMuiMenu, Input } from '../Mui';
import { useAdvancedCallback } from '../../utils/useAdvancedCallback';
import { Schema$Task } from '../../typings';

export interface TaskProps {
  className?: string;
  task: Schema$Task;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
  endAdornment: ReactNode;
  inputProps?: InputProps;
  updateTask?(task: Schema$Task): void;
}

export function Task({
  className = '',
  task: initialTask,
  updateTask,
  deleteTask,
  toggleCompleted,
  endAdornment,
  inputProps
}: TaskProps) {
  const [task, setTask] = useState(initialTask);
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();
  const deleteTaskCallback = useAdvancedCallback(deleteTask, [task]);
  const toggleCompletedCallback = useAdvancedCallback(toggleCompleted, [task]);

  const inputRef = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    (evt: MouseEvent<HTMLElement>) =>
      evt.target === inputRef.current!.parentElement &&
      inputRef.current!.focus(),
    []
  );

  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      const title = evt.currentTarget.value;
      const updatedTask = { ...task, title };
      setTask(updatedTask);
      updateTask && updateTask(updatedTask);
    },
    [task, updateTask]
  );

  // FIXME:
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <div
      className={[`task`, className]
        .filter(Boolean)
        .join(' ')
        .trim()}
      onContextMenu={setAnchorPosition}
    >
      <ToggleCompleted
        onClick={toggleCompletedCallback}
        completed={task.status === 'completed'}
      />
      <Input
        autoFocus={!task.id}
        multiline
        fullWidth
        defaultValue={task.title}
        inputRef={inputRef}
        endAdornment={endAdornment}
        onChange={onChangeCallback}
        onClick={focus}
        {...inputProps}
      />
      <TaskContextMenu
        onClose={onClose}
        anchorPosition={anchorPosition}
        onDelete={deleteTaskCallback}
      />
    </div>
  );
}
