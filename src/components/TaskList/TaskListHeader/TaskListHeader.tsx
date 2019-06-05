import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { FormModal } from '../../Mui';
import { TaskListDropdown } from './TaskListDropdown';
import { TaskListActionCreators, RootState } from '../../../store';
import { useBoolean } from '../../../utils/useBoolean';
import WifiOffIcon from '@material-ui/icons/WifiOff';

const mapStateToProps = ({ taskList, network }: RootState) => ({
  ...taskList,
  isOnline: network.isOnline
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskListActionCreators, dispatch);

export function TaskListHeaderComponent({
  taskLists,
  newTaskList,
  currentTaskList,
  isOnline
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  const [modalOpened, modal] = useBoolean(false);

  return (
    <div className="task-list-header">
      <div className="status">{!isOnline && <WifiOffIcon />}</div>
      <div className="task-list-dropdown-container">
        <div className="task-list-dropdown-label">
          <span>TASKS</span>
        </div>
        <TaskListDropdown
          taskLists={taskLists}
          newTaskList={newTaskList}
          currentTaskList={currentTaskList}
          onCreateNewTaskList={modal.on}
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
