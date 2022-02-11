import * as faker from 'faker'
import { UserBelongTask } from 'src/domain/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/user-belong-task/task-status'
import { UserId } from 'src/domain/user/user-id'
import { TaskId } from 'src/domain/task/task-id'
import { prisma } from '@testUtil/prisma'

export const seedUserBelongTask = async (params: {
  userId?: string
  taskId?: string
  status?: TaskStatus
}) => {
  let { taskId, status } = params
  const userId = params.userId ?? faker.random.uuid()
  taskId = taskId ?? faker.random.uuid()
  status = status ?? new TaskStatus(TaskStatus.notYet)
  const taskUserStatus = await prisma.taskUserStatus.findFirst({
    where: {
      name: status.getStatus(),
    },
  })
  if (!taskUserStatus) {
    throw new Error('想定外のエラー')
  }
  await prisma.taskUser.create({
    data: {
      userId,
      taskId,
      taskUserStatusId: taskUserStatus.id,
    },
  })
  return new UserBelongTask({
    userId: new UserId(userId),
    taskId: new TaskId(taskId),
    status,
  })
}
