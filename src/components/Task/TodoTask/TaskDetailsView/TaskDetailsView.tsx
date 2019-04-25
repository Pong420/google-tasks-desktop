import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  DeleteIcon,
  EditIcon,
  FullScreenDialog,
  FullScreenDialogProps,
  Input,
  IconButton
} from '../../../Mui';
import { TaskListDropdown } from './TaskListDropdown';
import { DateTimeModal } from '../DateTimeModal';
import { Schema$Task, Schema$TaskList } from '../../../../typings';
import { useBoolean } from '../../../../utils/useBoolean';
import Button from '@material-ui/core/Button';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';
import CloseIcon from '@material-ui/icons/Close';

interface Props extends FullScreenDialogProps {
  task: Schema$Task;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList | null;
  deleteTask(task: Schema$Task): void;
  updateTask(task: Schema$Task): void;
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

export function TaskDetailsView({
  taskLists,
  currentTaskList,
  updateTask,
  deleteTask,
  task: initialTask,
  handleClose, // TODO: check this
  ...props
}: Props) {
  const [dateTimeModalOpened, dateTimeModal] = useBoolean();
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);
  const shouldDeleteTask = useRef<boolean>(false);

  const [task, setTask] = useState(initialTask);

  const onEnteredCallback = useCallback(
    () => titleInputRef.current!.focus(),
    []
  );

  const onExitCallback = useCallback(() => updateTask(task), [
    task,
    updateTask
  ]);

  const onExitedCallback = useCallback(() => {
    if (shouldDeleteTask.current) {
      shouldDeleteTask.current = false;
      deleteTask(task);
    }
  }, [deleteTask, task]);

  const deleteBtnClickedCallback = useCallback(() => {
    shouldDeleteTask.current = true;
    handleClose();
  }, [handleClose]);

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <>
      <FullScreenDialog
        className="task-details-view"
        handleClose={handleClose}
        onEntered={onEnteredCallback}
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
        <Input
          multiline
          className="filled task-details-view-title-field"
          placeholder="Enter title"
          value={task.title}
          inputRef={titleInputRef}
          onChange={evt => setTask({ ...task, title: evt.currentTarget.value })}
          onKeyPress={evt => evt.which === 13 && evt.preventDefault()}
        />
        <Input
          multiline
          className="filled task-details-view-notes-field"
          placeholder="Add details"
          value={task.notes}
          inputRef={notesInputRef}
          onClick={() => notesInputRef.current!.focus()}
          onChange={evt => setTask({ ...task, notes: evt.currentTarget.value })}
        />
        <div className="row row-task-list">
          <FormatListBulletedIcon />
          <TaskListDropdown
            currentTaskList={currentTaskList}
            taskLists={taskLists}
          />
        </div>
        <div className="row row-date">
          <EventAvailableIcon />
          {task.due ? (
            <div className="task-deatails-due-date-button">
              <div
                className="task-deatails-due-date-clickable"
                onClick={dateTimeModal.on}
              />
              <div>
                <div className="date">
                  {new Date(task.due).format('D, j M')}
                </div>
              </div>
              <IconButton
                icon={CloseIcon}
                tooltip="Remove date and time"
                onClick={() => setTask({ ...task, due: undefined })}
              />
            </div>
          ) : (
            <Button onClick={dateTimeModal.on}>Add date/time</Button>
          )}
        </div>
        <div className="row row-subtask">
          <SubdirectoryIcon />
          <Button disabled>Add Subtasks</Button>
        </div>
      </FullScreenDialog>
      <DateTimeModal
        task={task}
        confirmLabel="OK"
        open={dateTimeModalOpened}
        handleClose={dateTimeModal.off}
        handleConfirm={dateTimeModal.off}
        onDueDateChange={(date: Date) =>
          setTask({ ...task, due: date.toISOString() })
        }
      />
    </>
  );
}
