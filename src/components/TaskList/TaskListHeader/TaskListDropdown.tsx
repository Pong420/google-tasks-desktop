import React, { useRef, useMemo, useCallback } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { useMuiMenu, useMuiMenuItem, Dropdown } from '../../Mui';
import { ScrollContent, SimplebarAPI } from '../../ScrollContent';
import { TaskListState } from '../../../store';
import { PATHS } from '../../../constants';
import { Schema$TaskList } from '../../../typings';
import Divider from '@material-ui/core/Divider';

interface Props {
  onCreateNewTaskList(): void;
  newTaskList(title: string): void;
  taskLists: TaskListState['taskLists'];
  currentTaskList: Schema$TaskList | null;
}

const dropdownClasses = { paper: 'task-list-dropdown-paper' };
const buttonProps = { classes: { root: 'task-list-mui-dropdown-button' } };

export function TaskListDropdown({
  taskLists,
  currentTaskList,
  onCreateNewTaskList
}: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMuiMenuItem({ onClose });

  const simplebarRef = useRef<SimplebarAPI | null>(null);
  const selectedItemRef = useRef<HTMLAnchorElement | null>(null);
  const scrollToSelectedItem = useCallback(() => {
    // Since MenuItem is not mounted as `createPortal` used in ScrollContent
    // so we need setTimeout
    setTimeout(() => {
      if (simplebarRef.current && selectedItemRef.current) {
        simplebarRef.current.getScrollElement().scrollTop =
          selectedItemRef.current.offsetTop -
          selectedItemRef.current.offsetHeight * 2 -
          10;
      }
    }, 0);
  }, []);

  const anchorPosition = useMemo(
    () => ({
      top: anchorEl ? anchorEl.offsetTop + anchorEl.offsetHeight + 3 : 0,
      left: window.innerWidth
    }),
    [anchorEl]
  );

  return (
    <Dropdown
      buttonProps={buttonProps}
      classes={dropdownClasses}
      label={currentTaskList ? currentTaskList.title! : ''}
      onClick={setAnchorEl}
      onClose={onClose}
      onEnter={scrollToSelectedItem}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <div className="dropdown-list-container">
        <ScrollContent simplebarRef={simplebarRef}>
          {taskLists.map(({ id, title }) => {
            const selected = !!currentTaskList && currentTaskList.id === id;
            return (
              <Link
                key={id}
                to={generatePath(PATHS.TASKLIST, { taskListId: id })}
                innerRef={node => {
                  if (selected) {
                    selectedItemRef.current = node;
                  }
                }}
              >
                <MenuItem text={title} selected={selected} />
              </Link>
            );
          })}
        </ScrollContent>
      </div>
      {taskLists.length && <Divider />}
      <MenuItem text="Create new list" onClick={onCreateNewTaskList} />
    </Dropdown>
  );
}
