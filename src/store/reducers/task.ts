import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import { compare } from '../../utils/compare';
import { remove, insertAfter, move } from '../../utils/array';
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

const getDatekey = (task?: Schema$Task) => (task && task.due) || 'null';

export default function(state = initialState, action: TaskActions): TaskState {
  switch (action.type) {
    case TaskActionTypes.GET_ALL_TASKS:
      taskIds.reset();

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
      return (() => {
        const { uuid } = action.payload;

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
    case TaskActionTypes.UPDATE_TASK_SUCCESS:
      return (() => {
        const newTaskPayload = action.payload;
        const { uuid, status } = newTaskPayload;
        const oldTask = state.byIds[uuid];

        // ``oldTask`` can be undefined, if task deleted before NEW_TASK_SUCCESS
        if (!oldTask) {
          return state;
        }

        let todo = state.todo.slice();
        let completed = state.completed.slice();

        const newTask = { ...newTaskPayload, ...oldTask };
        const oldDateKey = getDatekey(oldTask);
        const byDatePayload = {
          [oldDateKey]: state.byDate[oldDateKey] || []
        };

        if (oldTask.status !== newTask.status) {
          if (status === 'completed') {
            completed = [...completed, uuid];
            completed.sort();
            byDatePayload[oldDateKey] = remove(byDatePayload[oldDateKey], uuid);
          } else if (status === 'needsAction') {
            todo = todo.includes(uuid) ? todo : [uuid, ...todo];
            byDatePayload[oldDateKey] = [uuid, ...state.byDate[oldDateKey]];
          }
        }

        if (oldTask.due !== newTask.due) {
          const newDateKey = getDatekey(newTask);
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
          todo: remove(state.todo, uuid),
          completed: remove(state.completed, uuid),
          ...(prevUUID && { focused: prevUUID })
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
        const { uuid, prevUUID, step } = action.payload;
        const { todo, byIds, byDate } = state;
        const byDatePayload: TaskState['byDate'] = {};
        let currentTask = byIds[uuid];

        // special handling for moving task when ordering by date
        if (step) {
          let updatedDate;
          const now = new Date();
          if (currentTask.due) {
            // move with existing date
            const date = new Date(currentTask.due);
            const dayDiff = date.dayDiff(now);

            updatedDate =
              dayDiff > 0 // if date is past
                ? now // set new date to totody
                : date.addDays(step); // else set depends on step
          } else if (step === -1) {
            // move up from no date
            // move to prev task's date group
            const prevTask_ = byIds[prevUUID];
            if (prevTask_ && prevTask_.due) {
              updatedDate = new Date(prevTask_.due);
            }
          }

          if (updatedDate) {
            // make sure the date is not in the past
            if (updatedDate.dayDiff(now) > 0) {
              updatedDate = now;
            }

            currentTask = {
              ...currentTask,
              due: updatedDate.toISODateString()
            };

            const oldDateKey = getDatekey(byIds[uuid]);
            const newDateKey = getDatekey(currentTask);

            byDatePayload[oldDateKey] = remove(byDate[oldDateKey] || [], uuid);
            byDatePayload[newDateKey] = [uuid, ...(byDate[newDateKey] || [])];
          }
        }

        return {
          ...state,
          todo: move(todo, todo.indexOf(uuid), todo.indexOf(prevUUID)),
          byDate: {
            ...byDate,
            ...byDatePayload
          },
          byIds: {
            ...byIds,
            [uuid]: currentTask
          },
          focused: uuid
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
