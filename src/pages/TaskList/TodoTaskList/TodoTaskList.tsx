import React, { useState, useCallback } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortOverHandler,
  SortEndHandler
} from 'react-sortable-hoc';
import { TodoTask, TodoTaskProps } from '../Task';
import { useTaskActions } from '../../../store';
import { useBoolean } from '../../../hooks/useBoolean';

interface Props {
  tasks: string[];
}

interface InsertAfter {
  insertAfter?: number;
}

interface SortableListProps extends InsertAfter {
  dragging?: boolean;
  todoTasks: Array<TodoTaskProps['uuid']>;
}

const SortableItem = SortableElement((props: TodoTaskProps) => (
  <TodoTask {...props} />
));

const SortableList = SortableContainer(
  ({ dragging, todoTasks, insertAfter }: SortableListProps) => {
    return (
      <div
        className="todo-tasks-list"
        style={{ pointerEvents: dragging ? 'none' : 'auto' }}
      >
        {todoTasks.map((uuid, index) => (
          <SortableItem
            className={
              dragging && insertAfter === index ? 'highlight-bottom-border' : ''
            }
            key={uuid}
            uuid={uuid}
            index={index}
          />
        ))}
      </div>
    );
  }
);

export function TodoTaskList({ tasks }: Props) {
  const [dragging, dragStart, dragEnd] = useBoolean();
  const [insertAfter, setInsertAfter] = useState<number>();

  const { moveTask } = useTaskActions();

  const onSortOverCallback = useCallback<SortOverHandler>(
    ({ newIndex, oldIndex, index }) => {
      let insertAfter;
      const move = newIndex - oldIndex > 0 ? 'down' : 'up';

      if (move === 'down') {
        insertAfter = newIndex > index ? oldIndex + 1 : oldIndex;
      } else if (move === 'up') {
        insertAfter = newIndex > index ? newIndex : newIndex - 1;
      }

      setInsertAfter(insertAfter);
    },
    []
  );

  const onSortEndCallack = useCallback<SortEndHandler>(
    ({ newIndex, oldIndex, nodes }) => {
      if (newIndex !== oldIndex) {
        const flag = newIndex > oldIndex ? 0 : -1;
        const [from, to, prevUUID] = [oldIndex, newIndex, newIndex + flag].map(
          idx => {
            const clone = nodes as any[];
            const { node }: Partial<{ node: HTMLElement }> = clone[idx] || {};
            const id = node && node.getAttribute('data-uuid');
            return id ? String(id) : undefined;
          }
        );

        if (from && to) {
          moveTask({ prevUUID, from, to });
        }
      }
      dragEnd();
    },
    [moveTask, dragEnd]
  );

  return (
    <div className="todo-tasks-list">
      <SortableList
        distance={10}
        dragging={dragging}
        helperClass="dragging"
        insertAfter={insertAfter}
        lockAxis="y"
        onSortMove={dragStart}
        onSortOver={onSortOverCallback}
        onSortEnd={onSortEndCallack}
        todoTasks={tasks}
      />
    </div>
  );
}
