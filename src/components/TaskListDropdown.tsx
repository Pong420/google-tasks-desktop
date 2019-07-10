import React, {
  useCallback,
  useMemo,
  useRef,
  MouseEvent,
  ReactNode,
  useState,
  useEffect
} from 'react';
import { connect, Omit, DispatchProp } from 'react-redux';
import {
  useMuiMenu,
  DropDownProps,
  Dropdown,
  FULLSCREEN_DIALOG_TRANSITION
} from './Mui';
import { TaskListMenuItem } from './TaskListMenuItem';
import { RootState, currentTaskListSelector } from '../store';
import { Schema$TaskList, SimplebarAPI } from '../typings';

interface Props extends Omit<Partial<DropDownProps>, 'onSelect'> {
  defaultOpen?: boolean;
  onSelect(taskList: Schema$TaskList): void;
  outOfScrollContent?(onClose: () => void): ReactNode;
  paperClassName?: string;
}

const mapStateToProps = (state: RootState) => ({
  taskLists: state.taskList.ids,
  currentTaskList: currentTaskListSelector(state)
});

function TaskListDropdownComponent({
  children,
  defaultOpen,
  dispatch,
  currentTaskList,
  taskLists,
  onSelect,
  outOfScrollContent,
  paperClassName,
  PaperProps,
  ...props
}: Props & ReturnType<typeof mapStateToProps> & DispatchProp) {
  const [taskList, setTaskList] = useState(currentTaskList);

  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  const simplebarRef = useRef<SimplebarAPI>(null);
  const focusItemRef = useRef<HTMLLIElement | null>(null);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const label = taskList ? taskList.title : 'Loading...';

  const mergedPaperProps = useMemo<typeof PaperProps>(
    () => ({
      classes: { root: paperClassName },
      ...PaperProps
    }),
    [paperClassName, PaperProps]
  );

  const scrollToSelectedItem = useCallback(() => {
    setTimeout(() => {
      if (simplebarRef.current && focusItemRef.current) {
        const scrollEl = simplebarRef.current.getScrollElement();
        if (scrollEl) {
          scrollEl.scrollTop =
            focusItemRef.current.offsetTop -
            focusItemRef.current.offsetHeight * 2;
        }
      }
    }, 0);
  }, []);

  const onClickCallback = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => setAnchorEl(evt),
    [setAnchorEl]
  );

  const onSelectCallback = useCallback(
    (taskList: Schema$TaskList) => {
      setTaskList(taskList);
      onSelect(taskList);
    },
    [onSelect]
  );

  useEffect(() => {
    setTaskList(currentTaskList);
  }, [currentTaskList]);

  useEffect(() => {
    const el = dropdownRef.current;
    if (defaultOpen && el) {
      setTimeout(() => setAnchorEl(el), FULLSCREEN_DIALOG_TRANSITION / 2);
    }
  }, [setAnchorEl, defaultOpen]);

  return (
    <Dropdown
      {...props}
      anchorEl={anchorEl}
      label={label}
      open={!!anchorEl}
      onClick={onClickCallback}
      onClose={onClose}
      onEnter={scrollToSelectedItem}
      outOfScrollContent={outOfScrollContent && outOfScrollContent(onClose)}
      PaperProps={mergedPaperProps}
      ref={dropdownRef}
      simplebarRef={simplebarRef}
    >
      {taskLists.map(id => {
        const selected = !!taskList && taskList.id === id;
        return (
          <TaskListMenuItem
            key={id}
            id={id}
            onClose={onClose}
            onClick={onSelectCallback}
            selected={selected}
            innerRef={node => selected && (focusItemRef.current = node)}
          />
        );
      })}
    </Dropdown>
  );
}

export const TaskListDropdown = React.memo(
  connect(mapStateToProps)(TaskListDropdownComponent)
);
