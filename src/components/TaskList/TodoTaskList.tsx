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
      {todoTasks.map(uuid => (
        <TodoTask key={uuid} uuid={uuid} />
      ))}
    </div>
  );
}

export const TodoTaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoTaskListComponent);
