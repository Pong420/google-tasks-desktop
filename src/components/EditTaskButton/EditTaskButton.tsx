import React, { useState, useCallback, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import {
  DeleteIcon,
  Dropdown,
  FullScreenDialog,
  Input,
  useMuiMenu,
  useMenuItem
} from '../Mui';
import { useBoolean } from '../../utils/useBoolean';
import { Schema$Task, Schema$TaskList } from '../../typings';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';

interface Props {
  task: Schema$Task;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
  deleteTask(task: Schema$Task): void;
  updateTask?(task: Schema$Task): void;
}

// FIXME:
export function EditTaskButton({
  task: initialTask,
  deleteTask,
  updateTask,
  taskLists,
  currentTaskList
}: Props) {
  const [open, { on, off }] = useBoolean();
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);

  const [task, setTask] = useState(initialTask);
  const onExitCallback = useCallback(() => {
    updateTask && updateTask(task);
  }, [task, updateTask]);
  const deleteTaskCallback = useCallback(() => {
    deleteTask(task);
    off();
  }, [deleteTask, off, task]);

  // FIXME:
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  return (
    <>
      <IconButton className="edit-task-button" onClick={on}>
        <EditIcon />
      </IconButton>
      <FullScreenDialog
        className="edit-task"
        open={open}
        handleClose={off}
        onExit={onExitCallback}
        headerComponents={
          <IconButton onClick={deleteTaskCallback}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <Input
          autoFocus
          className="filled edit-task-title-input"
          placeholder="Enter title"
          value={task.title}
          onChange={evt => setTask({ ...task, title: evt.currentTarget.value })}
          readOnly
        />
        <Input
          className="filled"
          placeholder="Add details ( Not supported )"
          multiline
          rows={3}
          readOnly
        />
        <div className="edit-task-row row-task-list">
          <FormatListBulletedIcon />
          <Dropdown
            label={currentTaskList ? currentTaskList.title! : ''}
            classes={{ paper: 'edit-task-dropdown-paper' }}
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
                selected={currentTaskList && currentTaskList.id === id}
              />
            ))}
          </Dropdown>
        </div>
        <div className="edit-task-row row-date">
          <EventAvailableIcon />
          <Button disabled>Add date/time</Button>
        </div>
        <div className="edit-task-row row-subtask">
          <SubdirectoryIcon />
          <Button disabled>Add Subtasks</Button>
        </div>
      </FullScreenDialog>
    </>
  );
}
