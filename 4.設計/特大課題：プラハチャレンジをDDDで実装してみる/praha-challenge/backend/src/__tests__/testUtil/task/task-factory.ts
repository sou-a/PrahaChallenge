import * as faker from 'faker'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { Task } from 'src/domain/task/task'
import { TaskId } from 'src/domain/task/task-id'

export const createTask = (params: {
  id?: string
  name?: string
  taskGroupId?: string
}) => {
  const { name } = params
  const id = params.id ?? faker.random.uuid()
  const taskGroupId = params.taskGroupId ?? faker.random.uuid()
  return new Task({
    id: new TaskId(id),
    name: name ?? 'A',
    taskGroupId: new TaskGroupId(taskGroupId),
  })
}
