import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Input, InputProps } from '../../../components/Mui';
import { taskSelector } from '../../../store';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput, TaskInputProps } from './TaskInput';

export interface TaskProps
  extends InputProps,
    Pick<TaskInputProps, 'onDueDateBtnClick'> {
  className?: string;
  uuid: string;
  isEmpty?: boolean;
  endAdornment?: ReactNode;
}

export const Task = React.forwardRef<HTMLDivElement, TaskProps>(
  (
    {
      className,
      uuid,
      isEmpty,
      endAdornment,
      onDueDateBtnClick,
      ...inputProps
    },
    ref
  ) => {
    const { due, notes } = useSelector(taskSelector(uuid)) || {};

    return (
      <div
        data-uuid={uuid}
        className={['task', className].filter(Boolean).join(' ').trim()}
        ref={ref}
      >
        <ToggleCompleted isEmpty={!!isEmpty} uuid={uuid} />
        <Input
          {...inputProps}
          fullWidth
          className="task-input-base"
          inputProps={{ due, notes, onDueDateBtnClick }}
          inputComponent={TaskInput as InputProps['inputComponent']}
          endAdornment={
            <div className="task-input-base-end-adornment">{endAdornment}</div>
          }
        />
      </div>
    );
  }
);
