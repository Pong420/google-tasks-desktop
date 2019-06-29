import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { Preferences } from '../Preferences';
import { useMuiMenuItem, Menu, MenuProps, Modal, FormModal } from '../Mui';
import { useBoolean } from '../../utils/useBoolean';
import {
  deleteCompletedTasks,
  delteTaskList,
  logout,
  updateTaskList,
  toggleSortByDate,
  RootState
} from '../../store';
import Divider from '@material-ui/core/Divider';

const mapStateToProps = ({
  task: { tasks, completedTasks },
  taskList: { taskLists, currentTaskList, currentTaskListId, sortByDate }
}: RootState) => ({
  tasks,
  completedTasks,
  taskLists,
  currentTaskList,
  currentTaskListId,
  sortByDate
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      deleteCompletedTasks,
      delteTaskList,
      logout,
      updateTaskList,
      toggleSortByDate
    },
    dispatch
  );

type Props = Pick<MenuProps, 'anchorEl' | 'onClose'> &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

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
}: Props) {
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
    () => (!!totalTask ? openDeleteTaskListModal() : delteTaskList()),
    [openDeleteTaskListModal, delteTaskList, totalTask]
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
        open={!!anchorEl}
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
