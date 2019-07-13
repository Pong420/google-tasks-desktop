import React, { useRef, Fragment, useCallback } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { ScrollContent } from '../ScrollContent/';
import { TodoTask } from '../Task/';
import { RootState, getTodoTasksByDate } from '../../store';

const mapStateToProps = (state: RootState) => ({
  todoTasksByDate: getTodoTasksByDate(state)
});

export function TodoTasksListSortByDateComponent({
  todoTasksByDate
}: ReturnType<typeof mapStateToProps> & DispatchProp) {
  const now = useRef(new Date());
  const prevLabel = useRef('');
  const getDateLabel = useCallback((due: string) => {
    let label = 'No date';

    if (due !== 'null') {
      const date = new Date(due);
      const dayDiff = date.dayDiff(now.current);

      if (dayDiff > 0) {
        label = 'Past';
      } else if (dayDiff === 0) {
        label = 'Today';
      } else if (dayDiff === -1) {
        label = 'Tomorrow';
      } else if (dayDiff < -1) {
        label = 'Due ' + date.format('D, j M');
      }
    }

    return label;
  }, []);

  prevLabel.current = '';

  return (
    <ScrollContent>
      <div className="todo-tasks-list-sort-by-date">
        {todoTasksByDate.map(([date, ids]) => {
          let label = !!ids.length ? getDateLabel(date) : '';
          if (prevLabel.current === label) {
            label = '';
          } else {
            prevLabel.current = label;
          }

          return (
            <Fragment key={date}>
              {label && <div className="date-label" data-label={label} />}
              {ids.map(uuid => (
                <TodoTask key={uuid} uuid={uuid} />
              ))}
            </Fragment>
          );
        })}
      </div>
    </ScrollContent>
  );
}

export const TodoTasksListSortByDate = connect(mapStateToProps)(
  TodoTasksListSortByDateComponent
);
