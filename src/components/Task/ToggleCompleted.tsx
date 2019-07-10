import React, { useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { IconButton } from '../Mui/IconButton';
import { useBoolean } from '../../utils/useBoolean';
import { deleteTask, updateTask } from '../../store';
import { Schema$Task } from '../../typings';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

interface Props extends Pick<Schema$Task, 'id' | 'uuid'> {
  completed?: boolean;
  isEmpty: boolean;
}

function ToggleCompletedComponent({
  completed,
  dispatch,
  isEmpty,
  id,
  uuid
}: Props & DispatchProp) {
  const [hover, { on, off }] = useBoolean();

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
    <div
      className="toggle-completed"
      onClick={onClickCallback}
      onMouseEnter={on}
      onMouseLeave={off}
    >
      <IconButton tooltip={!completed ? 'Mark complete' : 'Mark incomplete'}>
        {completed || hover ? (
          <TickIcon className="mui-tick-icon" />
        ) : (
          <CircleIcon />
        )}
      </IconButton>
    </div>
  );
}

export const ToggleCompleted = React.memo(connect()(ToggleCompletedComponent));
