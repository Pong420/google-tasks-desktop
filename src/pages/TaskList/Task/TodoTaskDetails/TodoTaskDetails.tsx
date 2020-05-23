import React, { KeyboardEvent } from 'react';
import { useSelector } from 'react-redux';
import {
  DeleteIcon,
  EditIcon,
  FullScreenDialog,
  FullScreenDialogProps,
  IconButton,
  Input
} from '../../../../components/Mui';
import { TaskListDropdown } from '../../TaskListDropdown';
import { DateTimeButton } from './DateTimeButton';
import { Schema$Task } from '../../../../typings';
import { useBoolean } from '../../../../hooks/useBoolean';
import { todoTaskSelector, useTaskActions } from '../../../../store';
import Button from '@material-ui/core/Button';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SubdirectoryIcon from '@material-ui/icons/SubdirectoryArrowRight';

interface Props extends FullScreenDialogProps, Pick<Schema$Task, 'uuid'> {
  taskListDropdownOpened?: boolean;
  onDelete: () => void;
  openDateTimeDialog: () => void;
}

const preventStartNewLine = (evt: KeyboardEvent<HTMLDivElement>) =>
  evt.which === 13 && evt.preventDefault();

const dropdownButtonProps = {
  fullWidth: true
};

export const EditTaskButton = ({ onClick }: { onClick(): void }) => {
  return (
    <IconButton
      className="edit-task-button"
      tooltip="Edit details"
      icon={EditIcon}
      onClick={onClick}
    />
  );
};

export function TodoTaskDetails({
  uuid,
  open,
  onClose,
  onDelete,
  openDateTimeDialog,
  taskListDropdownOpened,
  ...props
}: Props) {
  const [shouldBeDeleted, deleteOnExited] = useBoolean();
  const { updateTask } = useTaskActions();
  const { title, notes, due } = useSelector(todoTaskSelector(uuid)) || {};

  return (
    <FullScreenDialog
      {...props}
      className="todo-task-details"
      open={!shouldBeDeleted && open}
      onClose={onClose}
      headerComponents={
        <IconButton
          tooltip="Delete"
          icon={DeleteIcon}
          onClick={deleteOnExited}
        />
      }
      onExited={shouldBeDeleted ? onDelete : undefined}
    >
      <Input
        multiline
        autoFocus
        className="filled todo-task-details-title-field"
        placeholder="Enter title"
        onKeyPress={preventStartNewLine}
        value={title}
        onChange={event =>
          updateTask({ uuid, title: event.currentTarget.value })
        }
      />

      <Input
        multiline
        rows={3}
        rowsMax={Infinity}
        value={notes}
        onChange={event =>
          updateTask({ uuid, notes: event.currentTarget.value })
        }
        className="filled todo-task-details-notes-field"
        placeholder="Add details"
      />

      <div className="row row-task-list">
        <FormatListBulletedIcon />
        <TaskListDropdown
          buttonProps={dropdownButtonProps}
          defaultOpen={taskListDropdownOpened}
          onSelect={console.log}
          paperClassName="details-task-list-dropdown-paper"
        />
      </div>

      <div className="row row-date">
        <EventAvailableIcon />
        <DateTimeButton
          date={due ? new Date(due) : undefined}
          onClick={openDateTimeDialog}
          onRemove={() => updateTask({ uuid, due: null })}
        />
      </div>

      <div className="row row-subtask">
        <SubdirectoryIcon />
        <Button disabled>Add Subtasks</Button>
      </div>
    </FullScreenDialog>
  );
}
