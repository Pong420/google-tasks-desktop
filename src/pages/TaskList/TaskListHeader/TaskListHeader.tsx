import React from 'react';
import { generatePath } from 'react-router-dom';
import { FormDialog, MenuItem } from '../../../components/Mui';
import { TaskListDropdown } from '../TaskListDropdown';
import { history } from '../../../store';
import { PATHS } from '../../../constants';
import { useBoolean } from '../../../hooks/useBoolean';
import { Divider } from '@material-ui/core';

interface Props {
  onConfirm: (payload: string) => void;
}

export function TaskListHeader({ onConfirm }: Props) {
  const [dialogOpened, openDialog, closeDialog] = useBoolean();

  return (
    <>
      <div className="task-list-header">
        <div className="status" /> {/* TODO: */}
        <div className="task-list-header-dropdown-container">
          <div className="task-list-header-dropdown-label">
            <span>TASKS</span>
          </div>
          <TaskListDropdown
            paperClassName="task-list-header-dropdown-paper"
            onSelect={({ id }) =>
              history.push(generatePath(PATHS.TASKLIST, { taskListId: id }))
            }
            footer={onClose => (
              <>
                <Divider />
                <MenuItem
                  text="Create new list"
                  onClose={onClose}
                  onClick={openDialog}
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
        onClose={closeDialog}
        onConfirm={onConfirm}
      />
    </>
  );
}
