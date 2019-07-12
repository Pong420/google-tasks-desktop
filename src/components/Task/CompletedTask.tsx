import React, { useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Task } from '../Task';
import { DeleteIcon, IconButton } from '../Mui';
import { RootState, deleteTask } from '../../store';
import { Schema$Task } from '../../typings';

interface Props extends Pick<Schema$Task, 'uuid'> {}

const mapStateToProps = (state: RootState, { uuid }: Props) => {
  const { title } = state.task.byIds[uuid];
  return {
    title
  };
};

function CompletedTaskComponent({
  dispatch,
  title,
  uuid
}: Props & ReturnType<typeof mapStateToProps> & DispatchProp) {
  const deleteTaskCallback = useCallback(() => dispatch(deleteTask({ uuid })), [
    dispatch,
    uuid
  ]);

  return (
    <Task
      className="completed-task"
      endAdornment={
        <IconButton
          tooltip="Delete"
          icon={DeleteIcon}
          onClick={deleteTaskCallback}
        />
      }
      readOnly
      title={title}
      uuid={uuid}
    />
  );
}

export const CompletedTask = connect(mapStateToProps)(CompletedTaskComponent);
