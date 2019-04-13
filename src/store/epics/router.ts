import { empty, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import {
  RouterAction,
  LOCATION_CHANGE,
  createMatchSelector
} from 'connected-react-router';
import {
  TaskListActions,
  TaskListActionTypes,
  SetCurrentTaskList
} from '../actions/taskList';
import { RootState } from '../reducers';
// import { EpicDependencies } from '../epicDependencies';
import { PATHS } from '../../constants';

type CominbinedActions = TaskListActions | RouterAction;

interface MatchParams {
  taskListId?: string;
}

const match = createMatchSelector(PATHS.TASKLIST);

const routerEpic: Epic<CominbinedActions, CominbinedActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<CominbinedActions, CominbinedActions>(
      LOCATION_CHANGE,
      TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS
    ),
    switchMap(() => {
      const { taskListId }: MatchParams = match(state$.value)!.params;
      const { taskLists } = state$.value.taskList;

      if (taskLists.length) {
        let currentTaskList = taskLists[0];
        if (taskListId) {
          currentTaskList =
            taskLists.find(({ id }) => id === taskListId) || currentTaskList;
        }

        return of<SetCurrentTaskList>({
          type: TaskListActionTypes.SET_CURRENT_TASK_LIST,
          payload: currentTaskList
        });
      }

      return empty();
    })
  );

export default [routerEpic];
