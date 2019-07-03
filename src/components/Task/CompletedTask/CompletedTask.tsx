import React, { useCallback } from 'react';
import { Omit } from 'react-redux';
import { Task, TaskProps } from '../Task';
import { DeleteIcon, IconButton } from '../../Mui';
import { Payload$DeleteTask } from '../../../store';

interface Props extends Omit<TaskProps, 'endAdornment'> {
  deleteTask(task: Payload$DeleteTask): void;
}

const inputBaseProps = {
  readOnly: true,
  inputProps: {
    hideDateBtn: true
  }
};

export const CompletedTask = React.memo(
  ({ task, deleteTask, ...props }: Props) => {
    const onDelete = useCallback(
      () => deleteTask({ id: task.id, uuid: task.uuid }),
      [deleteTask, task.id, task.uuid]
    );

    return (
      <Task
        className="completed-task"
        task={task}
        inputBaseProps={inputBaseProps}
        endAdornment={
          <IconButton tooltip="Delete" icon={DeleteIcon} onClick={onDelete} />
        }
        {...props}
      />
    );
  }
);
