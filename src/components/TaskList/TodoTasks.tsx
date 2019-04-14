import React, { useCallback } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortEnd
} from 'react-sortable-hoc';
import { TodoTask, TodoTaskProps } from '../Task';
import { Schema$Task, Schema$TaskList } from '../../typings';

interface Props {
  todoTasks: Schema$Task[];
  taskLists: Schema$TaskList[];
  currentTaskList: Schema$TaskList;
  onChange(task: Schema$Task): void;
  deleteTask(task: Schema$Task): void;
  toggleCompleted(task: Schema$Task): void;
  onSortEnd(sortEnd: SortEnd): void;
}

const SortableItem = SortableElement((props: TodoTaskProps) => (
  <TodoTask {...props} />
));

const SortableList = SortableContainer(
  ({
    todoTasks,
    taskLists,
    currentTaskList,
    onChange,
    deleteTask,
    toggleCompleted
  }: Props) => {
    return (
      <div className="todo-tasks">
        {todoTasks.map((task, index) => {
          return (
            <SortableItem
              index={index}
              key={task.uuid + '@' + index}
              task={task}
              taskLists={taskLists}
              currentTaskList={currentTaskList}
              onChange={onChange}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
            />
          );
        })}
      </div>
    );
  }
);

export const TodoTasks = ({ onSortEnd, ...props }: Props) => {
  return (
    <SortableList
      {...props}
      lockAxis="y"
      distance={10}
      helperClass="dragging"
      onSortEnd={onSortEnd}
    />
  );
};
