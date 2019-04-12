import { of } from 'rxjs';
import { push, RouterAction } from 'connected-react-router';
import { generatePath } from 'react-router-dom';

const epicDependencies = {
  push: (...args: Parameters<typeof generatePath>) =>
    of<RouterAction>(push(generatePath(...args)))
};

export type EpicDependencies = typeof epicDependencies;

export default epicDependencies;
