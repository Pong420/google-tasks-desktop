import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useRxInput } from 'use-rx-hooks';
import { Input, InputProps } from '../Mui';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput } from './TaskInput';
import { taskSelector } from '../../store';

export interface TaskProps extends InputProps {
  className?: string;
  uuid: string;
  endAdornment?: ReactNode;
}

export const Task = React.forwardRef<HTMLDivElement, TaskProps>(
  ({ className, uuid, endAdornment, ...inputProps }, ref) => {
    const { title, due, notes } = useSelector(taskSelector(uuid)) || {};
    const [value, inputHandler] = useRxInput({
      defaultValue: title || ''
    });

    return (
      <div
        className={['task', className]
          .filter(Boolean)
          .join(' ')
          .trim()}
        ref={ref}
      >
        <ToggleCompleted isEmpty={!!value.trim()} uuid={uuid} />
        <Input
          {...inputProps}
          {...inputHandler}
          className="task-input-base"
          fullWidth
          value={value}
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
