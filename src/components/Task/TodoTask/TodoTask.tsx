import React, { useMemo, useRef, useLayoutEffect, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { Task } from '../Task';
import { classes } from '../../../utils/classes';
// import { useBoolean } from '../../../utils/useBoolean';
import { RootState, TaskActionCreators } from '../../../store';
import { Schema$Task } from '../../../typings';
import { Dispatch, bindActionCreators } from 'redux';

interface Props extends Pick<Schema$Task, 'uuid'> {}

const mapStateToProps = (state: RootState, ownProps: Props) => {
  return {
    task: state.task.byIds[ownProps.uuid],
    focused: state.task.focused === ownProps.uuid
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

const disableMouseDown = (evt: MouseEvent<HTMLElement>) => evt.preventDefault();

export function TodoTaskComponent({
  task,
  focused,
  setFocused
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [onFocus, onBlur] = useMemo(
    () => [
      () => !focused && setFocused(task.uuid),
      () => focused && setFocused(null)
    ],
    [focused, setFocused, task.uuid]
  );

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input && focused) {
      if (document.activeElement !== input) {
        input.focus();
        // place cursor at end of textarea
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }, [focused]);

  return (
    <Task
      className={classes(`todo-task`, focused && 'focused')}
      uuid={task.uuid}
      title={task.title}
      inputRef={inputRef}
      onClick={onFocus}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={disableMouseDown}
    />
  );
}

export const TodoTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoTaskComponent);
