import { TaskId } from '../task/task-id'
import { TaskGroupId } from './task-group-id'

export class TaskGroup {
  private id: TaskGroupId
  private name: string
  private tasks: TaskId[]

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

  public changeName(name: string): TaskGroup {
    this.name = name
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      tasks: this.tasks,
    }
  }
}
