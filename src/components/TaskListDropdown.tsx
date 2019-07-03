import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  MouseEvent,
  ReactNode
} from 'react';
import { Dispatch } from 'redux';
import { connect, Omit } from 'react-redux';
import {
  useMuiMenu,
  SelectableDropdown,
  SelectableDropdownProps,
  FULLSCREEN_DIALOG_TRANSITION
} from './Mui';
import { RootState } from '../store';
import { Schema$TaskList } from '../typings';

interface Props extends Omit<Partial<SelectableDropdownProps>, 'onSelect'> {
  defaultOpen?: boolean;
  onSelect(taskList: Schema$TaskList): void;
  outOfScrollContent?(onClose: () => void): ReactNode;
}

const mapStateToProps = ({
  taskList: { taskLists, currentTaskList }
}: RootState) => ({ taskLists, currentTaskList });

function TaskListDropdownComponent({
  children,
  defaultOpen,
  dispatch,
  currentTaskList,
  onSelect,
  taskLists,
  outOfScrollContent,
  ...props
}: Props & ReturnType<typeof mapStateToProps> & { dispatch: Dispatch }) {
  const currIndex = useRef(0);
  const options = useMemo(
    () =>
      taskLists.map(({ id, title }, index) => {
        if (currentTaskList && currentTaskList.id === id) {
          currIndex.current = index;
        }
        return title!;
      }),
    [taskLists, currentTaskList]
  );
  const [selectedIndex, setIndex] = useState<number | undefined>(
    currIndex.current
  );
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const onClickCallback = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => setAnchorEl(evt),
    [setAnchorEl]
  );

  const onSelectCallback = useCallback(
    (index: number) => {
      onSelect(taskLists[index]);
      setIndex(index);
    },
    [onSelect, taskLists]
  );

  useEffect(() => {
    const el = dropdownRef.current;
    if (defaultOpen && el) {
      setTimeout(() => setAnchorEl(el), FULLSCREEN_DIALOG_TRANSITION / 2);
    }
  }, [setAnchorEl, defaultOpen]);

  return (
    <SelectableDropdown
      {...props}
      anchorEl={anchorEl}
      onClick={onClickCallback}
      onClose={onClose}
      open={!!anchorEl}
      onSelect={onSelectCallback}
      options={options}
      outOfScrollContent={outOfScrollContent && outOfScrollContent(onClose)}
      ref={dropdownRef}
      selectedIndex={selectedIndex}
    />
  );
}

export const TaskListDropdown = React.memo(
  connect(mapStateToProps)(TaskListDropdownComponent)
);
