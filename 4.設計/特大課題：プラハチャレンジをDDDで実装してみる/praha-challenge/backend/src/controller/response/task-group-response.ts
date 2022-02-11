import { ApiProperty } from '@nestjs/swagger'
import { TaskGroupDTO } from 'src/app/dto/task-group-dto'

export class FindAllTaskGroupResponse {
  @ApiProperty({ type: () => [TaskGroup] })
  tasks: TaskGroup[]

  public constructor(params: { taskGroupDTOs: TaskGroupDTO[] }) {
    const { taskGroupDTOs } = params
    this.tasks = taskGroupDTOs.map(({ id, name, tasks }) => {
      return new TaskGroup({
        id: id.value,
        name,
        tasks: tasks.map((task) => {
          return task.value
        }),
      })
    })
  }
}

class TaskGroup {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  tasks: string[]

  public constructor(params: { id: string; name: string; tasks: string[] }) {
    this.id = params.id
    this.name = params.name
    this.tasks = params.tasks
  }
}

export class FindTasksByTasksResponse {
  @ApiProperty({ type: () => [TaskGroup] })
  user: TaskGroup[]

  public constructor(params: { taskGroupDTOs: TaskGroupDTO[] }) {
    const { taskGroupDTOs } = params
    this.user = taskGroupDTOs.map(({ id, name, tasks }) => {
      return new TaskGroup({
        id: id.value,
        name,
        tasks: tasks.map((task) => {
          return task.value
        }),
      })
    })
  }
}
