import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { TodoTask } from '../Task/';
import { RootState } from '../../store';

const mapStateToProps = (state: RootState) => ({
  todoTasks: state.task.todo
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({}, dispatch);

export function TodoTaskListComponent({
  todoTasks
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  return (
    <div className="todo-task-list">
      {todoTasks.map((uuid, index) => (
        // In order to rerender when task move up, uuid and index as key is required.
        <TodoTask key={uuid + index} uuid={uuid} />
      ))}
    </div>
  );
}

export const TodoTaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoTaskListComponent);
