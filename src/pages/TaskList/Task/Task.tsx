import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Input, InputProps } from '../../../components/Mui';
import { taskSelector } from '../../../store';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput } from './TaskInput';

export interface TaskProps extends InputProps {
  className?: string;
  uuid: string;
  isEmpty?: boolean;
  endAdornment?: ReactNode;
}

export const Task = React.forwardRef<HTMLDivElement, TaskProps>(
  ({ className, uuid, isEmpty, endAdornment, ...inputProps }, ref) => {
    const { due, notes } = useSelector(taskSelector(uuid)) || {};

    return (
      <div
        className={['task', className]
          .filter(Boolean)
          .join(' ')
          .trim()}
        ref={ref}
      >
        <ToggleCompleted isEmpty={!!isEmpty} uuid={uuid} />
        <Input
          {...inputProps}
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
