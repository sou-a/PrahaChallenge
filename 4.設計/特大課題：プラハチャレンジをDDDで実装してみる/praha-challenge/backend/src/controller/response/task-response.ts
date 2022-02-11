import { ApiProperty } from '@nestjs/swagger'
import { TaskDTO } from 'src/app/dto/task-dto'

export class FindAllTaskResponse {
  @ApiProperty({ type: () => [Task] })
  tasks: Task[]

  public constructor(params: { taskDTOs: TaskDTO[] }) {
    const { taskDTOs } = params
    this.tasks = taskDTOs.map(({ id, name, taskGroupId }) => {
      return new Task({
        id: id.value,
        name,
        taskGroupId: taskGroupId.value,
      })
    })
  }
}

class Task {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  taskGroupId: string

  public constructor(params: {
    id: string
    name: string
    taskGroupId: string
  }) {
    this.id = params.id
    this.name = params.name
    this.taskGroupId = params.taskGroupId
  }
}

export class FindTasksByTasksResponse {
  @ApiProperty({ type: () => [Task] })
  user: Task[]

  public constructor(params: { taskDTOs: TaskDTO[] }) {
    const { taskDTOs } = params
    this.user = taskDTOs.map(({ id, name, taskGroupId }) => {
      return new Task({
        id: id.value,
        name,
        taskGroupId: taskGroupId.value,
      })
    })
  }
}
