import React, { useState, useMemo, useCallback, CSSProperties } from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  SortableContainer,
  SortableElement,
  SortOverHandler,
  SortEndHandler
} from 'react-sortable-hoc';
import { TodoTask, TodoTaskProps } from '../Task/';
import { useBoolean } from '../../utils/useBoolean';
import { RootState, moveTask } from '../../store';

interface InsertAfter {
  insertAfter?: number;
}

interface SortableListProps extends InsertAfter {
  dragging?: boolean;
  todoTasks: Array<TodoTaskProps['uuid']>;
}

const mapStateToProps = (state: RootState) => ({
  todoTasks: state.task.todo
});

const SortableItem = SortableElement((props: TodoTaskProps) => (
  <TodoTask {...props} />
));

const SortableList = SortableContainer(
  ({ dragging, todoTasks, insertAfter }: SortableListProps) => {
    const style = useMemo<CSSProperties>(
      () => ({ pointerEvents: dragging ? 'none' : 'auto' }),
      [dragging]
    );

    return (
      <div className="todo-tasks-list" style={style}>
        {todoTasks.map((uuid, index) => (
          <SortableItem
            className={
              dragging && insertAfter === index ? 'highlight-bottom-border' : ''
            }
            key={uuid + index}
            uuid={uuid}
            index={index}
          />
        ))}
      </div>
    );
  }
);

export function TodoTaskListComponent({
  todoTasks,
  dispatch
}: ReturnType<typeof mapStateToProps> & DispatchProp) {
  const [dragging, { on, off }] = useBoolean();
  const [insertAfter, setInsertAfter] = useState<number>();

  const onSortOverCallback = useCallback<SortOverHandler>(
    ({ newIndex, oldIndex, index }) => {
      let insertAfter;
      const move = newIndex - oldIndex > 0 ? 'down' : 'up';

      if (move === 'down') {
        insertAfter = newIndex > index ? oldIndex + 1 : oldIndex;
      } else if (move === 'up') {
        insertAfter = newIndex > index ? newIndex : newIndex - 1;
      }

      // TODO: make it better
      setInsertAfter(insertAfter);
    },
    []
  );

  const onSortEndCallack = useCallback<SortEndHandler>(
    ({ newIndex, oldIndex }) => {
      if (newIndex !== oldIndex) {
        dispatch(
          moveTask({
            prevTask: todoTasks[newIndex],
            uuid: todoTasks[oldIndex]
          })
        );
      }
      off();
    },
    [dispatch, off, todoTasks]
  );

  return (
    <SortableList
      dragging={dragging}
      helperClass="dragging"
      insertAfter={insertAfter}
      lockAxis="y"
      onSortMove={on}
      onSortOver={onSortOverCallback}
      onSortEnd={onSortEndCallack}
      pressDelay={150}
      todoTasks={todoTasks}
    />
  );
}

export const TodoTaskList = connect(mapStateToProps)(TodoTaskListComponent);
