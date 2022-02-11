import { ITaskRepository } from '../task/i-task-repository'
import { IUserBelongTaskRepository } from '../user-belong-task/i-user-belong-task-repository'
import { ITaskGroupRepository } from './i-task-group-repository'
import { TaskGroup } from './task-group'

export class TaskGroupService {
  private taskGroupRepository: ITaskGroupRepository
  private taskRepository: ITaskRepository
  private userBelongTaskRepository: IUserBelongTaskRepository

  public constructor(props: {
    taskGroupRepository: ITaskGroupRepository
    taskRepository: ITaskRepository
    userBelongTaskRepository: IUserBelongTaskRepository
  }) {
    const {
      taskGroupRepository,
      taskRepository,
      userBelongTaskRepository,
    } = props

    this.taskGroupRepository = taskGroupRepository
    this.taskRepository = taskRepository
    this.userBelongTaskRepository = userBelongTaskRepository
  }

  //  - 課題グループを削除した場合、そのグループに属する課題も自動的に削除される
  public async delete(taskGroup: TaskGroup) {
    await Promise.all(
      // ユーザーが所持するタスク削除
      taskGroup.getAllProperties().tasks.map(async (taskId) => {
        await this.userBelongTaskRepository.deleteByTaskId(taskId)
      }),
    )

    // タスク削除
    await this.taskRepository.deleteByTaskGroupId(
      taskGroup.getAllProperties().id,
    )

    // タスクグループ削除
    await this.taskGroupRepository.delete(taskGroup.getAllProperties().id)
  }
}
