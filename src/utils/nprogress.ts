import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  parent: '#root',
  easing: 'ease',
  showSpinner: false,
  trickleSpeed: 50
});

export { NProgress };

export const NProgressDone = () => NProgress.done();

export default NProgress;
