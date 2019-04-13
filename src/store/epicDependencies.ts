import { of } from 'rxjs';
import { push, RouterAction } from 'connected-react-router';
import { generatePath } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  parent: '#root',
  showSpinner: false,
  trickleSpeed: 75,
  easing: 'ease'
});

const epicDependencies = {
  push: (...args: Parameters<typeof generatePath>) =>
    of<RouterAction>(push(generatePath(...args))),
  nprogress: NProgress
};

export type EpicDependencies = typeof epicDependencies;

export default epicDependencies;
