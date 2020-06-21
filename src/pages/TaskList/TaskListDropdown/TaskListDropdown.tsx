import React, { ReactNode, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  useMuiMenu,
  Dropdown,
  DropdownProps,
  FULLSCREEN_DIALOG_TRANSITION
} from '../../../components/Mui';
import { TaskListDropdownItem } from './TaskListDropdownItem';
import { taskListIdsSelector, currentTaskListsSelector } from '../../../store';
import { Schema$TaskList } from '../../../typings';

export interface TaskListDropdownProps
  extends Omit<Partial<DropdownProps>, 'onSelect'> {
  defaultOpen?: boolean;
  paperClassName?: string;
  footer?(onClose: () => void): ReactNode;
  onSelect(taskList: Schema$TaskList): void;
  taskList?: Schema$TaskList;
}

export function TaskListDropdown({
  children,
  onSelect,
  defaultOpen,
  footer,
  paperClassName,
  PaperProps,
  taskList: controlled,
  ...props
}: TaskListDropdownProps) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const ids = useSelector(taskListIdsSelector);
  const currentTaskList = useSelector(currentTaskListsSelector);
  const taskList = controlled || currentTaskList;
  const dropdownRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dropdownRef.current;
    if (defaultOpen && el) {
      setTimeout(() => setAnchorEl(el), FULLSCREEN_DIALOG_TRANSITION / 2);
    }
  }, [setAnchorEl, defaultOpen]);

  return (
    <Dropdown
      {...props}
      ref={dropdownRef}
      PaperProps={{ className: paperClassName }}
      label={(taskList && taskList.title) || 'Loading...'}
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClick={setAnchorEl}
      onClose={onClose}
      onEnter={el => {
        const scroller = el.querySelector<HTMLDivElement>('.scroll-content');
        const item = el.querySelector<SVGElement>('svg')!.parentElement!
          .offsetParent as HTMLElement;
        if (scroller && item) {
          scroller.scrollTop = item.offsetTop - 10 - item.offsetHeight * 2; // 10px padding;
        }
      }}
      footer={footer && footer(onClose)}
    >
      {ids.map(id => {
        return (
          <TaskListDropdownItem
            id={id}
            key={id}
            onClick={onSelect}
            onClose={onClose}
            selected={taskList && taskList.id === id}
          />
        );
      })}
    </Dropdown>
  );
}
