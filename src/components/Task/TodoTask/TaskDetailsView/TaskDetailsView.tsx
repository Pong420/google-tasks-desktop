import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent
} from 'react';
import {
  DeleteIcon,
  EditIcon,
  FullScreenDialog,
  FullScreenDialogProps,
  Input,
  IconButton
} from '../../../Mui';
import { TaskListDropdown } from '../../../TaskListDropdown';
import { DateTimeModal } from '../DateTimeModal';
import { DateTimeButton } from './DateTimeButton';
import { Schema$Task, Schema$TaskList } from '../../../../typings';
import { useBoolean } from '../../../../utils/useBoolean';
import Button from '@material-ui/core/Button';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';
import isEqual from 'lodash.isequal';

interface Props extends FullScreenDialogProps {
  taskListDropdownOpened?: boolean;
  task: Schema$Task;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList | null;
  deleteTask(task: Schema$Task): void;
  updateTask(task: Schema$Task): void;
  taskListChange(id: string): void;
}

export function EditTaskButton({ onClick }: { onClick(): void }) {
  return (
    <IconButton
      className="edit-task-button"
      tooltip="Edit details"
      icon={EditIcon}
      onClick={onClick}
    />
  );
}

const preventStartNewLine = (evt: KeyboardEvent<HTMLDivElement>) =>
  evt.which === 13 && evt.preventDefault();

const calcMenuWidth = (el: HTMLElement) => el.offsetWidth;

const dropdownButtonProps = {
  fullWidth: true
};

export function TaskDetailsView({
  taskListDropdownOpened,
  task: initialTask,
  taskLists,
  currentTaskList,
  updateTask,
  deleteTask,
  taskListChange,
  handleClose,
  ...props
}: Props) {
  const [dateTimeModalOpened, dateTimeModal] = useBoolean();
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);
  const shouldDeleteTask = useRef<boolean>(false);
  const [task, setTask] = useState(initialTask);
  const [newTaskList, setNewTaskListId] = useState(currentTaskList);

  // Instead of autoFocus attr.
  // Aims to delay focus so that the focus animation
  const focustTitleInputField = useCallback(
    () => titleInputRef.current!.focus(),
    []
  );

  const onExitCallback = useCallback(
    () => !isEqual(initialTask, task) && updateTask(task),
    [initialTask, task, updateTask]
  );

  const onExitedCallback = useCallback(() => {
    if (shouldDeleteTask.current) {
      shouldDeleteTask.current = false;
      deleteTask(task);
    } else if (
      newTaskList &&
      currentTaskList &&
      currentTaskList.id !== newTaskList.id
    ) {
      taskListChange(newTaskList.id!);
    }
  }, [currentTaskList, deleteTask, newTaskList, task, taskListChange]);

  const focusNotesInputField = useCallback(
    () => notesInputRef.current!.focus(),
    []
  );

  const deleteBtnClickedCallback = useCallback(() => {
    shouldDeleteTask.current = true;
    handleClose();
  }, [handleClose]);

  const updateTaskCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) =>
      setTask({ ...task, title: evt.currentTarget.value }),
    [setTask, task]
  );

  const updateNotesCallback = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) =>
      setTask({ ...task, notes: evt.currentTarget.value }),
    [setTask, task]
  );

  const updateDueCallback = useCallback(
    (date?: any) =>
      setTask({
        ...task,
        due: date instanceof Date ? date.toISOString() : undefined
      }),
    [setTask, task]
  );

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <>
      <FullScreenDialog
        className="task-details-view"
        handleClose={handleClose}
        onEntered={focustTitleInputField}
        onExit={onExitCallback}
        onExited={onExitedCallback}
        headerComponents={
          <IconButton
            tooltip="Delete"
            icon={DeleteIcon}
            onClick={deleteBtnClickedCallback}
          />
        }
        {...props}
      >
        <div className="task-details-view-content">
          <Input
            multiline
            className="filled task-details-view-title-field"
            placeholder="Enter title"
            value={task.title}
            inputRef={titleInputRef}
            onChange={updateTaskCallback}
            onKeyPress={preventStartNewLine}
          />

          <Input
            multiline
            rows={3}
            rowsMax={Infinity}
            className="filled task-details-view-notes-field"
            placeholder="Add details"
            value={task.notes}
            inputRef={notesInputRef}
            onClick={focusNotesInputField}
            onChange={updateNotesCallback}
          />

          <div className="row row-task-list">
            <FormatListBulletedIcon />
            <TaskListDropdown
              buttonProps={dropdownButtonProps}
              calcMenuWidth={calcMenuWidth}
              defaultOpen={taskListDropdownOpened}
              onSelect={setNewTaskListId}
              paperClassName="details-task-list-dropdown-paper"
            />
          </div>

          <div className="row row-date">
            <EventAvailableIcon />
            <DateTimeButton
              due={task.due}
              onClick={dateTimeModal.on}
              onClose={updateDueCallback}
            />
          </div>

          <div className="row row-subtask">
            <SubdirectoryIcon />
            <Button disabled>Add Subtasks</Button>
          </div>
        </div>
      </FullScreenDialog>

      <DateTimeModal
        confirmLabel="OK"
        due={task.due}
        open={dateTimeModalOpened}
        handleClose={dateTimeModal.off}
        handleConfirm={updateDueCallback}
      />
    </>
  );
}
