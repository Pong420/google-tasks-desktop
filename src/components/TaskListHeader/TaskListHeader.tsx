import React, { useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { generatePath } from 'react-router-dom';
import { push } from 'connected-react-router';
import { TaskListDropdown } from '../TaskListDropdown';
import { FormDialog, MenuItem } from '../Mui';
import { Schema$TaskList } from '../../typings';
import { newTaskList } from '../../store';
import { useBoolean } from '../../utils/useBoolean';
import { PATHS } from '../../constants';
import Divider from '@material-ui/core/Divider';

function TaskListHeaderComponent({ dispatch }: DispatchProp) {
  const [dialogOpened, dialog] = useBoolean();

  const onSelectCallback = useCallback(
    ({ id }: Schema$TaskList) =>
      dispatch(push(generatePath(PATHS.TASKLIST, { taskListId: id }))),
    [dispatch]
  );

  const newTaskListCallback = useCallback(
    (name: string) => dispatch(newTaskList(name)),
    [dispatch]
  );

  return (
    <>
      <div className="task-list-header">
        <div />
        <div className="task-list-header-dropdown-container">
          <div className="task-list-header-dropdown-label">
            <span>TASKS</span>
          </div>
          <TaskListDropdown
            onSelect={onSelectCallback}
            paperClassName="task-list-header-dropdown-paper"
            outOfScrollContent={onClose => (
              <>
                <Divider />
                <MenuItem
                  text="Create new list"
                  onClick={dialog.on}
                  onClose={onClose}
                />
              </>
            )}
          />
        </div>
      </div>
      <FormDialog
        title="Create new list"
        errorMsg="Task list name cannot be empty"
        open={dialogOpened}
        onClose={dialog.off}
        onConfirm={newTaskListCallback}
      />
    </>
  );
}

export const TaskListHeader = connect()(TaskListHeaderComponent);
