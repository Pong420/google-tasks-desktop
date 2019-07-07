import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, Omit } from 'react-redux';
import {
  useMuiMenuItem,
  Menu,
  MenuProps,
  ConfirmDialog,
  FormDialog
} from '../Mui';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import {
  currentTaskListSelector,
  deleteTaskList,
  deleteCompletedTasks,
  isMasterTaskList,
  getTotalTasks,
  logout,
  toggleSortByDate,
  updateTaskList,
  RootState
} from '../../store';
import { useBoolean } from '../../utils/useBoolean';
import Divider from '@material-ui/core/Divider';

const mapStateToProps = (state: RootState) => ({
  currentTaskList: currentTaskListSelector(state),
  canNotDelete: isMasterTaskList(state),
  numOfCompletedTasks: state.task.completed.length,
  numOfTotalTasks: getTotalTasks(state),
  sortByDate: state.taskList.sortByDate
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      deleteCompletedTasks,
      deleteTaskList,
      logout,
      toggleSortByDate,
      updateTaskList
    },
    dispatch
  );

type Props = Omit<MenuProps, 'ref'> &
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
  currentTaskList,
  canNotDelete,
  deleteTaskList,
  deleteCompletedTasks,
  logout,
  numOfCompletedTasks,
  numOfTotalTasks,
  onClose,
  sortByDate,
  toggleSortByDate,
  updateTaskList,
  ...props
}: Props) {
  const MenuItem = useMuiMenuItem({ onClose });

  const [
    deleteCompletedTaskDialogOpend,
    deleteCompletedTaskDialog
  ] = useBoolean();

  const [
    deleteTaskListDialogOpend,
    { on: openDeleteTaskListDialog, off: closeDeleteTaskListDialog }
  ] = useBoolean();

  const [renameTaskDialogOpend, renameTaskDialog] = useBoolean();

  const [keyboardShortcutsOpened, keyboardShortcuts] = useBoolean();

  const deleteTaskListCallback = useCallback(
    () => deleteTaskList(currentTaskList!.id!),
    [currentTaskList, deleteTaskList]
  );

  const renameTaskListCallback = useCallback(
    (title: string) =>
      updateTaskList({ tasklist: currentTaskList!.id, requestBody: { title } }),
    [currentTaskList, updateTaskList]
  );

  const [setSortByDate, setSortByOrder] = useMemo(
    () => [() => toggleSortByDate(true), () => toggleSortByDate(false)],
    [toggleSortByDate]
  );

  const numOfTotalTasks_ = useNotZero(numOfTotalTasks);
  const numOfCompletedTasks_ = useNotZero(numOfCompletedTasks);

  return (
    <>
      <Menu {...props} onClose={onClose} classes={menuClasses}>
        <div className="task-list-menu-title">Sort by</div>
        <MenuItem
          text="My order"
          selected={!sortByDate}
          onClick={setSortByOrder}
        />
        <MenuItem text="Date" selected={sortByDate} onClick={setSortByDate} />
        <Divider />
        <MenuItem text="Rename list" onClick={renameTaskDialog.on} />
        <MenuItem
          text="Delete list"
          disabled={canNotDelete}
          onClick={openDeleteTaskListDialog}
        />
        <MenuItem
          text="Delete all completed tasks"
          disabled={numOfCompletedTasks <= 0}
          onClick={deleteCompletedTaskDialog.on}
        />
        <Divider />
        <MenuItem text="Keyboard shortcuts" onClick={keyboardShortcuts.on} />
        <MenuItem text="Preferences" />
        <MenuItem text="Logout" onClick={logout} />
      </Menu>
      <ConfirmDialog
        title="Delete this list?"
        confirmLabel="Delete"
        open={deleteTaskListDialogOpend}
        onClose={closeDeleteTaskListDialog}
        onConfirm={deleteTaskListCallback}
      >
        Deleting this list will also delete {numOfTotalTasks_} task.
      </ConfirmDialog>
      <ConfirmDialog
        title="Delete all completed tasks?"
        confirmLabel="Delete"
        open={deleteCompletedTaskDialogOpend}
        onClose={deleteCompletedTaskDialog.off}
        onConfirm={deleteCompletedTasks}
      >
        {numOfCompletedTasks_} completed task will be permanently removed.
      </ConfirmDialog>
      <FormDialog
        title="Rename list"
        errorMsg="Task list name cannot be empty"
        defaultValue={currentTaskList ? currentTaskList.title : ''}
        open={renameTaskDialogOpend}
        onClose={renameTaskDialog.off}
        onConfirm={renameTaskListCallback}
      />
      <KeyboardShortcuts
        open={keyboardShortcutsOpened}
        onClose={keyboardShortcuts.off}
      />
    </>
  );
}

export const TaskListMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListMenuComponent);
