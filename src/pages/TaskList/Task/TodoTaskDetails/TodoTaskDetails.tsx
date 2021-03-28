import React, {
  KeyboardEvent,
  useState,
  createContext,
  ReactNode,
  useEffect,
  useContext
} from 'react';
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
import { Schema$Task, Schema$TaskList } from '../../../../typings';
import { useBoolean } from '../../../../hooks/useBoolean';
import {
  todoTaskSelector,
  useTaskActions,
  currentTaskListsSelector
} from '../../../../store';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

interface Props extends Pick<Schema$Task, 'uuid'> {
  taskListDropdownOpened?: boolean;
  openDateTimeDialog: () => void;
}

interface TodoTaskDetailsContext {
  openTodoTaskDetails: (props: Props) => void;
}

const preventStartNewLine = (evt: KeyboardEvent<HTMLDivElement>) =>
  evt.which === 13 && evt.preventDefault();

const dropdownButtonProps = {
  fullWidth: true
};

export const Context = createContext({} as TodoTaskDetailsContext);

export function useTodoTaskDetails() {
  return useContext(Context);
}

export function TodoTaskDetailsProvider({ children }: { children: ReactNode }) {
  const [props, setProps] = useState<Props & Partial<FullScreenDialogProps>>();
  const [isOpen, open, close] = useBoolean();

  useEffect(() => {
    props && open();
  }, [props, open]);

  return (
    <Context.Provider value={{ openTodoTaskDetails: setProps }}>
      {children}
      {props && (
        <TodoTaskDetails
          {...props}
          open={isOpen}
          onClose={close}
          onExited={(...args) => {
            props.onExited && props.onExited(...args);
            setProps(undefined);
          }}
        />
      )}
    </Context.Provider>
  );
}

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
  openDateTimeDialog,
  taskListDropdownOpened,
  ...props
}: Props & FullScreenDialogProps) {
  const [shouldBeDeleted, deleteOnExited] = useBoolean();
  const [moveTo, setMoveTo] = useState<Schema$TaskList>();
  const {
    update: updateTask,
    deleteTask,
    moveToAnotherList
  } = useTaskActions();
  const { title, notes, due } = useSelector(todoTaskSelector(uuid)) || {};
  const currentTaskList = useSelector(currentTaskListsSelector);

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
      onExited={() => {
        if (shouldBeDeleted) {
          deleteTask({ uuid });
        } else if (moveTo && moveTo.id !== currentTaskList.id) {
          moveToAnotherList({ tasklistId: moveTo.id, uuid });
        }
      }}
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
          onSelect={setMoveTo}
          taskList={moveTo}
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
    </FullScreenDialog>
  );
}
