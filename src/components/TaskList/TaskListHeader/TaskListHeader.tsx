import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { generatePath } from 'react-router-dom';
import { push } from 'connected-react-router';
import { FormModal, MenuItem } from '../../Mui';
import { TaskListDropdown } from '../../TaskListDropdown';
import { newTaskList, RootState } from '../../../store';
import { useBoolean } from '../../../utils/useBoolean';
import { PATHS } from '../../../constants';
import { Schema$TaskList } from '../../../typings';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import Divider from '@material-ui/core/Divider';

const mapStateToProps = ({
  taskList: { currentTaskList },
  network: { isOnline }
}: RootState) => ({
  currentTaskList,
  isOnline
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ newTaskList, push }, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export function TaskListHeaderComponent({
  currentTaskList,
  isOnline,
  newTaskList,
  push
}: Props) {
  const [modalOpened, modal] = useBoolean();

  const onSelectCallback = useCallback(
    ({ id }: Schema$TaskList) => {
      push(generatePath(PATHS.TASKLIST, { taskListId: id }));
    },
    [push]
  );

  return (
    <div className="task-list-header">
      <div className="status">{!isOnline && <WifiOffIcon />}</div>
      <div className="task-list-dropdown-container">
        <div className="task-list-dropdown-label">
          <span>TASKS</span>
        </div>
        <TaskListDropdown
          key={currentTaskList ? currentTaskList.id : ''}
          onSelect={onSelectCallback}
          outOfScrollContent={onClose => {
            return (
              <>
                <Divider />
                <MenuItem
                  text="Create new list"
                  onClick={modal.on}
                  onClose={onClose}
                />
              </>
            );
          }}
          paperClassName="header-task-list-dropdown-paper"
        />
      </div>
      <FormModal
        title="Create new list"
        errorMsg="Task list name cannot be empty"
        open={modalOpened}
        handleClose={modal.off}
        handleConfirm={newTaskList}
      />
    </div>
  );
}

export const TaskListHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListHeaderComponent);
