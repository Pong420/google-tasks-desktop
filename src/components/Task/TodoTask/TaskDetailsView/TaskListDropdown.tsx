import React from 'react';
import { Dropdown, useMuiMenu, useMenuItem } from '../../../Mui';
import { Schema$TaskList } from '../../../../typings';

interface Props {
  currentTaskList: Schema$TaskList | null;
  taskLists: Schema$TaskList[];
}

export function TaskListDropdown({ currentTaskList, taskLists }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);

  return (
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
  );
}
