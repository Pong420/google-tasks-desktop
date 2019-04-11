import React, { useState, useCallback, forwardRef } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { TaskListState } from '../../store';
import { PATHS } from '../../constants';
import { useMuiMenu } from '../../utils/useMuiMenu';
import { Schema$TaskList } from '../../typings';
import MuiMenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import TickIcon from '@material-ui/icons/Check';

interface Props {
  taskLists: TaskListState['taskLists'];
  currentTaskList: Schema$TaskList;
}

export function TaskListHeader({ taskLists, currentTaskList }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu(null);

  const MenuItem = useCallback(
    forwardRef(
      (
        { selected, classes, children, onClick, ...props }: MenuItemProps,
        ref
      ) => (
        <MuiMenuItem
          classes={{ root: 'mui-menu-item' }}
          onClick={evt => {
            onClose();
            onClick && onClick(evt);
          }}
          {...props}
        >
          {children}
          {selected && <TickIcon />}
        </MuiMenuItem>
      )
    ),
    [onClose]
  );

  return (
    <div className="task-list-header">
      <div className="task-list-menu">
        <div className="task-list-menu-label">TASKS</div>
        <div className="task-list-title">
          {currentTaskList && (
            <Button
              classes={{ root: 'task-list-title-button' }}
              onClick={setAnchorEl}
            >
              {currentTaskList.title} <ArrowDropDownIcon />
            </Button>
          )}
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
          anchorPosition={{
            top: anchorEl ? anchorEl.offsetTop + anchorEl.offsetHeight + 3 : 0,
            left: window.innerWidth
          }}
          anchorReference="anchorPosition"
        >
          {taskLists.map(({ id, title }) => (
            <Link
              to={generatePath(PATHS.TASKLIST, { taskListId: id })}
              key={id}
            >
              <MenuItem>
                <div>{title}</div>
                {currentTaskList && currentTaskList.id === id && <TickIcon />}
              </MenuItem>
            </Link>
          ))}
          <Divider />
          <MenuItem>
            <div>Create new list</div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
