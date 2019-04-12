import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { FullScreenDialog, Input } from '../Mui';
import { useBoolean } from '../../utils/useBoolean';

export function EditTaskButton() {
  const [open, { on, off }] = useBoolean();

  return (
    <>
      <IconButton className="edit-task-button" onClick={on}>
        <EditIcon />
      </IconButton>
      <FullScreenDialog open={open} handleClose={off}>
        <Input placeholder="Enter title" autoFocus />
        <Input placeholder="Add details" multiline rows={3} />
        <div className="row">
          <FormatListBulletedIcon />
          
        </div>
      </FullScreenDialog>
    </>
  );
}
