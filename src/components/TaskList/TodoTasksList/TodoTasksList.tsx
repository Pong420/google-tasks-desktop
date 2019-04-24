import React, { useState, useCallback } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortEnd,
  SortOver
} from 'react-sortable-hoc';
import { TodoTask, TodoTaskProps } from '../../Task';
import { useBoolean } from '../../../utils';
import { Schema$Task } from '../../../typings';

interface Props {
  todoTasks: Schema$Task[];
  toggleCompleted(task: Schema$Task): void;
  focusIndex: number | null;
  setFocusIndex(indxe: number | null): void;
}

interface SortableListProps extends Props {
  dragging?: boolean;
  insertAfter: number | null;
}

interface TodoTasksListProps extends Props {
  onSortEnd(sortEnd: Pick<SortEnd, 'newIndex' | 'oldIndex'>): void;
}

const SortableItem = SortableElement((props: TodoTaskProps) => (
  <TodoTask {...props} />
));

const SortableList = SortableContainer(
  ({
    dragging,
    todoTasks,
    insertAfter,
    focusIndex,
    setFocusIndex,
    ...props
  }: SortableListProps) => {
    return (
      <div
        className="todo-tasks-list"
        style={{ pointerEvents: dragging ? 'none' : 'auto' }}
      >
        {todoTasks.map((task, index) => (
          <SortableItem
            {...props}
            task={task}
            index={index}
            key={task.uuid + '@' + index}
            focused={focusIndex === index}
            setFocusIndex={setFocusIndex}
            className={
              dragging && insertAfter === index ? 'highlight-bottom-border' : ''
            }
          />
        ))}
      </div>
    );
  }
);

export function TodoTasksList({ onSortEnd, ...props }: TodoTasksListProps) {
  const [dragging, { on, off }] = useBoolean();
  const [insertAfter, setInsertAfter] = useState<number | null>(null);
  const onSortOverCallback = useCallback(
    ({ newIndex, oldIndex, index }: SortOver) => {
      let insertAfter: number | null = null;
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

  const onSortEndCallack = useCallback(
    (params: Pick<SortEnd, 'newIndex' | 'oldIndex'>) => {
      if (params.newIndex !== params.oldIndex) {
        onSortEnd(params);
      }
      off();
    },
    [off, onSortEnd]
  );

  return (
    <SortableList
      dragging={dragging}
      insertAfter={insertAfter}
      lockAxis="y"
      helperClass="dragging"
      distance={5}
      onSortMove={on}
      onSortOver={onSortOverCallback}
      onSortEnd={onSortEndCallack}
      {...props}
    />
  );
}
