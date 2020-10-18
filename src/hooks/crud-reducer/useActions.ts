import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators } from './crudAction';
import { Dispatched, bindDispatch } from './bindDispatch';

export function useActions<A extends ActionCreators>(
  creators: A
): Dispatched<A> {
  const dispatch = useDispatch();
  const [actions] = useState(bindDispatch(creators, dispatch));
  return actions;
}
