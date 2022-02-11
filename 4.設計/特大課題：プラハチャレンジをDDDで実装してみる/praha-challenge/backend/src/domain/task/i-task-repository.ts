import { TaskGroupId } from '../task-group/task-group-id'
import { Task } from './task'
import { TaskId } from './task-id'

export interface ITaskRepository {
  findAll(): Promise<Task[]>
  findById(taskId: TaskId): Promise<Task>
  save(task: Task): Promise<Task>
  delete(taskId: TaskId): Promise<void>
  deleteByTaskGroupId(taskGroupId: TaskGroupId): Promise<void>
}
