import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { TodoTask } from '../Task';
import { todoTasksIdsByDateSelector } from '../../../store';
import { Schema$Task } from '../../../typings';

const inherit: (keyof Schema$Task)[] = ['due'];

export function TodoTaskListByDate() {
  const data = useSelector(todoTasksIdsByDateSelector);
  let count = -1;
  return (
    <div className="todo-tasks-list-by-date">
      {data.map(([date, ids]) => (
        <Fragment key={date}>
          <div className="date-label" data-label={date} />
          {ids.map(uuid => {
            count += 1;
            return (
              <TodoTask
                key={uuid}
                uuid={uuid}
                index={count}
                inherit={date !== 'Past' ? inherit : undefined}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
