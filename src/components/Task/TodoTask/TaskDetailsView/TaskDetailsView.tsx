import React, { useState, useRef, useCallback, KeyboardEvent } from 'react';
import {
  DeleteIcon,
  EditIcon,
  FullScreenDialog,
  FullScreenDialogProps,
  IconButton,
  Input
} from '../../../Mui';
import { connect, DispatchProp } from 'react-redux';
import { DateTimeButton } from './DateTimeButton';
import {
  TaskListDropdown,
  TaskListDropdownProps
} from '../../../TaskListDropdown';
import {
  RootState,
  deleteTask,
  updateTask,
  moveToAnotherList,
  currentTaskListIdSelector
} from '../../../../store';
import { Schema$Task } from '../../../../typings';
import Button from '@material-ui/core/Button';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';

interface Props extends FullScreenDialogProps, Pick<Schema$Task, 'uuid'> {
  taskListDropdownOpened?: boolean;
  openDateTimeDialog(): void;
  onRemoveDateTime(): void;
}

const mapStateToProps = (state: RootState, { uuid }: Props) => {
  const { due, id, notes, title } = state.task.byIds[uuid];
  return {
    currentTaskListId: currentTaskListIdSelector(state),
    due,
    id,
    notes,
    title
  };
};

const preventStartNewLine = (evt: KeyboardEvent<HTMLDivElement>) =>
  evt.which === 13 && evt.preventDefault();

const dropdownButtonProps = {
  fullWidth: true
};

export const EditTaskButton = React.memo(({ onClick }: { onClick(): void }) => {
  return (
    <IconButton
      className="edit-task-button"
      tooltip="Edit details"
      icon={EditIcon}
      onClick={onClick}
    />
  );
});

export function TaskDetailsViewComponent({
  currentTaskListId,
  due,
  dispatch,
  id,
  notes,
  onClose,
  openDateTimeDialog,
  onRemoveDateTime,
  title,
  taskListDropdownOpened,
  uuid,
  ...props
}: Props & ReturnType<typeof mapStateToProps> & DispatchProp) {
  const titleInputRef = useRef<HTMLTextAreaElement>();
  const notesInputRef = useRef<HTMLTextAreaElement>();
  const shouldDeleteTask = useRef<boolean>(false);
  const [newTaskList, setNewTaskList] = useState(currentTaskListId);

  // Instead of autoFocus attr.
  // Aims to delay focus so that the focus animation
  const focustTitleInputField = useCallback(
    () => titleInputRef.current!.focus(),
    []
  );

  const focusNotesInputField = useCallback(
    () => notesInputRef.current!.focus(),
    []
  );

  const deleteTaskCallback = useCallback(() => {
    dispatch(deleteTask({ id, uuid }));
  }, [dispatch, uuid, id]);

  const onSelectTaskList = useCallback<TaskListDropdownProps['onSelect']>(
    ({ id }) => setNewTaskList(id!),
    []
  );

  const onExitCallback = useCallback(() => {
    const titleInput = titleInputRef.current;
    const notesInput = notesInputRef.current;
    const newTitle = titleInput && titleInput.value;
    const newNotes = notesInput && notesInput.value;

    if ((title || '') !== newTitle || (notes || '') !== newNotes) {
      dispatch(
        updateTask({
          id,
          uuid,
          title: newTitle,
          notes: newNotes
        })
      );
    }
  }, [dispatch, id, uuid, title, notes]);

  const onExitedCallback = useCallback(() => {
    if (shouldDeleteTask.current) {
      shouldDeleteTask.current = false;
      deleteTaskCallback();
    } else if (newTaskList && newTaskList !== currentTaskListId) {
      dispatch(
        moveToAnotherList({
          tasklist: newTaskList,
          uuid
        })
      );
    }
  }, [currentTaskListId, deleteTaskCallback, newTaskList, uuid, dispatch]);

  const deleteBtnClickedCallback = useCallback(() => {
    shouldDeleteTask.current = true;
    onClose();
  }, [onClose]);

  return (
    <FullScreenDialog
      {...props}
      className="task-details-view"
      headerComponents={
        <IconButton
          tooltip="Delete"
          icon={DeleteIcon}
          onClick={deleteBtnClickedCallback}
        />
      }
      onClose={onClose}
      onEntered={focustTitleInputField}
      onExit={onExitCallback}
      onExited={onExitedCallback}
    >
      <Input
        multiline
        className="filled task-details-view-title-field"
        placeholder="Enter title"
        defaultValue={title}
        inputRef={titleInputRef}
        onKeyPress={preventStartNewLine}
      />

      <Input
        multiline
        rows={3}
        rowsMax={Infinity}
        className="filled task-details-view-notes-field"
        placeholder="Add details"
        defaultValue={notes}
        inputRef={notesInputRef}
        onClick={focusNotesInputField}
      />

      <div className="row row-task-list">
        <FormatListBulletedIcon />
        <TaskListDropdown
          buttonProps={dropdownButtonProps}
          defaultOpen={taskListDropdownOpened}
          onSelect={onSelectTaskList}
          paperClassName="details-task-list-dropdown-paper"
        />
      </div>

      <div className="row row-date">
        <EventAvailableIcon />
        <DateTimeButton
          due={due}
          onClick={openDateTimeDialog}
          onClose={onRemoveDateTime}
        />
      </div>

      <div className="row row-subtask">
        <SubdirectoryIcon />
        <Button disabled>Add Subtasks</Button>
      </div>
    </FullScreenDialog>
  );
}

export const TaskDetailsView = connect(mapStateToProps)(
  TaskDetailsViewComponent
);
