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
import { Schema$Task, Schema$TaskList } from '../../../../typings';
import Button from '@material-ui/core/Button';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';

interface Props extends FullScreenDialogProps {
  task: Schema$Task;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList | null;
  deleteTask(task: Schema$Task): void;
  updateTask(task: Schema$Task): void;
  openDateTimeModal(): void;
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
  openDateTimeModal,
  ...props
}: Props) {
  const notesInputRef = useRef<HTMLTextAreaElement>(null);
  const shouldDeleteTask = useRef<boolean>(false);

  const [task, setTask] = useState(initialTask);

  const onExitCallback = useCallback(() => {
    updateTask(task);
  }, [task, updateTask]);

  const deleteTaskCallback = useCallback(() => {
    if (shouldDeleteTask.current) {
      deleteTask(task);
    }
  }, [deleteTask, task]);

  const deleteBtnClickedCallback = useCallback(() => {
    shouldDeleteTask.current = true;
    handleClose();
  }, [handleClose]);

  // FIXME:
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <FullScreenDialog
      className="task-details-view"
      handleClose={handleClose}
      onExit={onExitCallback}
      onExited={deleteTaskCallback}
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
      <div className="task-details-view-row row-task-list">
        <FormatListBulletedIcon />
        <TaskListDropdown
          currentTaskList={currentTaskList}
          taskLists={taskLists}
        />
      </div>
      <div className="task-details-view-row row-date">
        <EventAvailableIcon />
        <Button onClick={openDateTimeModal}>Add date/time</Button>
      </div>
      <div className="task-details-view-row row-subtask">
        <SubdirectoryIcon />
        <Button disabled>Add Subtasks</Button>
      </div>
    </FullScreenDialog>
  );
}
