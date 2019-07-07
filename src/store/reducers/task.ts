import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import { compare } from '../../utils/compare';
import { remove, insertAfter } from '../../utils/array';
import { taskIds } from '../';

type UUID = Schema$Task['uuid'];

export interface TaskState {
  byIds: { [id: string]: Schema$Task };
  byDate: { [date: string]: UUID[] };
  todo: UUID[];
  completed: UUID[];
  focused: string | number | null;
}

const initialState: TaskState = {
  byIds: {},
  byDate: {},
  todo: [],
  completed: [],
  focused: null
};

const getDatekey = (task: Schema$Task) => task.due || 'null';

export default function(state = initialState, action: TaskActions): TaskState {
  switch (action.type) {
    case TaskActionTypes.GET_ALL_TASKS:
      return {
        ...initialState
      };

    case TaskActionTypes.GET_ALL_TASKS_SUCCESS:
      return (() => {
        const todo: UUID[] = [];
        const completed: UUID[] = [];
        const byDate: TaskState['byDate'] = {};

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
          .reduce<{ [id: string]: Schema$Task }>((acc, task) => {
            const uuid = task.uuid || taskIds.next();
            const dateKey = getDatekey(task);

            if (task.status === 'completed') {
              completed.push(uuid);
            } else {
              todo.push(uuid);
            }

            acc[uuid] = {
              ...task,
              uuid
            };

            byDate[dateKey] = [...(byDate[dateKey] || []), uuid];

            return acc;
          }, {});

        return {
          ...state,
          byIds,
          byDate,
          todo,
          completed
        };
      })();

    case TaskActionTypes.NEW_TASK:
      return (() => {
        const { previousTask, uuid, ...newTaskPlayload } = action.payload;
        const prevUUID = previousTask && previousTask.uuid;

        const newTask = {
          // position & updated is required when sorting by date
          position: previousTask && previousTask.position,
          updated: new Date().toISOString(),
          uuid,
          ...newTaskPlayload
        };

        const dateKey = getDatekey(newTask);

        return {
          ...state,
          todo: insertAfter(state.todo, uuid, prevUUID),
          byIds: { ...state.byIds, [uuid]: newTask },
          byDate: {
            ...state.byDate,
            [dateKey]: insertAfter(state.byDate[dateKey] || [], uuid, prevUUID)
          },
          focused: uuid
        };
      })();

    case TaskActionTypes.UPDATE_TASK:
    case TaskActionTypes.UPDATE_TASK_SUCCESS:
    case TaskActionTypes.NEW_TASK_SUCCESS:
      return (() => {
        const newTask = action.payload;
        const { uuid, status } = newTask;
        let { todo, completed } = state;

        const mergedTask = { ...state.byIds[uuid], ...newTask };
        const dateKey = getDatekey(mergedTask);
        let idsByDate = state.byDate[dateKey] || [];

        if (status === 'completed') {
          completed.push(uuid);
          completed.sort(compare);
          todo = remove(todo, uuid);
          idsByDate = remove(idsByDate, uuid);
        } else if (status === 'needActions') {
          completed = remove(completed, uuid);
          todo = [uuid, ...todo];
          idsByDate = [uuid, ...idsByDate];
        }

        return {
          ...state,
          todo,
          completed,
          byIds: {
            ...state.byIds,
            [uuid]: mergedTask
          },
          byDate: {
            ...state.byDate,
            [dateKey]: idsByDate
          }
        };
      })();

    case TaskActionTypes.DELETE_TASK:
      return (() => {
        const { uuid, prevTask } = action.payload;
        const { [uuid]: deleted, ...byIds } = state.byIds;
        const dateKey = getDatekey(deleted);

        return {
          ...state,
          byIds,
          byDate: {
            ...state.byDate,
            [dateKey]: remove(state.byDate[dateKey] || [], uuid)
          },
          todo: remove(state.todo, uuid),
          completed: remove(state.completed, uuid),
          ...(prevTask && { focused: prevTask })
        };
      })();

    case TaskActionTypes.DELETE_COMPLETED_TASKS:
      return (() => {
        const byIds = state.completed.reduce(
          (acc, id) => {
            delete acc[id];
            return acc;
          },
          { ...state.byIds }
        );
        return {
          ...state,
          byIds,
          completed: []
        };
      })();

    case TaskActionTypes.SET_FOCUSED:
      return {
        ...state,
        focused: action.payload
      };

    default:
      return state;
  }
}
