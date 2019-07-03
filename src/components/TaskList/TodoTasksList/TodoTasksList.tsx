import React, { useState, useCallback, useMemo, CSSProperties } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortEnd,
  SortOver
} from 'react-sortable-hoc';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { TodoTask, TodoTaskProps } from '../../Task';
import { useBoolean } from '../../../utils';
import { Schema$Task } from '../../../typings';
import { RootState, moveTask } from '../../../store';

interface SortableListProps {
  dragging?: boolean;
  insertAfter: number | null;
  todoTasks: Schema$Task[];
}

const SortableItem = SortableElement((props: TodoTaskProps) => (
  <TodoTask {...props} />
));

const SortableList = SortableContainer(
  ({ dragging, todoTasks, insertAfter, ...props }: SortableListProps) => {
    const style = useMemo<CSSProperties>(
      () => ({ pointerEvents: dragging ? 'none' : 'auto' }),
      [dragging]
    );

    return (
      <div className="todo-tasks-list" style={style}>
        {todoTasks.map((task, index) => (
          <SortableItem
            {...props}
            task={task}
            index={index}
            key={task.uuid + '@' + index}
            className={
              dragging && insertAfter === index ? 'highlight-bottom-border' : ''
            }
          />
        ))}
      </div>
    );
  }
);

const mapStateToProps = ({ task: { todoTasks } }: RootState) => ({
  todoTasks
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ onSortEnd: moveTask }, dispatch);

const TodoTasksListComponent = ({
  onSortEnd,
  ...props
}: ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>) => {
  const [dragging, { on, off }] = useBoolean();
  const [insertAfter, setInsertAfter] = useState<number | null>(null);
  const onSortOverCallback = useCallback(
    ({ newIndex, oldIndex, index }: SortOver) => {
      let insertAfter: number | null = null;
      const move = newIndex - oldIndex > 0 ? 'down' : 'up';

      if (move === 'down') {
        insertAfter = newIndex > index ? oldIndex + 1 : oldIndex;
      } else if (move === 'up') {
        insertAfter = newIndex > index ? newIndex : newIndex - 1;
      }

      setInsertAfter(insertAfter);
    },
    []
  );

  const onSortEndCallack = useCallback(
    (params: Pick<SortEnd, 'newIndex' | 'oldIndex'>) => {
      if (params.newIndex !== params.oldIndex) {
        onSortEnd(params);
      }
      off();
    },
    [off, onSortEnd]
  );

  return (
    <SortableList
      dragging={dragging}
      insertAfter={insertAfter}
      lockAxis="y"
      helperClass="dragging"
      pressDelay={150}
      onSortMove={on}
      onSortOver={onSortOverCallback}
      onSortEnd={onSortEndCallack}
      {...props}
    />
  );
};

export const TodoTasksList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoTasksListComponent);
