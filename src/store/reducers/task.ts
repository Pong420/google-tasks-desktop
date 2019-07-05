import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import { compare } from '../../utils/compare';
import { taskIds } from '../';

export interface TaskState {
  byIds: { [id: string]: Schema$Task };
  todo: number[];
  completed: number[];
}

const initialState: TaskState = {
  byIds: {},
  todo: [],
  completed: []
};

export default function(state = initialState, action: TaskActions): TaskState {
  switch (action.type) {
    case TaskActionTypes.GET_ALL_TASKS:
      return {
        ...initialState
      };

    case TaskActionTypes.GET_ALL_TASKS_SUCCESS:
      return (() => {
        const todo: number[] = [];
        const completed: number[] = [];

        const byIds = (action.payload as Schema$Task[])
          .sort((a, b) => {
            // check position is undefined for task created from `Add a tasl button`
            if (
              (a.position === undefined || b.position === undefined) &&
              a.position !== b.position
            ) {
              return -1;
            }

            return (
              compare(a.position, b.position) || compare(a.updated, b.updated)
            );
          })
          .reduce<{ [id: number]: Schema$Task }>((acc, task) => {
            const uuid = task.uuid || taskIds.next();

            if (task.status === 'completed') {
              completed.push(uuid);
            } else {
              todo.push(uuid);
            }

            acc[uuid] = {
              ...task,
              uuid
            };

            return acc;
          }, {});

        return {
          ...state,
          byIds,
          todo,
          completed
        };
      })();

    default:
      return state;
  }
}
