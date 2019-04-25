import React, { Fragment, useMemo } from 'react';
import { TodoTask } from '../../Task';
import { TaskInput } from '../../Task/TaskInput';
import { TodoTasksSortByDate } from '../../../store';
import { Schema$Task } from '../../../typings';
import flatten from 'lodash/flatten';

interface Props {
  todoTasksSortByDate: TodoTasksSortByDate;
  toggleCompleted(task: Schema$Task): void;
  focusIndex: number | null;
  setFocusIndex(indxe: number | null): void;
}

export function TodoTasksListSortByDate({
  todoTasksSortByDate,
  focusIndex,
  ...props
}: Props) {
  let index = -1;
  const todoTasks = useMemo(
    () =>
      flatten(
        todoTasksSortByDate.map(data => flatten<string | Schema$Task>(data))
      ),
    [todoTasksSortByDate]
  );

  return (
    <div className="todo-tasks-list-sort-by-date">
      {todoTasks.map((data, i) => {
        if (typeof data === 'string') {
          return <div className="section-label" data-label={data} key={data} />;
        }

        index += 1;

        return (
          <TodoTask
            key={data.uuid}
            index={index}
            task={data}
            focused={index === focusIndex}
            inputBaseProps={{ inputComponent: TaskInput }}
            {...props}
          />
        );
      })}
    </div>
  );
}
