import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Task } from '../Task';
import { DeleteIcon, IconButton } from '../../Mui';
import { deleteTask, RootState } from '../../../store';

interface Props {
  index: number;
}

const inputProps = {
  hideDateBtn: true
};

const mapStateToProps = (
  { task: { completedTasks } }: RootState,
  ownProps: Props
) => ({
  task: completedTasks[ownProps.index]
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ deleteTask }, dispatch);

export const CompletedTaskComponent = ({
  task,
  deleteTask
}: ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>) => {
  const onDelete = useCallback(
    () => deleteTask({ id: task.id, uuid: task.uuid }),
    [deleteTask, task.id, task.uuid]
  );

  return (
    <Task
      readOnly
      className="completed-task"
      task={task}
      inputProps={inputProps}
      endAdornment={
        <IconButton tooltip="Delete" icon={DeleteIcon} onClick={onDelete} />
      }
    />
  );
};

export const CompletedTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedTaskComponent);
