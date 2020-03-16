import React, { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useRxInput, RxInputPipe } from 'use-rx-hooks';
import { debounceTime } from 'rxjs/operators';
import { Input, InputProps } from '../../../components/Mui';
import { taskSelector, useTaskActions } from '../../../store';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput } from './TaskInput';

export interface TaskProps extends InputProps {
  className?: string;
  uuid: string;
  endAdornment?: ReactNode;
}

const debounce: RxInputPipe<string> = ob => ob.pipe(debounceTime(250));

export const Task = React.forwardRef<HTMLDivElement, TaskProps>(
  ({ className, uuid, endAdornment, ...inputProps }, ref) => {
    const { updateTask } = useTaskActions();
    const { title, due, notes } = useSelector(taskSelector(uuid)) || {};
    const [value, inputHandler] = useRxInput({
      defaultValue: title || '',
      pipe: debounce
    });

    useEffect(() => {
      if (typeof value !== 'undefined' && value !== title) {
        updateTask({ uuid, title: value });
      }
    }, [uuid, title, value, updateTask]);

    return (
      <div
        className={['task', className]
          .filter(Boolean)
          .join(' ')
          .trim()}
        ref={ref}
      >
        <ToggleCompleted isEmpty={!value || !value.trim()} uuid={uuid} />
        <Input
          {...inputProps}
          {...inputHandler}
          fullWidth
          className="task-input-base"
          inputProps={{ due, notes }}
          inputComponent={TaskInput as InputProps['inputComponent']}
          endAdornment={
            <div className="task-input-base-end-adornment">{endAdornment}</div>
          }
        />
      </div>
    );
  }
);
