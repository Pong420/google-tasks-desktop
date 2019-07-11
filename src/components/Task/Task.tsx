import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  ChangeEvent,
  ReactNode,
  MouseEvent
} from 'react';
import { Input, InputProps } from '../Mui/Input';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput, TaskInputProps } from './TaskInput';
import { Schema$Task } from '../../typings';

export interface TaskProps
  extends InputProps,
    Pick<Schema$Task, 'uuid' | 'title'>,
    TaskInputProps {
  className?: string;
  endAdornment?: ReactNode;
  onContextMenu?(evt: MouseEvent<HTMLDivElement>): void;
}

export function Task({
  className = '',
  due,
  notes,
  onDueDateBtnClick,
  endAdornment,
  onContextMenu,
  onChange,
  onBlur,
  onFocus,
  title,
  uuid,
  ...inputProps
}: TaskProps) {
  const [value, setValue] = useState(title || '');

  const timeout = useRef(0);
  const onChangeCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      evt.persist();
      clearTimeout(timeout.current);
      setValue(evt.currentTarget.value);
      if (onChange) {
        timeout.current = window.setTimeout(() => onChange(evt), 250);
      }
    },
    [onChange]
  );

  const taskInputProps = useMemo<TaskInputProps>(
    () => ({
      due,
      notes,
      onDueDateBtnClick,
      onBlur,
      onFocus,
      onChange: onChangeCallback
    }),
    [due, notes, onDueDateBtnClick, onBlur, onFocus, onChangeCallback]
  );

  useEffect(() => {
    title && setValue(title);
  }, [title]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <div className={`task ${className}`.trim()} onContextMenu={onContextMenu}>
      <ToggleCompleted isEmpty={!value.trim()} uuid={uuid} />
      <Input
        {...inputProps}
        className="task-input-base"
        endAdornment={
          <div className="task-input-base-end-adornment">{endAdornment}</div>
        }
        fullWidth
        inputComponent={TaskInput}
        inputProps={taskInputProps}
        onChange={onChangeCallback}
        value={value}
      />
    </div>
  );
}
