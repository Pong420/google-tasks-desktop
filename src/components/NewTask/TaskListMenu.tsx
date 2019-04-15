import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { useMenuItem, Menu, Modal, FormModal } from '../Mui';
import { useBoolean, useAdvancedCallback } from '../../utils';
import {
  TaskListActionCreators,
  TaskActionCreators,
  RootState
} from '../../store';
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

function useNotZero(initialVal: number) {
  const [value, setValue] = useState(initialVal);
  useEffect(() => {
    initialVal && setValue(initialVal);
  }, [initialVal]);

  return value;
}

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

  const [
    deleteCompletedTaskModalOpend,
    deleteCompletedTaskModal
  ] = useBoolean();
  const [deleteTaskListModalOpend, deleteTaskListModal] = useBoolean();
  const [renameTaskModalOpend, renameTaskModal] = useBoolean();
  const [keyboardShortcutsOpened, keyboardShortcuts] = useBoolean();

  const totalTask = useNotZero(tasks.length);
  const numOfCompletedTask = useNotZero(completedTasks.length);

  const delteTaskListCallback = useAdvancedCallback(
    taskListId => taskListId && delteTaskList(taskListId),
    [taskListId]
  );

  const onDeleteTaskListCallback = useAdvancedCallback(
    showModal =>
      showModal ? deleteTaskListModal.on() : delteTaskListCallback(),
    [!!tasks.length]
  );

  const deleteCompletedTasksCallback = useAdvancedCallback(
    deleteCompletedTasks,
    [completedTasks]
  );

  const renameTaskListCallback = useCallback(
    (title: string) =>
      updateTaskList({ tasklist: currentTaskListId, requestBody: { title } }),
    [currentTaskListId, updateTaskList]
  );

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
        <MenuItem text="My order" selected disabled />
        <MenuItem text="Date" disabled />
        <Divider />
        <MenuItem text="Rename list" onClick={renameTaskModal.on} />
        <MenuItem
          text="Delete list"
          disabled={!taskLists[0] || taskLists[0].id === taskListId}
          onClick={onDeleteTaskListCallback}
        />
        <MenuItem
          text="Delete all completed tasks"
          disabled={!completedTasks.length}
          onClick={deleteCompletedTaskModal.on}
        />
        <Divider />
        <MenuItem
          text="Keyboard shortcuts"
          onClick={keyboardShortcuts.on}
          disabled
        />
        <MenuItem
          text="Github"
          onClick={() => window.open(pkg.repository.url, 'blank')}
        />
        <MenuItem text="Logout" />
      </Menu>
      <Modal
        title="Delete this list?"
        confirmLabel="Delete"
        open={deleteTaskListModalOpend}
        handleClose={deleteTaskListModal.off}
        handleConfirm={delteTaskListCallback}
      >
        Deleting this list will also delete {totalTask} task.
      </Modal>
      <Modal
        title="Delete all completed tasks?"
        confirmLabel="Delete"
        open={deleteCompletedTaskModalOpend}
        handleClose={deleteCompletedTaskModal.off}
        handleConfirm={deleteCompletedTasksCallback}
      >
        {numOfCompletedTask} completed task will be permanently removed.
      </Modal>
      <FormModal
        title="Rename list"
        defaultValue={currentTaskList ? currentTaskList.title : ''}
        open={renameTaskModalOpend}
        handleClose={renameTaskModal.off}
        handleConfirm={renameTaskListCallback}
      />
      <KeyboardShortcuts
        open={keyboardShortcutsOpened}
        handleClose={keyboardShortcuts.off}
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
