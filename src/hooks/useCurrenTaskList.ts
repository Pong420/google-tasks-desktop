import { useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { currentTaskListsSelector } from '../store';

export function useCurrenTaskList() {
  const match = useRouteMatch<{ taskListId?: string }>();
  return useSelector(currentTaskListsSelector(match.params.taskListId));
}
