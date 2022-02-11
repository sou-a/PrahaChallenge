import * as faker from 'faker'
import { TaskGroup } from 'src/domain/task-group/task-group'
import { TaskId } from 'src/domain/task/task-id'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { prisma } from '@testUtil/prisma'

export const seedTaskGroup = async (params: { id?: string; name?: string }) => {
  let { name } = params
  const id = params.id ?? faker.random.uuid()
  name = name ?? 'A'
  const taskGroup = await prisma.taskGroup.create({
    data: {
      id,
      name,
    },
    include: {
      tasks: true,
    },
  })
  const tasks = taskGroup.tasks.map((task) => {
    return new TaskId(task.id)
  })
  return new TaskGroup({ id: new TaskGroupId(id), name, tasks })
}
