import React, { useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Task } from '../Task';
import { DeleteIcon, IconButton } from '../Mui';
import { RootState, deleteTask } from '../../store';
import { Schema$Task } from '../../typings';

interface Props extends Pick<Schema$Task, 'uuid'> {}

const mapStateToProps = (state: RootState, { uuid }: Props) => {
  const { title, id } = state.task.byIds[uuid];
  return {
    id,
    title
  };
};

function CompletedTaskComponent({
  dispatch,
  id,
  title,
  uuid
}: Props & ReturnType<typeof mapStateToProps> & DispatchProp) {
  const deleteTaskCallback = useCallback(
    () => dispatch(deleteTask({ id, uuid })),
    [dispatch, id, uuid]
  );

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
