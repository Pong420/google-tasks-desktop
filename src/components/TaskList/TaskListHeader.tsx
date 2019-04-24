import React, { useRef, useCallback } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { useMuiMenu, useMenuItem, Dropdown, FormModal } from '../Mui';
import { ScrollContent, SimplebarAPI } from '../ScrollContent';
import { TaskListState } from '../../store';
import { PATHS } from '../../constants';
import { Schema$TaskList } from '../../typings';
import { useBoolean } from '../../utils/useBoolean';
import Divider from '@material-ui/core/Divider';

interface Props {
  newTaskList(title: string): void;
  taskLists: TaskListState['taskLists'];
  currentTaskList: Schema$TaskList;
}

export function TaskListHeader({
  newTaskList,
  taskLists,
  currentTaskList
}: Props) {
  const [modalOpened, { on: openModal, off: closeModal }] = useBoolean(false);
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);

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

  return (
    <div className="task-list-header">
      <div className="task-list-menu">
        <div className="task-list-menu-label">
          <span>TASKS</span>
        </div>
        <Dropdown
          buttonProps={{ classes: { root: 'task-list-dropdown-button' } }}
          classes={{ paper: 'task-list-dropdown-paper' }}
          label={currentTaskList ? currentTaskList.title! : ''}
          onClick={setAnchorEl}
          onClose={onClose}
          onEnter={scrollToSelectedItem}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorReference="anchorPosition"
          anchorPosition={{
            top: anchorEl ? anchorEl.offsetTop + anchorEl.offsetHeight + 3 : 0,
            left: window.innerWidth
          }}
        >
          <div className="dropdown-list-container">
            <ScrollContent simplebarRef={simplebarRef}>
              {taskLists.map(({ id, title }) => {
                const selected = currentTaskList && currentTaskList.id === id;
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
          <MenuItem text="Create new list" onClick={openModal} />
        </Dropdown>
      </div>
      <FormModal
        title="Create new list"
        open={modalOpened}
        handleClose={closeModal}
        handleConfirm={newTaskList}
      />
    </div>
  );
}
