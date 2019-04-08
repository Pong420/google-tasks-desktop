import React, { useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { RootState, TasksState, TaskActionCreators } from '../../store';
import { NewTask } from '../NewTask';
import { Task } from '../Task';
import { Auth } from '../Auth';
import uuid from 'uuid';

const mapStateToProps = ({ task }: RootState, ownProps: any) => ({
  ...task,
  ...ownProps
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

function HomeComponent({
  taskLists,
  addTask,
  updateTask,
  deleteTask,
  toggleComplete
}: TasksState & typeof TaskActionCreators) {
  const [taskListName, taskList] = useMemo(() => taskLists[0], [taskLists]);
  const onSubmit = useCallback(
    title => {
      addTask({
        id: uuid.v4(),
        taskListName,
        title
      });
    },
    [addTask, taskListName]
  );

  return (
    <div className="home">
      <div className="task-list">
        <div className="task-list-name">{taskListName}</div>
        <div className="task-list-content">
          <NewTask onSubmit={onSubmit} />
          {taskList.tasks.map((task, i) => {
            return (
              <Task
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            );
          })}
        </div>
      </div>
      <Auth />
    </div>
  );
}

export const Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeComponent);
