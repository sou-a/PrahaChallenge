import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { TaskId } from 'src/domain/task/task-id'

export class TaskGroupDTO {
  public readonly id: TaskGroupId
  public readonly name: string
  public readonly tasks: TaskId[]
  public constructor(props: {
    id: TaskGroupId
    name: string
    tasks: TaskId[]
  }) {
    const { id, name, tasks } = props
    this.id = id
    this.name = name
    this.tasks = tasks
  }
}
