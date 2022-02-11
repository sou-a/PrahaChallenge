import * as faker from 'faker'
import { TaskGroup } from 'src/domain/task-group/task-group'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { TaskId } from 'src/domain/task/task-id'

export const createTaskGroup = (params: {
  id?: string
  name?: string
  tasks?: string[]
}) => {
  let { name } = params
  const id = params.id ?? faker.random.uuid()
  name = name ?? 'A'
  const tasks = params.tasks ?? [
    faker.random.uuid(),
    faker.random.uuid(),
    faker.random.uuid(),
  ]
  return new TaskGroup({
    id: new TaskGroupId(id),
    name,
    tasks: tasks.map((task) => {
      return new TaskId(task)
    }),
  })
}
