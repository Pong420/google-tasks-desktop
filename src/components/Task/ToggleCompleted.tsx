import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { IconButton } from '../Mui/IconButton';
import { useBoolean } from '../../utils/useBoolean';
import { TaskActionCreators } from '../../store';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

interface Props {
  completed?: boolean;
  isEmpty: boolean;
  uuid: string;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

function ToggleCompletedComponent({
  uuid,
  isEmpty,
  completed,
  deleteTask,
  updateTask
}: Props & ReturnType<typeof mapDispatchToProps>) {
  const [hover, { on, off }] = useBoolean(false);

  const onClickCallback = useCallback(() => {
    if (isEmpty) {
      deleteTask({ uuid });
    } else {
      updateTask({
        uuid,
        status: completed ? 'needsAction' : 'completed'
      });
    }
  }, [uuid, completed, isEmpty, deleteTask, updateTask]);

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

export const ToggleCompleted = React.memo(
  connect(
    null,
    mapDispatchToProps
  )(ToggleCompletedComponent)
);
