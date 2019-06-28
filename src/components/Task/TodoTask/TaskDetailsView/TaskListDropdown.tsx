import React, { useState, useCallback, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { SelectableDropdown, useMuiMenu } from '../../../Mui';
import { RootState } from '../../../../store';

interface Props {
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
  options,
  currIndex,
  taskList,
  onTaskListChange
}: Props & ReturnType<typeof mapStateToProps>) {
  const {
    anchorEl,
    setAnchorEl,
    anchorPosition,
    setAnchorPosition,
    onClose
  } = useMuiMenu();
  const [selectedIndex, setIndex] = useState<number | undefined>(currIndex);

  const onClickCallback = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(evt);
      setAnchorPosition(evt, evt.currentTarget.getBoundingClientRect());
    },
    [setAnchorEl, setAnchorPosition]
  );

  const onExitedCallback = useCallback(() => {
    onTaskListChange(
      currIndex !== selectedIndex ? taskList[selectedIndex].id! : null
    );
  }, [taskList, currIndex, selectedIndex, onTaskListChange]);

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
      selectedIndex={selectedIndex}
    />
  );
}

export const TaskListDropdown = connect(mapStateToProps)(
  TaskListDropdownComponent
);
