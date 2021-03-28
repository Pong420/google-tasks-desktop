import React, {
  createContext,
  useContext,
  useState,
  MouseEvent,
  ReactNode
} from 'react';
import { useSelector } from 'react-redux';
import {
  useMuiMenuItem,
  Menu,
  MenuProps,
  useMuiMenu
} from '../../../../components/Mui';
import { todoTaskSelector } from '../../../../store';

interface Props {
  uuid: string;
  onDelete?: () => void;
  openDateTimeDialog?: () => void;
  moveToAnotherList?: () => void;
  firstTask?: boolean;
}

interface TodoTaskMenuContext {
  openTodoTaskMenu: (props: Props & { event: MouseEvent<HTMLElement> }) => void;
}

type Control = Omit<MenuProps, 'ref'>;

const classes: MenuProps['classes'] = { paper: 'todo-task-menu-paper' };

const Context = createContext({} as TodoTaskMenuContext);

export function useTodoTaskMenu() {
  return useContext(Context);
}

export function TodoTaskMenuProvider({ children }: { children: ReactNode }) {
  const [props, setProps] = useState<Props & Partial<Control>>();
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();

  return (
    <Context.Provider
      value={{
        openTodoTaskMenu: ({ event, ...props }) => {
          setProps(props);
          setAnchorPosition(event);
        }
      }}
    >
      {children}
      {props && (
        <TodoTaskMenu
          {...props}
          keepMounted={false}
          anchorPosition={anchorPosition}
          anchorReference="anchorPosition"
          open={!!anchorPosition}
          onClose={() => {
            onClose();
            setProps(undefined);
          }}
        />
      )}
    </Context.Provider>
  );
}

export const TodoTaskMenu = ({
  uuid,
  onClose,
  onDelete,
  openDateTimeDialog,
  moveToAnotherList,
  firstTask,
  ...props
}: Props & Control) => {
  const MenuItem = useMuiMenuItem({ onClose });
  const { due } = useSelector(todoTaskSelector(uuid)) || {};

  return (
    <Menu {...props} classes={classes} onClose={onClose}>
      <MenuItem text="Delete" onClick={onDelete} />
      <MenuItem
        text={`${due ? 'Change' : 'Add'} date/time`}
        onClick={openDateTimeDialog}
      />
      <MenuItem text="Add a subtask" disabled />
      {!firstTask && <MenuItem text="Indent" disabled />}
      <MenuItem text="Move to another list" onClick={moveToAnotherList} />
    </Menu>
  );
};
