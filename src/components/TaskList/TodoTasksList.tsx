import React, { useState, useCallback } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortEnd,
  SortOver
} from 'react-sortable-hoc';
import { TodoTask, TodoTaskProps } from '../Task';
import { Schema$Task, Schema$TaskList } from '../../typings';
import { useBoolean } from '../../utils';

interface Props {
  todoTasks: Schema$Task[];
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
  addTask(task: Schema$Task): void;
  updateTask(task: Schema$Task): void;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
}

interface SortableListProps extends Props {
  dragging?: boolean;
  insertAfter: number | null;
}

interface TodoTasksProps extends Props {
  onSortEnd(sortEnd: SortEnd): void;
}

const SortableItem = SortableElement((props: TodoTaskProps) => (
  <TodoTask {...props} />
));

const SortableList = SortableContainer(
  ({ dragging, todoTasks, insertAfter, ...props }: SortableListProps) => {
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
            inputProps={{
              autoFocus: index === 0 && !task.id
            }}
            key={task.uuid + '@' + index}
            className={
              dragging && insertAfter === index ? 'highlight-bottom-border' : ''
            }
          />
        ))}
      </div>
    );
  }
);

export function TodoTasksList({ onSortEnd, ...props }: TodoTasksProps) {
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

  return (
    <SortableList
      {...props}
      dragging={dragging}
      insertAfter={insertAfter}
      lockAxis="y"
      helperClass="dragging"
      distance={5}
      onSortMove={on}
      onSortOver={onSortOverCallback}
      onSortEnd={(params: SortEnd) => {
        if (params.newIndex !== params.oldIndex) {
          onSortEnd(params);
        }
        off();
      }}
    />
  );
}
