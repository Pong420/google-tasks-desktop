import React, { Fragment } from 'react';
import { TodoTask } from '../../Task';
import { TaskInput } from '../../Task/TaskInput';
import { TodoTasksSortByDate } from '../../../store';
import { Schema$Task } from '../../../typings';

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
  let index = 0;

  return (
    <div className="todo-tasks-list-sort-by-date">
      {todoTasksSortByDate.map(([key, tasks]) => {
        return (
          <Fragment key={key}>
            <div className="section-label" data-label={key} />
            <div className="todo-tasks">
              {tasks.map(task => {
                index += 1;
                return (
                  <TodoTask
                    key={task.uuid}
                    index={index}
                    task={task}
                    focused={index === focusIndex}
                    inputBaseProps={{ inputComponent: TaskInput }}
                    {...props}
                  />
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
