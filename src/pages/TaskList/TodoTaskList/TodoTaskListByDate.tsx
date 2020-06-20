import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { TodoTask } from '../Task';
import {
  todoTasksIdsByDateSelector,
  todoTaskIdsSelector
} from '../../../store';
import { Schema$Task } from '../../../typings';

const inherit: (keyof Schema$Task)[] = ['due'];

export function TodoTaskListByDate() {
  const { order, tasks } = useSelector(todoTasksIdsByDateSelector);
  const todo = useSelector(todoTaskIdsSelector);
  let prevDue: string | null | undefined;

  return (
    <div className="todo-tasks-list-by-date">
      {tasks.map(([date, ids]) => (
        <Fragment key={date}>
          <div className="date-label" data-label={date} />
          {ids.map(({ uuid, due }) => {
            const _prevDue = prevDue;
            const idx = order.indexOf(uuid);
            const [prev, index, next] = [
              order[idx - 1],
              uuid,
              order[idx + 1]
            ].map(uuid => todo.indexOf(uuid));
            prevDue = due;

            return (
              <TodoTask
                key={uuid}
                uuid={uuid}
                index={index}
                prevIndex={prev}
                nextIndex={next === -1 ? index : next}
                inherit={date !== 'Past' ? inherit : undefined}
                prevDue={_prevDue}
                sortByDate
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
