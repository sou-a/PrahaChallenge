import { ITaskRepository } from 'src/domain/task/i-task-repository'
import { Task } from 'src/domain/task/task'
import { IUserBelongTaskRepository } from 'src/domain/user-belong-task/i-user-belong-task-repository'
import { UserBelongTask } from 'src/domain/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/user-belong-task/task-status'
import { createRandomIdString } from 'src/util/random'
import { TaskDTO, UserBelongTaskDTO } from './dto/task-dto'
import { UserId } from 'src/domain/user/user-id'
import { TaskId } from 'src/domain/task/task-id'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'

// 課題の一覧取得、新規追加、更新（少なくとも進捗ステータスを変更、所属する課題グループを変更できること）、削除
export class TaskUseCase {
  private taskRepository: ITaskRepository
  private userBelongTaskRepository: IUserBelongTaskRepository

  public constructor(
    taskRepository: ITaskRepository,
    userBelongTaskRepository: IUserBelongTaskRepository,
  ) {
    this.taskRepository = taskRepository
    this.userBelongTaskRepository = userBelongTaskRepository
  }

  public async findAll(): Promise<TaskDTO[]> {
    try {
      const tasks: Task[] = await this.taskRepository.findAll()
      return tasks.map((task: Task) => {
        return new TaskDTO({ ...task.getAllProperties() })
      })
    } catch (error) {
      throw error
    }
  }

  public async create(props: {
    taskGroupId: TaskGroupId
    name: string
  }): Promise<TaskDTO> {
    const { taskGroupId, name } = props
    const task: Task = new Task({
      id: new TaskId(createRandomIdString()),
      taskGroupId,
      name,
    })
    try {
      const savedTask = await this.taskRepository.save(task)
      return new TaskDTO({ ...savedTask.getAllProperties() })
    } catch (error) {
      throw error
    }
  }

  public async changeStatus(props: {
    taskId: TaskId
    userId: UserId
    status: string
  }): Promise<UserBelongTaskDTO> {
    const { taskId, userId, status } = props

    const userBelongTask: UserBelongTask = await this.userBelongTaskRepository.findByUserIdAndTaskId(
      userId,
      taskId,
    )

    try {
      const changeduUerBelongTask = userBelongTask.changeStatus(
        userId,
        new TaskStatus(status),
      )
      const saveduUerBelongTask = await this.userBelongTaskRepository.save(
        changeduUerBelongTask,
      )
      return new UserBelongTaskDTO({
        taskId: saveduUerBelongTask.getAllProperties().taskId,
        userId: saveduUerBelongTask.getAllProperties().userId,
        status: saveduUerBelongTask.getAllProperties().status.getStatus(),
      })
    } catch (error) {
      throw error
    }
  }

  public async changeTaskGroup(props: {
    taskId: TaskId
    taskGroupId: TaskGroupId
  }): Promise<TaskDTO> {
    const { taskId, taskGroupId } = props

    const task: Task = await this.taskRepository.findById(taskId)

    try {
      const changedTask = task.changeTaskGroupId(taskGroupId)
      const savedTask = await this.taskRepository.save(changedTask)
      return new TaskDTO({
        ...savedTask.getAllProperties(),
      })
    } catch (error) {
      throw error
    }
  }

  public async delete(prop: { taskId: TaskId }): Promise<void> {
    const { taskId } = prop
    try {
      return this.taskRepository.delete(taskId)
    } catch (error) {
      throw error
    }
  }
}
