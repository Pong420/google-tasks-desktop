import React, {
  useState,
  useEffect,
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

const mapStateToProps = ({ taskList }: RootState) => {
  let currIndex;

  const options = taskList.taskLists.map(({ id, title }, index) => {
    if (taskList.currentTaskList && taskList.currentTaskList.id === id) {
      currIndex = index;
    }
    return title!;
  });

  return {
    options,
    currIndex,
    taskLists: taskList.taskLists
  };
};

function TaskListDropdownComponent({
  children,
  currIndex,
  defaultOpen,
  dispatch,
  options,
  onSelect,
  taskLists,
  outOfScrollContent,
  ...props
}: Props & ReturnType<typeof mapStateToProps> & { dispatch: Dispatch }) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const [selectedIndex, setIndex] = useState<number | undefined>(currIndex);
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

export const TaskListDropdown = connect(mapStateToProps)(
  TaskListDropdownComponent
);
