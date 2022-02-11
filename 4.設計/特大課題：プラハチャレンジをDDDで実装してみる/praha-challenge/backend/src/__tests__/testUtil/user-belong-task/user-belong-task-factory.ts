import * as faker from 'faker'
import { UserBelongTask } from 'src/domain/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/user-belong-task/task-status'
import { UserId } from 'src/domain/user/user-id'
import { TaskId } from 'src/domain/task/task-id'

export const createUserBelongTask = (params: {
  userId?: string
  taskId?: string
  status?: TaskStatus
}) => {
  const { status } = params
  const userId = params.userId ?? faker.random.uuid()
  const taskId = params.taskId ?? faker.random.uuid()
  return new UserBelongTask({
    userId: new UserId(userId),
    taskId: new TaskId(taskId),
    status: status ?? new TaskStatus(TaskStatus.notYet),
  })
}
