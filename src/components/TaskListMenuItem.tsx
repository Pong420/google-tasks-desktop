import React, { useCallback } from 'react';
import { connect, Omit, DispatchProp } from 'react-redux';
import { MenuItem, MenuItemProps } from './Mui';
import { RootState } from '../store';
import { Schema$TaskList } from '../typings';

interface Props extends Omit<MenuItemProps, 'onClick'> {
  id: string;
  onClose(): void;
  onClick(taskList: Schema$TaskList): void;
}

const mapStateToProps = (state: RootState, ownProps: Props) => ({
  taskList: state.taskList.byIds[ownProps.id]
});

export function TaskListMenuItemComponent({
  dispatch,
  taskList,
  onClose,
  onClick,
  ...props
}: Props & ReturnType<typeof mapStateToProps> & DispatchProp) {
  const onClickCallback = useCallback(() => {
    onClick(taskList);
  }, [taskList, onClick]);

  return (
    <MenuItem
      {...props}
      text={taskList.title}
      onClick={onClickCallback}
      onClose={onClose}
    />
  );
}

export const TaskListMenuItem = connect(mapStateToProps)(
  TaskListMenuItemComponent
);
