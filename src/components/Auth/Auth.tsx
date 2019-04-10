import React, { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { tasks_v1 } from 'googleapis';
import { RootState, AuthActionCreators, AuthsState } from '../../store';
import { taskApi } from '../../api';

const mapStateToProps = ({ auth }: RootState) => ({ ...auth });
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(AuthActionCreators, dispatch);

export function AuthComponent({
  autoLogin,
  waiting,
  loggedIn,
  authenticate,
  getToken
}: AuthsState & typeof AuthActionCreators) {
  const [taskLists, setTaskLists] = useState<tasks_v1.Schema$TaskList[]>([]);
  const [tasks, setTasks] = useState<tasks_v1.Schema$Task[]>([]);
  const [code, setCode] = useState('');
  const submit = useCallback(
    (evt?: SyntheticEvent<HTMLElement>) => {
      evt && evt.preventDefault();
      getToken(code);
    },
    [code, getToken]
  );

  const logTaskLists = useCallback(() => {
    taskApi.tasklists.list().then(({ data }) => {
      // console.log(data);
      setTaskLists(data.items!);
    });
  }, []);

  const logTasks = useCallback(({ id }: tasks_v1.Schema$TaskList) => {
    taskApi.tasks
      .list({
        tasklist: id
      })
      .then(({ data }) => {
        // console.log(data);
        setTasks(data.items!);
      });
  }, []);

  useEffect(() => {
    autoLogin && authenticate();
  }, [authenticate, autoLogin]);

  return null;

  // return (
  //   <div className="auth">
  //     {loggedIn ? (
  //       <>
  //         <div>Authorized</div>
  //         <button onClick={logTaskLists}>get task lists</button>
  //         <div>
  //           {taskLists!.map(v => (
  //             <button key={v.id} onClick={() => logTasks(v)}>
  //               {v.title}
  //             </button>
  //           ))}
  //         </div>
  //         <div>
  //           {tasks.map((data, index) => (
  //             <div key={data.id}>{data.title}</div>
  //           ))}
  //         </div>
  //       </>
  //     ) : waiting ? null : (
  //       <div>
  //         <form onSubmit={submit}>
  //           <input
  //             type="text"
  //             placeholder="Paste the code here, then click get token"
  //             value={code}
  //             onChange={evt => setCode(evt.target.value)}
  //           />
  //           <button onClick={authenticate}>get code</button>
  //           <button onClick={submit}>get token</button>
  //         </form>
  //       </div>
  //     )}
  //   </div>
  // );
}

export const Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
