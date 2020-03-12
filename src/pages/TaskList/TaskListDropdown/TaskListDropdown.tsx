import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useMuiMenu, Dropdown, DropdownProps } from '../../../components/Mui';
import { TaskListDropdownItem } from './TaskListDropdownItem';
import { taskListIdsSelector } from '../../../store';
import { Schema$TaskList } from '../../../typings';
import { useCurrenTaskList } from '../../../hooks/useCurrenTaskList';

export interface TaskListDropdownProps
  extends Omit<Partial<DropdownProps>, 'onSelect'> {
  defaultOpen?: boolean;
  paperClassName?: string;
  footer?(onClose: () => void): ReactNode;
  onSelect(taskList: Schema$TaskList): void;
}

export function TaskListDropdown({
  children,
  onSelect,
  defaultOpen,
  footer,
  paperClassName,
  PaperProps,
  ...props
}: TaskListDropdownProps) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const ids = useSelector(taskListIdsSelector);
  const current = useCurrenTaskList();

  return (
    <Dropdown
      {...props}
      PaperProps={{ className: paperClassName }}
      label={(current && current.title) || 'Loading...'}
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClick={setAnchorEl}
      onClose={onClose}
      onEnter={el => {
        const scroller = el.querySelector<HTMLDivElement>('.scroll-content');
        const item = el.querySelector<SVGElement>('svg')!.parentElement!
          .offsetParent as HTMLElement;
        if (scroller && item) {
          scroller.scrollTop = item.offsetTop;
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
            selected={current && current.id === id}
          />
        );
      })}
    </Dropdown>
  );
}
