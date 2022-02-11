import { TaskId } from 'src/domain/task/task-id'
import { UserDTO } from '../dto/user-dto'

export interface IUserQS {
  findUsersByTasks(props: {
    taskIds: TaskId[]
    taskStatus: string
    page: number
  }): Promise<UserDTO[]>
}
