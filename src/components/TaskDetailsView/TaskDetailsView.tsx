import React, { useState, useCallback, useEffect } from 'react';
import {
  DeleteIcon,
  Dropdown,
  FullScreenDialog,
  FullScreenDialogProps,
  Input,
  IconButton,
  useMuiMenu,
  useMenuItem
} from '../Mui';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/EditOutlined';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';
import { Schema$Task, Schema$TaskList } from '../../typings';

interface Props extends FullScreenDialogProps {
  task: Schema$Task;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList | null;
  deleteTask(task: Schema$Task): void;
  updateTask?(task: Schema$Task): void;
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
  handleClose,
  ...props
}: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(handleClose);

  const [task, setTask] = useState(initialTask);
  const onExitCallback = useCallback(() => {
    updateTask && updateTask(task);
  }, [task, updateTask]);

  const deleteTaskCallback = useCallback(() => {
    deleteTask(task);
    handleClose();
  }, [deleteTask, handleClose, task]);

  // FIXME:
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <FullScreenDialog
      className="task-details-view"
      handleClose={handleClose}
      onExit={onExitCallback}
      headerComponents={
        <IconButton
          tooltip="Delete"
          icon={DeleteIcon}
          onClick={deleteTaskCallback}
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
        onChange={evt => setTask({ ...task, notes: evt.currentTarget.value })}
      />
      <div className="task-details-view-row row-task-list">
        <FormatListBulletedIcon />
        <Dropdown
          label={currentTaskList ? currentTaskList.title! : ''}
          classes={{ paper: 'task-details-view-dropdown-paper' }}
          anchorEl={anchorEl}
          onClick={setAnchorEl}
          onClose={onClose}
          open={Boolean(anchorEl)}
          anchorPosition={{
            top: anchorEl ? anchorEl.offsetTop : 0,
            left: anchorEl ? anchorEl.offsetLeft : 0
          }}
          anchorReference="anchorPosition"
          buttonProps={{
            fullWidth: true,
            disabled: true
          }}
          PaperProps={{
            style: {
              width: `calc(100% - ${anchorEl && anchorEl.offsetLeft + 15}px)`
            }
          }}
          MenuListProps={{
            style: {
              padding: 0
            }
          }}
        >
          {taskLists.map(({ id, title }) => (
            <MenuItem
              key={id}
              text={title}
              selected={currentTaskList !== null && currentTaskList.id === id}
            />
          ))}
        </Dropdown>
      </div>
      <div className="task-details-view-row row-date">
        <EventAvailableIcon />
        <Button disabled>Add date/time</Button>
      </div>
      <div className="task-details-view-row row-subtask">
        <SubdirectoryIcon />
        <Button disabled>Add Subtasks</Button>
      </div>
    </FullScreenDialog>
  );
}
