import { TaskId } from '../task/task-id'
import { UserId } from '../user/user-id'
import { UserBelongTask } from './user-belong-task'

export interface IUserBelongTaskRepository {
  findAll(): Promise<UserBelongTask[]>
  findByUserIdAndTaskId(userId: UserId, TaskId: TaskId): Promise<UserBelongTask>
  findByUserId(userId: UserId): Promise<UserBelongTask[]>
  save(userBelongTask: UserBelongTask): Promise<UserBelongTask>
  deleteByTaskId(taskId: TaskId): Promise<void>
  deleteByUserId(userId: UserId): Promise<void>
}
