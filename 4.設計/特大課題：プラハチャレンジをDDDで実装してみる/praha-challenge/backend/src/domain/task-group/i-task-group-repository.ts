import { TaskGroup } from './task-group'
import { TaskGroupId } from './task-group-id'

export interface ITaskGroupRepository {
  findAll(): Promise<TaskGroup[]>
  findById(taskGroupId: TaskGroupId): Promise<TaskGroup>
  save(taskGroup: TaskGroup): Promise<TaskGroup>
  delete(taskGroupId: TaskGroupId): Promise<void>
}
