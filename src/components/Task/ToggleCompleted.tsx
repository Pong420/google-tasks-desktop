import React, { useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { IconButton } from '../Mui/IconButton';
import { RootState, deleteTask, updateTask } from '../../store';
import { Schema$Task } from '../../typings';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

interface Props extends Pick<Schema$Task, 'uuid'> {
  isEmpty: boolean;
}

const mapStateToProps = (state: RootState, { uuid }: Props) => {
  const task = state.task.byIds[uuid];
  return {
    id: task.id,
    completed: task.status === 'completed'
  };
};

const MarkCompleteButton = React.memo(() => (
  <IconButton tooltip="Mark complete">
    <CircleIcon />
  </IconButton>
));

const MarkInCompleteButton = React.memo(() => (
  <IconButton tooltip="Mark incomplete">
    <TickIcon className="mui-tick-icon" />
  </IconButton>
));

function ToggleCompletedComponent({
  completed,
  dispatch,
  isEmpty,
  id,
  uuid
}: Props & ReturnType<typeof mapStateToProps> & DispatchProp) {
  const onClickCallback = useCallback(() => {
    if (isEmpty) {
      dispatch(deleteTask({ id, uuid }));
    } else {
      dispatch(
        updateTask({
          id,
          uuid,
          status: completed ? 'needsAction' : 'completed'
        })
      );
    }
  }, [id, uuid, completed, isEmpty, dispatch]);

  return (
    <div className="toggle-completed" onClick={onClickCallback}>
      {!completed && <MarkCompleteButton />}
      <MarkInCompleteButton />
    </div>
  );
}

export const ToggleCompleted = connect(mapStateToProps)(
  ToggleCompletedComponent
);
