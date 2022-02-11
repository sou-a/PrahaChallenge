import { PrismaClient } from '@prisma/client'
import { IUserBelongTaskRepository } from 'src/domain/user-belong-task/i-user-belong-task-repository'
import { UserBelongTask } from 'src/domain/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/user-belong-task/task-status'
import { UserId } from 'src/domain/user/user-id'
import { TaskId } from 'src/domain/task/task-id'

export class UserBelongTaskRepository implements IUserBelongTaskRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<UserBelongTask[]> {
    const models = await this.prismaClient.taskUser.findMany({
      include: {
        taskUserStatus: true,
      },
    })
    const entities: UserBelongTask[] = models.map(
      (model): UserBelongTask => {
        return new UserBelongTask({
          userId: new UserId(model.userId),
          taskId: new TaskId(model.taskId),
          status: new TaskStatus(model.taskUserStatus.name),
        })
      },
    )
    return entities
  }

  public async findByUserIdAndTaskId(
    userId: UserId,
    taskId: TaskId,
  ): Promise<UserBelongTask> {
    const model = await this.prismaClient.taskUser.findUnique({
      where: {
        taskId_userId: {
          userId: userId.value,
          taskId: taskId.value,
        },
      },
      include: {
        task: true,
        taskUserStatus: true,
      },
    })
    if (model === null) {
      throw new Error(`${userId}が見つかりませんでした`)
    }

    return new UserBelongTask({
      userId: new UserId(model.userId),
      taskId: new TaskId(model.taskId),
      status: new TaskStatus(model.taskUserStatus.name),
    })
  }

  public async findByUserId(userId: UserId): Promise<UserBelongTask[]> {
    const models = await this.prismaClient.taskUser.findMany({
      where: {
        userId: userId.value,
      },
      include: {
        task: true,
        taskUserStatus: true,
      },
    })
    if (models === null) {
      throw new Error(`${userId}が見つかりませんでした`)
    }

    const entities = models.map((model) => {
      return new UserBelongTask({
        userId: new UserId(model.userId),
        taskId: new TaskId(model.taskId),
        status: new TaskStatus(model.taskUserStatus.name),
      })
    })
    return entities
  }

  public async save(UserBelongtask: UserBelongTask): Promise<UserBelongTask> {
    const { userId, taskId, status } = UserBelongtask.getAllProperties()
    const taskUserStatusmodel = await this.prismaClient.taskUserStatus.findFirst(
      {
        where: {
          name: status.getStatus(),
        },
      },
    )
    if (!taskUserStatusmodel) {
      throw new Error(`${status.getStatus()}が見つかりませんでした`)
    }
    const model = await this.prismaClient.taskUser.upsert({
      where: {
        taskId_userId: {
          taskId: taskId.value,
          userId: userId.value,
        },
      },
      update: {
        userId: userId.value,
        taskId: taskId.value,
        taskUserStatusId: taskUserStatusmodel.id,
      },
      create: {
        userId: userId.value,
        taskId: taskId.value,
        taskUserStatusId: taskUserStatusmodel.id,
      },
      include: {
        taskUserStatus: true,
      },
    })
    const entity = new UserBelongTask({
      userId: new UserId(model.userId),
      taskId: new TaskId(model.taskId),
      status: new TaskStatus(model.taskUserStatus.name),
    })
    return entity
  }

  public async deleteByTaskId(taskId: TaskId): Promise<void> {
    await this.prismaClient.taskUser.deleteMany({
      where: {
        taskId: taskId.value,
      },
    })
  }

  public async deleteByUserId(userId: UserId): Promise<void> {
    await this.prismaClient.taskUser.deleteMany({
      where: {
        userId: userId.value,
      },
    })
  }
}
