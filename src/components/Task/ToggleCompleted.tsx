import React, { useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { IconButton } from '../Mui/IconButton';
import { useBoolean } from '../../utils/useBoolean';
import { deleteTask, updateTask } from '../../store';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

interface Props {
  completed?: boolean;
  isEmpty: boolean;
  uuid: string;
}

function ToggleCompletedComponent({
  uuid,
  isEmpty,
  completed,
  dispatch
}: Props & DispatchProp) {
  const [hover, { on, off }] = useBoolean();

  const onClickCallback = useCallback(() => {
    if (isEmpty) {
      dispatch(deleteTask({ uuid }));
    } else {
      dispatch(
        updateTask({
          uuid,
          status: completed ? 'needsAction' : 'completed'
        })
      );
    }
  }, [uuid, completed, isEmpty, dispatch]);

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
