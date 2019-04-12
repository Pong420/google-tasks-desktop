import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';

export function EditTaskButton() {
  return (
    <IconButton className="edit-task-button">
      <EditIcon />
    </IconButton>
  );
}
