import React, { useMemo } from 'react';
import { TodoTask } from '../../Task';
import { Schema$Task } from '../../../typings';
import { compare } from '../../../utils/compare';

interface Props {
  todoTasks: Schema$Task[];
  toggleCompleted(task: Schema$Task): void;
  focusIndex: number | null;
  setFocusIndex(indxe: number | null): void;
}

export function TodoTasksListSortByDate({
  todoTasks,
  focusIndex,
  ...props
}: Props) {
  let index = -1;

  const sortedTodoTasks = useMemo(() => {
    const dateLabelHandler = getDateLabelHandler();
    let prevLabel = '';
    return todoTasks
      .sort((a, b) => compare(a.due, b.due) || compare(a.position, b.position))
      .reduce<Array<string | Schema$Task>>((acc, task) => {
        const label = dateLabelHandler(task.due);
        if (prevLabel !== label) {
          prevLabel = label;
          acc.push(label);
        }

        acc.push(task);
        return acc;
      }, []);
  }, [todoTasks]);

  const inputBaseProps = useMemo(
    () => ({ inputProps: { hideDateBtn: true } }),
    []
  );

  return (
    <div className="todo-tasks-list-sort-by-date">
      {sortedTodoTasks.map((data, i) => {
        if (typeof data === 'string') {
          return <div className="date-label" data-label={data} key={data} />;
        }

        index += 1;

        return (
          <TodoTask
            key={data.uuid}
            index={index}
            task={data}
            focused={index === focusIndex}
            inputBaseProps={inputBaseProps}
            {...props}
          />
        );
      })}
    </div>
  );
}

function getDateLabelHandler() {
  const now = new Date();
  return (due?: string) => {
    let key = 'No date';

    if (due) {
      const date = new Date(due);
      const dayDiff = Math.floor((+now - +date) / 1000 / 60 / 60 / 24);

      if (dayDiff > 0) {
        key = 'Past';
      } else if (dayDiff === 0) {
        key = 'Today';
      } else if (dayDiff === -1) {
        key = 'Tomorrow';
      } else if (dayDiff < -1) {
        key = 'Due ' + date.format('D, j M');
      }
    }

    return key;
  };
}
