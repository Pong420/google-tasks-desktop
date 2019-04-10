import React, { useMemo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import {
  RootState,
  AuthsState,
  TaskListState,
  TaskListActionCreators
} from '../../store';
import { RouteComponentProps } from 'react-router-dom';
import uuid from 'uuid';

interface MatchParams {
  taskListId: string;
}

const mapStateToProps = ({ auth, taskList }: RootState, ownProps: any) => ({
  ...auth,
  ...taskList,
  ...ownProps
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskListActionCreators, dispatch);

function TaskListComponent({
  match: { params },
  loggedIn,
  taskLists,
  getAllTaskList,
  addTaskList,
  delteTaskList
}: AuthsState &
  TaskListState &
  RouteComponentProps<MatchParams> &
  typeof TaskListActionCreators) {
  const [name, setName] = useState('');
  const currentTaskList = useMemo(() => {
    let current = taskLists[0];
    if (params.taskListId) {
      current = taskLists.find(({ id }) => id === params.taskListId) || current;
    }

    return current || null;
  }, [params.taskListId, taskLists]);

  useEffect(() => {
    loggedIn && getAllTaskList();
  }, [getAllTaskList, loggedIn]);

  return (
    <div className="task-list">
      <div>
        <input
          type="text"
          value={name}
          onChange={evt => setName(evt.target.value)}
        />
        <button
          onClick={() =>
            addTaskList({
              localId: uuid.v4(),
              title: name
            })
          }
        >
          Add Task List
        </button>
      </div>
      {taskLists.map(({ title, id }) => (
        <div key={id}>
          <span>{title}</span>
          <button onClick={() => delteTaskList(id!)} disabled={!id}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export const TaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskListComponent);
