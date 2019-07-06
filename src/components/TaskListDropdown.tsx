import React, {
  useCallback,
  useMemo,
  useRef,
  MouseEvent,
  ReactNode
} from 'react';
import { connect, Omit, DispatchProp } from 'react-redux';
import { useMuiMenu, DropDownProps, Dropdown } from './Mui';
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
  const label = currentTaskList ? currentTaskList.title : 'Loading...';

  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();

  const simplebarRef = useRef<SimplebarAPI>(null);
  const focusItemRef = useRef<HTMLLIElement | null>(null);

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

  const mergedPaperProps = useMemo<typeof PaperProps>(
    () => ({
      classes: { root: paperClassName },
      ...PaperProps
    }),
    [paperClassName, PaperProps]
  );

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
      simplebarRef={simplebarRef}
    >
      {taskLists.map(id => {
        const selected = !!currentTaskList && currentTaskList.id === id;
        return (
          <TaskListMenuItem
            key={id}
            id={id}
            onClose={onClose}
            onClick={onSelect}
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
