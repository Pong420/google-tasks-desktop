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
import { TaskMenu } from './TaskMenu';
import { useMuiMenu, Input } from '../Mui';
import { useAdvancedCallback } from '../../utils/useAdvancedCallback';
import { Schema$Task } from '../../typings';
import debounce from 'lodash/debounce';

export interface TaskProps {
  className?: string;
  task: Schema$Task;
  onChange?(task: Schema$Task): void;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
  endAdornment: ReactNode;
  inputProps?: InputProps;
}

export function Task({
  className = '',
  task: initialTask,
  onChange,
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

  // FIXME: remove debouce
  const debouncedOnChangeCallback = useCallback(
    onChange ? debounce(onChange, 0) : () => {},
    [onChange]
  );
  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      const title = evt.currentTarget.value;
      const updatedTask = { ...task, title };
      setTask(updatedTask);
      debouncedOnChangeCallback(updatedTask);
    },
    [debouncedOnChangeCallback, task]
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
      <TaskMenu
        onClose={onClose}
        anchorPosition={anchorPosition}
        onDelete={deleteTaskCallback}
      />
    </div>
  );
}
