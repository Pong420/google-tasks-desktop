import { useSelector } from 'react-redux';
import { currentTaskListsSelector } from '../store';

export function useCurrenTaskList() {
  return useSelector(currentTaskListsSelector);
}
