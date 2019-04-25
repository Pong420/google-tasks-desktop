import React, { useMemo } from 'react';
import { TodoTask } from '../../Task';
import { TaskInput } from '../../Task/TaskInput';
import { Schema$Task } from '../../../typings';

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
      .sort((a, b) => {
        if (a.due && b.due) {
          return new Date(a.due) > new Date(b.due) ? 1 : -1;
        }
        if (b.due) {
          return 1;
        }
        return 0;
      })
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

  return (
    <div className="todo-tasks-list-sort-by-date">
      {sortedTodoTasks.map((data, i) => {
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
