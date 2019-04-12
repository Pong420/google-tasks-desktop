import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import {
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
import { Button } from '@material-ui/core';

interface Props {
  task: Schema$Task;
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
  onDelete(): void;
}

export function EditTaskButton({
  onDelete,
  taskLists,
  currentTaskList
}: Props) {
  const [open, { on, off }] = useBoolean();
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);

  return (
    <>
      <IconButton className="edit-task-button" onClick={on}>
        <EditIcon />
      </IconButton>
      <FullScreenDialog
        className="edit-task"
        open={open}
        handleClose={off}
        onDelete={onDelete}
      >
        <Input className="filled" placeholder="Enter title" autoFocus />
        <Input className="filled" placeholder="Add details" multiline rows={3} />
        <div className="row">
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
        <div className="row">
          <EventAvailableIcon />
          <Button>Add date/time</Button>
        </div>
        <div className="row">
          <SubdirectoryIcon />
          <Button>Add Subtasks</Button>
        </div>
      </FullScreenDialog>
    </>
  );
}
