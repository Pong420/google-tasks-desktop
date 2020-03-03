import { ofType, Epic } from 'redux-observable';
import { empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TaskActions } from '../actions/task';
import { RootState } from '../reducers';
import NProgress from '../../utils/nprogress';

type Actions = TaskActions;
type TaskEpic = Epic<Actions, Actions, RootState>;

const nprogressEpic: TaskEpic = action$ =>
  action$.pipe(
    ofType('PAGINATE_TASK'),
    switchMap(() => {
      NProgress.done();
      return empty();
    })
  );

export default [nprogressEpic];
