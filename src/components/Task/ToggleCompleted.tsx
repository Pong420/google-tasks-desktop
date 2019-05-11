import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { IconButton } from '../Mui/IconButton';
import { useBoolean } from '../../utils/useBoolean';
import { TaskActionCreators } from '../../store';
import { Schema$Task } from '../../typings';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

interface Props {
  task: Schema$Task;
  completed?: boolean;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

function ToggleCompletedComponent({
  task,
  completed,
  deleteTask,
  updateTask
}: Props & ReturnType<typeof mapDispatchToProps>) {
  const [hover, { on, off }] = useBoolean(false);

  const onClickCallback = useCallback(() => {
    if (!(task.title || '').trim()) {
      return deleteTask(task);
    }

    return updateTask({
      ...task,
      status: completed ? 'needsAction' : 'completed'
    });
  }, [completed, deleteTask, task, updateTask]);

  return (
    <div
      className="toggle-completed"
      onClick={onClickCallback}
      onMouseEnter={on}
      onMouseLeave={off}
    >
      <IconButton
        tooltip={hover && !completed ? 'Mark complete' : 'Mark incomplete'}
      >
        {completed || hover ? (
          <TickIcon className="mui-tick-icon" color="inherit" />
        ) : (
          <CircleIcon />
        )}
      </IconButton>
    </div>
  );
}

export const ToggleCompleted = connect(
  null,
  mapDispatchToProps
)(ToggleCompletedComponent);
