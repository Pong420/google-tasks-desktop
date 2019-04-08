export type TaskListName = string;

export interface Task {
  id: string;
  taskListName: TaskListName;
  title: string;
  description?: string;
  dateTime?: number;
  subTask?: string[];
  completed?: boolean;
}

export interface TaskList {
  name: TaskListName;
  tasks: Task[];
  sortBy?: 'order' | 'date';
}

export type TaskLists = Array<[TaskListName, TaskList]>;
