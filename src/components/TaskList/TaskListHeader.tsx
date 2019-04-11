import React from 'react';
import { Link, generatePath } from 'react-router-dom';
import { TaskListState } from '../../store';
import { PATHS } from '../../constants';
import { useMuiMenu } from '../../utils/useMuiMenu';
import { Schema$TaskList } from '../../typings';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import { useMenuItem } from '../Mui';

interface Props {
  taskLists: TaskListState['taskLists'];
  currentTaskList: Schema$TaskList;
}

export function TaskListHeader({ taskLists, currentTaskList }: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);

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
              <MenuItem
                text={title}
                selected={currentTaskList && currentTaskList.id === id}
              />
            </Link>
          ))}
          <Divider />
          <MenuItem text="Create new list" />
        </Menu>
      </div>
    </div>
  );
}
