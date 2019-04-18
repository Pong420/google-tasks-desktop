import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';

interface Props {
  onClick(): void;
}

// FIXME:
export function EditTaskButton({ onClick }: { onClick(): void }) {
  return (
    <IconButton className="edit-task-button" onClick={onClick}>
      <EditIcon />
    </IconButton>
  );
}
