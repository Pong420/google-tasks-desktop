import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import { compare } from '../../utils/compare';
import { remove, insertAfter, move } from '../../utils/array';
import { taskIds } from '../';

type UUID = Schema$Task['uuid'];

export interface TaskState {
  byIds: { [uuid: string]: Schema$Task };
  byDate: { [date: string]: UUID[] };
  completed: UUID[];
  focused: string | number | null;
  todo: UUID[];
  temp: { [uuid: string]: Schema$Task }; // temp storage, for epic
}

const initialState: TaskState = {
  byIds: {},
  byDate: {},
  completed: [],
  focused: null,
  todo: [],
  temp: {}
};

const getDatekey = (task?: Schema$Task) => (task && task.due) || 'null';

export default function(state = initialState, action: TaskActions): TaskState {
  switch (action.type) {
    case TaskActionTypes.GET_ALL_TASKS:
      taskIds.reset();

      return {
        ...initialState
      };

    case TaskActionTypes.GET_ALL_TASKS_SUCCESS:
    case TaskActionTypes.GET_ALL_TASKS_SILENT_SUCCESS:
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
          .reduce<{ [uuid: string]: Schema$Task }>((acc, task) => {
            const uuid = task.uuid || taskIds.next();
            const dateKey = getDatekey(task);

            if (task.status === 'completed') {
              completed.push(uuid);
            } else {
              todo.push(uuid);
              byDate[dateKey] = [...(byDate[dateKey] || []), uuid];
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
          byDate,
          todo,
          completed
        };
      })();

    case TaskActionTypes.NEW_TASK:
      return (() => {
        const { prevUUID, ...newTask } = action.payload;
        const { uuid } = newTask;
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

    case TaskActionTypes.NEW_TASK_SUCCESS:
    case TaskActionTypes.UPDATE_TASK_SUCCESS:
      return (() => {
        const { uuid } = action.payload;

        // It can be undefined, if task deleted before NEW_TASK_SUCCESS
        if (!state.byIds[uuid]) {
          return state;
        }

        return {
          ...state,
          byIds: {
            ...state.byIds,
            [uuid]: {
              ...action.payload,
              ...state.byIds[uuid],
              id: action.payload.id
            }
          }
        };
      })();

    case TaskActionTypes.UPDATE_TASK:
      return (() => {
        const { uuid, status, due } = action.payload;
        const oldTask = state.byIds[uuid];

        let todo = state.todo.slice();
        let completed = state.completed.slice();

        const newTask = { ...oldTask, ...action.payload };
        const oldDateKey = getDatekey(oldTask);
        const byDatePayload = {
          [oldDateKey]: state.byDate[oldDateKey] || []
        };

        if (
          action.payload.hasOwnProperty('status') &&
          status !== oldTask.status
        ) {
          if (status === 'completed') {
            completed = [...completed, uuid];
            todo = remove(todo, uuid);
            byDatePayload[oldDateKey] = remove(byDatePayload[oldDateKey], uuid);
          } else if (status === 'needsAction') {
            completed = remove(completed, uuid);
            todo = todo.includes(uuid) ? todo : [uuid, ...todo];
            byDatePayload[oldDateKey] = [
              uuid,
              ...(state.byDate[oldDateKey] || [])
            ];
          }
        } else if (
          action.payload.hasOwnProperty('due') &&
          oldTask.due !== due
        ) {
          const newDateKey = getDatekey(action.payload);
          byDatePayload[oldDateKey] = remove(byDatePayload[oldDateKey], uuid);
          byDatePayload[newDateKey] = [
            uuid,
            ...(state.byDate[newDateKey] || [])
          ];
        }

        return {
          ...state,
          todo,
          completed,
          byIds: {
            ...state.byIds,
            [uuid]: newTask
          },
          byDate: {
            ...state.byDate,
            ...byDatePayload
          }
        };
      })();

    case TaskActionTypes.DELETE_TASK:
      return (() => {
        const { uuid, prevUUID } = action.payload;
        const { [uuid]: deleted, ...byIds } = state.byIds;
        const dateKey = getDatekey(deleted);

        return {
          ...state,
          byIds,
          byDate: {
            ...state.byDate,
            [dateKey]: remove(state.byDate[dateKey] || [], uuid)
          },
          completed: remove(state.completed, uuid),
          todo: remove(state.todo, uuid),
          temp: {
            ...state.temp,
            [uuid]: deleted
          },
          ...(prevUUID && { focused: prevUUID })
        };
      })();

    case TaskActionTypes.DELETE_TASK_SUCCESS:
      return (() => {
        const { [action.payload]: deleted, ...temp } = state.temp;
        return {
          ...state,
          temp
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

    case TaskActionTypes.MOVE_TASKS:
      return (() => {
        return {
          ...state,
          todo: move(
            state.todo,
            state.todo.indexOf(action.payload.uuid),
            state.todo.indexOf(action.payload.prevUUID)
          )
        };
      })();

    case TaskActionTypes.MOVE_TO_ANOHTER_LIST:
      return (() => {
        const { uuid } = action.payload;
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
          temp: {
            ...state.temp,
            [uuid]: deleted
          },
          focused: null
        };
      })();

    case TaskActionTypes.MOVE_TO_ANOHTER_LIST_SUCCESS:
      return (() => {
        const newTask = action.payload;

        if (!newTask) {
          return state;
        }

        const { uuid } = newTask;
        const { [uuid]: deleted, ...temp } = state.temp;
        const dateKey = getDatekey(newTask);

        return {
          ...state,
          byIds: { ...state.byIds, [uuid]: newTask },
          byDate: {
            ...state.byDate,
            [dateKey]: [uuid, ...(state.byDate[dateKey] || [])]
          },
          todo: [uuid, ...state.todo],
          temp
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
