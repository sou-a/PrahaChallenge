import { PrismaClient } from '@prisma/client'
import { ITaskGroupRepository } from 'src/domain/task-group/i-task-group-repository'
import { TaskGroup } from 'src/domain/task-group/task-group'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { TaskId } from 'src/domain/task/task-id'

export class TaskGroupRepository implements ITaskGroupRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<TaskGroup[]> {
    const models = await this.prismaClient.taskGroup.findMany({
      include: {
        tasks: true,
      },
    })
    const entities: TaskGroup[] = models.map(
      (model): TaskGroup => {
        const taskIds: TaskId[] = model.tasks.map((task) => {
          return new TaskId(task.id)
        })
        return new TaskGroup({
          id: new TaskGroupId(model.id),
          name: model.name,
          tasks: taskIds,
        })
      },
    )
    return entities
  }

  public async findById(taskGroupId: TaskGroupId): Promise<TaskGroup> {
    const model = await this.prismaClient.taskGroup.findUnique({
      where: {
        id: taskGroupId.value,
      },
      include: {
        tasks: true,
      },
    })
    if (model === null) {
      throw new Error(`ID: ${taskGroupId}が見つかりませんでした`)
    }

    const taskIds: TaskId[] = model.tasks.map((task) => {
      return new TaskId(task.id)
    })

    const entity = new TaskGroup({
      id: new TaskGroupId(model.id),
      name: model.name,
      tasks: taskIds,
    })
    return entity
  }

  public async save(taskGroup: TaskGroup): Promise<TaskGroup> {
    const { id, name } = taskGroup.getAllProperties()

    const model = await this.prismaClient.taskGroup.upsert({
      where: {
        id: id.value,
      },
      update: {
        name,
      },
      create: {
        id: id.value,
        name,
      },
      include: {
        tasks: true,
      },
    })
    const taskIds: TaskId[] = model.tasks.map((task) => {
      return new TaskId(task.id)
    })
    const entity = new TaskGroup({
      id: new TaskGroupId(model.id),
      name: model.name,
      tasks: taskIds,
    })
    return entity
  }

  public async delete(id: TaskGroupId): Promise<void> {
    await this.prismaClient.taskGroup.delete({
      where: {
        id: id.value,
      },
    })
  }
}
