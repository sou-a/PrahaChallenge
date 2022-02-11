import { PrismaClient } from '@prisma/client'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { ITaskRepository } from 'src/domain/task/i-task-repository'
import { Task } from 'src/domain/task/task'
import { TaskId } from 'src/domain/task/task-id'

export class TaskRepository implements ITaskRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<Task[]> {
    const models = await this.prismaClient.task.findMany()
    const entities: Task[] = models.map(
      (model): Task => {
        return new Task({
          id: new TaskId(model.id),
          name: model.name,
          taskGroupId: new TaskGroupId(model.taskGroupId),
        })
      },
    )
    return entities
  }

  public async findById(taskId: TaskId): Promise<Task> {
    const model = await this.prismaClient.task.findUnique({
      where: {
        id: taskId.value,
      },
      include: {
        users: true,
      },
    })
    if (model === null) {
      throw new Error(`${taskId}が見つかりませんでした`)
    }

    const entity = new Task({
      id: new TaskId(model.id),
      name: model.name,
      taskGroupId: new TaskGroupId(model.taskGroupId),
    })
    return entity
  }

  public async save(task: Task): Promise<Task> {
    const { id, name, taskGroupId } = task.getAllProperties()

    const model = await this.prismaClient.task.upsert({
      where: {
        id: id.value,
      },
      update: {
        taskGroupId: taskGroupId.value,
        name,
      },
      create: {
        id: id.value,
        name,
        taskGroupId: taskGroupId.value,
      },
    })
    const entity = new Task({
      id: new TaskId(model.id),
      name: model.name,
      taskGroupId: new TaskGroupId(model.taskGroupId),
    })
    return entity
  }

  public async delete(taskId: TaskId): Promise<void> {
    await this.prismaClient.task.delete({
      where: {
        id: taskId.value,
      },
    })
  }

  public async deleteByTaskGroupId(taskGroupId: TaskGroupId): Promise<void> {
    await this.prismaClient.task.deleteMany({
      where: {
        taskGroupId: taskGroupId.value,
      },
    })
  }
}
