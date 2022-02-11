import { TaskGroupId } from '../task-group/task-group-id'
import { TaskId } from './task-id'

export class Task {
  private id: TaskId
  private taskGroupId: TaskGroupId
  private name: string

  public constructor(props: {
    id: TaskId
    taskGroupId: TaskGroupId
    name: string
  }) {
    const { id, name, taskGroupId } = props

    this.id = id
    this.name = name
    // - 全ての課題は、いずれかの課題グループに属している
    this.taskGroupId = taskGroupId
  }

  public changeTaskGroupId(taskGroupId: TaskGroupId): Task {
    this.taskGroupId = taskGroupId
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      taskGroupId: this.taskGroupId,
    }
  }
}
