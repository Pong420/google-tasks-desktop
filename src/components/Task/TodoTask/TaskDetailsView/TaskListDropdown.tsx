import React, {
  useState,
  useCallback,
  MouseEvent,
  useEffect,
  useRef
} from 'react';
import { connect } from 'react-redux';
import {
  SelectableDropdown,
  useMuiMenu,
  FULLSCREEN_DIALOG_TRANSITION
} from '../../../Mui';
import { RootState } from '../../../../store';

interface Props {
  defaultOpen?: boolean;
  onTaskListChange(id: string | null): void;
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
    taskList: taskList.taskLists
  };
};

const dropdownClasses = { paper: 'task-details-view-dropdown-paper' };
const calcMenuWidth = (el: HTMLElement) => el.offsetWidth;

function TaskListDropdownComponent({
  currIndex,
  defaultOpen,
  options,
  onTaskListChange,
  taskList
}: Props & ReturnType<typeof mapStateToProps>) {
  const {
    anchorEl,
    setAnchorEl,
    anchorPosition,
    setAnchorPosition,
    onClose
  } = useMuiMenu();
  const [selectedIndex, setIndex] = useState<number | undefined>(currIndex);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const onClickCallback = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(evt);
      setAnchorPosition(evt.currentTarget.getBoundingClientRect());
    },
    [setAnchorEl, setAnchorPosition]
  );

  const onExitedCallback = useCallback(() => {
    onTaskListChange(
      currIndex !== selectedIndex ? taskList[selectedIndex].id! : null
    );
  }, [taskList, currIndex, selectedIndex, onTaskListChange]);

  useEffect(() => {
    const el = dropdownRef.current;
    if (defaultOpen && el) {
      setTimeout(
        () => setAnchorPosition(el.getBoundingClientRect()),
        FULLSCREEN_DIALOG_TRANSITION / 2
      );
    }
  }, [setAnchorPosition, defaultOpen]);

  return (
    <SelectableDropdown
      anchorEl={anchorEl}
      anchorPosition={anchorPosition}
      anchorReference="anchorPosition"
      classes={dropdownClasses}
      calcMenuWidth={calcMenuWidth}
      onClick={onClickCallback}
      onClose={onClose}
      open={!!anchorPosition}
      onSelect={setIndex}
      options={options}
      onExited={onExitedCallback}
      ref={dropdownRef}
      selectedIndex={selectedIndex}
    />
  );
}

export const TaskListDropdown = connect(mapStateToProps)(
  TaskListDropdownComponent
);
