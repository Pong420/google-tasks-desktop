import React from 'react';
import { AnchorPosition } from '../../Mui/Menu/useMuiMenu';
import { useMuiMenuItem, Menu } from '../../Mui';

interface Props {
  anchorPosition?: AnchorPosition;
  onClose(): void;
  onDelete(): void;
  openDateTimeModal(): void;
  openTaskListDropdown(): void;
}

export function TodoTaskMenu({
  anchorPosition,
  onClose,
  onDelete,
  openDateTimeModal,
  openTaskListDropdown
}: Props) {
  const MenuItem = useMuiMenuItem({ onClose });

  return (
    <Menu
      open={Boolean(anchorPosition)}
      onClose={onClose}
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
    >
      <MenuItem text="Delete" onClick={onDelete} />
      <MenuItem text="Add date/time" onClick={openDateTimeModal} />
      <MenuItem text="Add a subtask" disabled />
      <MenuItem text="Indent" disabled /> {/* TODO: not should on first task */}
      <MenuItem text="Move to another list" onClick={openTaskListDropdown} />
    </Menu>
  );
}
