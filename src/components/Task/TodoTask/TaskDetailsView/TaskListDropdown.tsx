import React, { useMemo } from 'react';
import { Dropdown, useMuiMenu, useMenuItem } from '../../../Mui';
import { Schema$TaskList } from '../../../../typings';

interface Props {
  currentTaskList: Schema$TaskList | null;
  taskLists: Schema$TaskList[];
}

const dropdownClasses = { paper: 'task-details-view-dropdown-paper' };
const buttonProps = {
  fullWidth: true,
  disabled: true
};
const menuListProps = {
  style: {
    padding: 0
  }
};

export function TaskListDropdown({ currentTaskList, taskLists }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);

  const { anchorPosition, paperProps } = useMemo(() => {
    const { offsetTop = 0, offsetLeft = 0 } = anchorEl || {};

    return {
      anchorPosition: {
        top: offsetTop,
        left: offsetLeft
      },
      paperProps: {
        style: { width: `calc(100% - ${offsetLeft + 15}px)` }
      }
    };
  }, [anchorEl]);

  return (
    <Dropdown
      label={currentTaskList ? currentTaskList.title! : ''}
      classes={dropdownClasses}
      anchorEl={anchorEl}
      onClick={setAnchorEl}
      onClose={onClose}
      open={Boolean(anchorEl)}
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
      buttonProps={buttonProps}
      PaperProps={paperProps}
      MenuListProps={menuListProps}
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
