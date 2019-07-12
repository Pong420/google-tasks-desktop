import React, { useCallback } from 'react';
import { Omit } from 'react-redux';
import { useMuiMenuItem, Menu, MenuProps } from '../../Mui';

interface Props extends Omit<MenuProps, 'ref'> {
  due?: string;
  onDelete(): void;
  openDateTimeDialog(): void;
  openTaskListDropdown(): void;
}

const classes: MenuProps['classes'] = { paper: 'todo-task-menu-paper' };

export const TodoTaskMenu = React.memo(
  ({
    due,
    onClose,
    onDelete,
    openDateTimeDialog,
    openTaskListDropdown,
    ...props
  }: Props) => {
    const MenuItem = useMuiMenuItem({ onClose });
    const onDeleteCallback = useCallback(() => onDelete(), [onDelete]);

    return (
      <Menu {...props} classes={classes} onClose={onClose}>
        <MenuItem text="Delete" onClick={onDeleteCallback} />
        <MenuItem
          text={`${due ? 'Change' : 'Add'} date/time`}
          onClick={openDateTimeDialog}
        />
        <MenuItem text="Add a subtask" disabled />
        <MenuItem text="Indent" disabled />{' '}
        {/* TODO: not should on first task */}
        <MenuItem text="Move to another list" onClick={openTaskListDropdown} />
      </Menu>
    );
  }
);
