import React from 'react';
import { Link, generatePath } from 'react-router-dom';
import { useMuiMenu, useMenuItem, Dropdown, FormModal } from '../Mui';
import { TaskListState } from '../../store';
import { PATHS } from '../../constants';
import { Schema$TaskList } from '../../typings';
import { useBoolean } from '../../utils/useBoolean';
import Divider from '@material-ui/core/Divider';

interface Props {
  addTaskList(title: string): void;
  taskLists: TaskListState['taskLists'];
  currentTaskList: Schema$TaskList;
}

export function TaskListHeader({
  addTaskList,
  taskLists,
  currentTaskList
}: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);
  const [modalOpened, { on: openModal, off: closeModal }] = useBoolean(false);

  return (
    <div className="task-list-header">
      <div className="task-list-menu">
        <div className="task-list-menu-label">TASKS</div>
        <Dropdown
          classes={{ paper: 'task-list-dropdown' }}
          label={currentTaskList ? currentTaskList.title! : ''}
          onClick={setAnchorEl}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
          anchorReference="anchorPosition"
          anchorPosition={{
            top: anchorEl ? anchorEl.offsetTop + anchorEl.offsetHeight + 3 : 0,
            left: window.innerWidth
          }}
        >
          <div className="dropdown-list-container">
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
          </div>
          {taskLists.length && <Divider />}
          <MenuItem text="Create new list" onClick={openModal} />
        </Dropdown>
      </div>
      <FormModal
        title="Create new list"
        open={modalOpened}
        handleClose={closeModal}
        handleConfirm={addTaskList}
      />
    </div>
  );
}
