import React, { useMemo, ReactNode, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Input, InputProps } from '../Mui/Input';
import { ToggleCompleted } from './ToggleCompleted';
import { TaskInput, TaskInputProps } from './TaskInput';
import { RootState } from '../../store';

export interface TaskProps extends InputProps {
  className?: string;
  endAdornment?: ReactNode;
  onContextMenu?(evt: MouseEvent<HTMLDivElement>): void;
  taskInputProps?: TaskInputProps;
  uuid: number;
}

const mapStateToProps = (state: RootState, ownProps: TaskProps) => {
  return {
    ...ownProps,
    task: state.task.byIds[ownProps.uuid]
  };
};

function TaskComponent({
  className = '',
  dispatch,
  task,
  endAdornment,
  onContextMenu,
  taskInputProps,
  ...inputProps
}: ReturnType<typeof mapStateToProps> & { dispatch: Dispatch }) {
  const mergedTaskInputProps = useMemo<TaskProps['taskInputProps']>(
    () => ({
      due: task.due,
      notes: task.notes,
      ...(taskInputProps && taskInputProps)
    }),
    [task.due, task.notes, taskInputProps]
  );

  return (
    <div className={`task ${className}`.trim()} onContextMenu={onContextMenu}>
      <ToggleCompleted
        uuid={task.uuid}
        isEmpty={!(task.title || '').trim()}
        completed={task.status === 'completed'}
      />
      <Input
        {...inputProps}
        fullWidth
        className="task-input-base"
        defaultValue={task.title}
        inputComponent={TaskInput}
        inputProps={mergedTaskInputProps}
        endAdornment={
          <div className="task-input-base-end-adornment">{endAdornment}</div>
        }
      />
    </div>
  );
}

export const Task = connect(mapStateToProps)(TaskComponent);
