import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { TodoTask, TodoTaskProps } from '../Task';
import { useTaskActions, todoTaskIdsSelector } from '../../../store';
import { useBoolean } from '../../../hooks/useBoolean';

interface InsertAfter {
  insertAfter?: number;
}

interface SortableListProps extends InsertAfter {
  dragging?: boolean;
  todoTasks: Array<TodoTaskProps['uuid']>;
}

const SortableItem = SortableElement(
  ({ sortIndex, ...props }: TodoTaskProps & { sortIndex: number }) => (
    <TodoTask {...props} index={sortIndex} />
  )
);

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
            sortIndex={index}
            index={index}
          />
        ))}
      </div>
    );
  }
);

export function TodoTaskList() {
  const tasks = useSelector(todoTaskIdsSelector);
  const [dragging, dragStart, dragEnd] = useBoolean();
  const [insertAfter, setInsertAfter] = useState<number>();
  const { moveTask } = useTaskActions();

  return (
    <div className="todo-tasks-list">
      <SortableList
        lockAxis="y"
        helperClass="dragging"
        distance={10}
        dragging={dragging}
        insertAfter={insertAfter}
        todoTasks={tasks}
        onSortMove={dragStart}
        onSortOver={({ newIndex, oldIndex, index }) => {
          let insertAfter;
          const move = newIndex - oldIndex > 0 ? 'down' : 'up';

          if (move === 'down') {
            insertAfter = newIndex > index ? oldIndex + 1 : oldIndex;
          } else if (move === 'up') {
            insertAfter = newIndex > index ? newIndex : newIndex - 1;
          }

          setInsertAfter(insertAfter);
        }}
        onSortEnd={({ newIndex, oldIndex }) => {
          if (newIndex !== oldIndex) {
            moveTask({ uuid: tasks[oldIndex], from: oldIndex, to: newIndex });
          }
          dragEnd();
        }}
      />
    </div>
  );
}
