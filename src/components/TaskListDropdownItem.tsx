import React from 'react';
import { useSelector } from 'react-redux';
import { MenuItem, MenuItemProps } from './Mui';
import { Schema$TaskList } from '../typings';
import { taskListsSelector } from '../store';

interface Props extends Omit<MenuItemProps, 'onClick'> {
  id: string;
  onClose(): void;
  onClick(taskList: Schema$TaskList): void;
}

export function TaskListDropdownItem({
  id,
  onClick,
  onClose,
  ...props
}: Props) {
  const taskList = useSelector(taskListsSelector(id))!;

  return (
    <MenuItem
      {...props}
      text={taskList.title || ''}
      onClose={onClose}
      onClick={() => onClick(taskList)}
    />
  );
}
