import React from 'react';
import { AnchorPosition } from '../../Mui/Menu/useMuiMenu';
import { useMenuItem, Menu } from '../../Mui';

interface Props {
  anchorPosition?: AnchorPosition;
  onClose(): void;
  onDelete(): void;
}

export function TodoTaskMenu({ anchorPosition, onClose, onDelete }: Props) {
  const MenuItem = useMenuItem(onClose);

  return (
    <Menu
      open={Boolean(anchorPosition)}
      onClose={onClose}
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
    >
      <MenuItem text="Delete" onClick={onDelete} />
      <MenuItem text="Add date/time" disabled />
      <MenuItem text="Add a subtask" disabled />
      <MenuItem text="Indent" disabled />
      <MenuItem text="Move to another list" disabled />
    </Menu>
  );
}
