import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { Preferences } from '../Preferences';
import { useMuiMenuItem, Menu, Modal, FormModal } from '../Mui';
import { useBoolean } from '../../utils/useBoolean';
import {
  TaskListActionCreators,
  TaskActionCreators,
  AuthActionCreators,
  RootState
} from '../../store';
import Divider from '@material-ui/core/Divider';

interface Props {
  anchorEl: HTMLElement | null;
  onClose(): void;
}

const mapStateToProps = ({ task, taskList }: RootState, ownProps: Props) => ({
  ...taskList,
  ...task,
  ...ownProps
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      ...TaskListActionCreators,
      ...TaskActionCreators,
      ...AuthActionCreators
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

const menuClasses = { paper: 'task-list-menu-paper' };

function TaskListMenuComponent({
  anchorEl,
  onClose,
  tasks,
  completedTasks,
  taskLists,
  currentTaskList,
  currentTaskListId,
  sortByDate,
  delteTaskList,
  deleteCompletedTasks,
  updateTaskList,
  toggleSortByDate,
  logout
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  const MenuItem = useMuiMenuItem({ onClose });

  const [
    deleteCompletedTaskModalOpend,
    deleteCompletedTaskModal
  ] = useBoolean();
  const [renameTaskModalOpend, renameTaskModal] = useBoolean();
  const [keyboardShortcutsOpened, keyboardShortcuts] = useBoolean();
  const [preferencesOpened, preferences] = useBoolean();
  const [
    deleteTaskListModalOpend,
    { on: openDeleteTaskListModal, off: closeDeleteTaskListModal }
  ] = useBoolean();

  const totalTask = useNotZero(tasks.length);
  const numOfCompletedTask = useNotZero(completedTasks.length);

  const onDeleteTaskListCallback = useCallback(
    () => (!!tasks.length ? openDeleteTaskListModal : delteTaskList()),
    [openDeleteTaskListModal, delteTaskList, tasks.length]
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
        classes={menuClasses}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
      >
        <div className="task-list-menu-title">Sort by</div>
        <MenuItem
          text="My order"
          selected={!sortByDate}
          onClick={() => toggleSortByDate(false)}
        />
        <MenuItem
          text="Date"
          selected={sortByDate}
          onClick={() => toggleSortByDate(true)}
        />
        <Divider />
        <MenuItem text="Rename list" onClick={renameTaskModal.on} />
        <MenuItem
          text="Delete list"
          disabled={!taskLists.length || taskLists[0].id === currentTaskListId}
          onClick={onDeleteTaskListCallback}
        />
        <MenuItem
          text="Delete all completed tasks"
          disabled={!completedTasks.length}
          onClick={deleteCompletedTaskModal.on}
        />
        <Divider />
        <MenuItem text="Keyboard shortcuts" onClick={keyboardShortcuts.on} />
        <MenuItem text="Preferences" onClick={preferences.on} />
        <MenuItem text="Logout" onClick={logout} />
      </Menu>
      <Modal
        title="Delete this list?"
        confirmLabel="Delete"
        open={deleteTaskListModalOpend}
        handleClose={closeDeleteTaskListModal}
        handleConfirm={delteTaskList}
      >
        Deleting this list will also delete {totalTask} task.
      </Modal>
      <Modal
        title="Delete all completed tasks?"
        confirmLabel="Delete"
        open={deleteCompletedTaskModalOpend}
        handleClose={deleteCompletedTaskModal.off}
        handleConfirm={deleteCompletedTasks}
      >
        {numOfCompletedTask} completed task will be permanently removed.
      </Modal>
      <FormModal
        title="Rename list"
        errorMsg="Task list name cannot be empty"
        defaultValue={currentTaskList.title}
        open={renameTaskModalOpend}
        handleClose={renameTaskModal.off}
        handleConfirm={renameTaskListCallback}
      />
      <KeyboardShortcuts
        open={keyboardShortcutsOpened}
        handleClose={keyboardShortcuts.off}
      />
      <Preferences open={preferencesOpened} handleClose={preferences.off} />
    </>
  );
}

export const TaskListMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListMenuComponent);
