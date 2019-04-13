import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  TaskListActionCreators,
  TaskActionCreators,
  RootState
} from '../../store';
import { useMenuItem, Menu, Modal, FormModal } from '../Mui';
import { useBoolean } from '../../utils';
import Divider from '@material-ui/core/Divider';
import pkg from '../../../package.json';

interface Props {
  anchorEl: HTMLElement | null;
  onClose(): void;
}

interface MatchParams {
  taskListId?: string;
}

const mapStateToProps = ({ task, taskList }: RootState) => ({
  ...taskList,
  ...task
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      ...TaskListActionCreators,
      ...TaskActionCreators
    },
    dispatch
  );

function TaskListMenuComponent({
  anchorEl,
  onClose,
  match,
  tasks,
  completedTasks,
  taskLists,
  currentTaskList,
  currentTaskListId,
  delteTaskList,
  deleteCompletedTasks,
  updateTaskList
}: Props &
  RouteComponentProps<MatchParams> &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>) {
  const { taskListId } = match.params;

  const MenuItem = useMenuItem(onClose);

  const delteTaskListCallback = useCallback(
    () => taskListId && delteTaskList(taskListId),
    [delteTaskList, taskListId]
  );

  const renameTaskListCallback = useCallback(
    (title: string) =>
      updateTaskList({ tasklist: currentTaskListId, requestBody: { title } }),
    [currentTaskListId, updateTaskList]
  );

  const [
    DeleteCompletedTaskModalOpend,
    DeleteCompletedTaskModal
  ] = useBoolean();
  const [DeleteTaskListModalOpend, DeleteTaskListModal] = useBoolean();
  const [RenameTaskModalOpend, RenameTaskModal] = useBoolean();

  if (!currentTaskList) {
    return null;
  }

  return (
    <>
      <Menu
        classes={{ paper: 'task-list-menu-paper' }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
      >
        <div className="task-list-menu-title">Sort by</div>
        <MenuItem text="My order" selected />
        <MenuItem text="Date" />
        <Divider />
        <MenuItem text="Rename list" onClick={RenameTaskModal.on} />
        <MenuItem
          text="Delete list"
          disabled={!taskLists[0] || taskLists[0].id === taskListId}
          onClick={() =>
            tasks.length ? DeleteTaskListModal.on() : delteTaskListCallback()
          }
        />
        <MenuItem
          text="Delete all completed tasks"
          disabled={!completedTasks.length}
          onClick={DeleteCompletedTaskModal.on}
        />
        <Divider />
        <MenuItem text="Keyboard shortcuts" />
        <MenuItem
          text="Github"
          onClick={() => window.open(pkg.repository.url, 'blank')}
        />
      </Menu>
      <Modal
        title="Delete this list?"
        confirmLabel="Delete"
        open={DeleteTaskListModalOpend}
        handleClose={DeleteTaskListModal.off}
        handleConfirm={delteTaskListCallback}
      >
        Deleting this list will also delete {tasks.length} task.
      </Modal>
      <Modal
        title="Delete all completed tasks?"
        confirmLabel="Delete"
        open={DeleteCompletedTaskModalOpend}
        handleClose={DeleteCompletedTaskModal.off}
        handleConfirm={() => deleteCompletedTasks(completedTasks)}
      >
        {completedTasks.length} completed task will be permanently removed.
      </Modal>
      <FormModal
        title="Rename list"
        defaultValue={currentTaskList ? currentTaskList.title : ''}
        open={RenameTaskModalOpend}
        handleClose={RenameTaskModal.off}
        handleConfirm={renameTaskListCallback}
      />
    </>
  );
}

export const TaskListMenu = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskListMenuComponent)
);
