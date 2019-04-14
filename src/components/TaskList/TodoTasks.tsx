import React, { useState } from 'react';
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
  onChange(task: Schema$Task): void;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
}

interface SortableListProps extends Props {
  dragging?: boolean;
  newIndex: number | null;
}

interface TodoTasksProps extends Props {
  onSortEnd(sortEnd: SortEnd): void;
}

const SortableItem = SortableElement((props: TodoTaskProps) => (
  <TodoTask {...props} />
));

const SortableList = SortableContainer(
  ({ dragging, todoTasks, newIndex, ...props }: SortableListProps) => {
    return (
      <div
        className="todo-tasks"
        style={{ pointerEvents: dragging ? 'none' : 'auto' }}
      >
        {todoTasks.map((task, index) => (
          <SortableItem
            {...props}
            className={newIndex === index ? 'border-bottom' : ''}
            index={index}
            task={task}
            key={task.uuid + '@' + index}
          />
        ))}
      </div>
    );
  }
);

export function TodoTasks({ onSortEnd, ...props }: TodoTasksProps) {
  const [dragging, { on, off }] = useBoolean();
  const [newIndex, setNewIndex] = useState<number | null>(null);

  return (
    <SortableList
      {...props}
      dragging={dragging}
      newIndex={newIndex}
      lockAxis="y"
      helperClass="dragging"
      onSortMove={on}
      onSortOver={({ newIndex, oldIndex, index }: SortOver) => {
        const target =
          newIndex - oldIndex > 0
            ? newIndex > index
              ? oldIndex + 1
              : oldIndex
            : newIndex > index
            ? newIndex
            : newIndex - 1;

        setNewIndex(target);
      }}
      onSortEnd={(params: SortEnd) => {
        onSortEnd(params);
        off();
      }}
    />
  );
}
