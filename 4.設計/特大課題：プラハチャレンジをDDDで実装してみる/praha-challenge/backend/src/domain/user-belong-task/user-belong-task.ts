import { TaskStatus } from 'src/domain/user-belong-task/task-status'
import { TaskId } from '../task/task-id'
import { UserId } from '../user/user-id'

export class UserBelongTask {
  private userId: UserId
  private taskId: TaskId
  private status: TaskStatus

  public constructor(props: {
    userId: UserId
    taskId: TaskId
    status: TaskStatus
  }) {
    const { userId, taskId, status } = props

    this.userId = userId
    this.taskId = taskId
    this.status = status
  }

  public changeStatus(userId: UserId, status: TaskStatus): UserBelongTask {
    // - 進捗ステータスはいつでも変更可能
    // - ただし一度「完了」にした進捗ステータスを「レビュー待ち」「未着手」に戻すことはできない
    if (this.status.isComplete()) {
      throw new Error(`${TaskStatus.complete}ステータスは変更できません`)
    }

    // - 進捗ステータスを変更できるのは、課題の所有者だけ（Aさんの課題1の進捗ステータスを変えられるのはAさんだけ。Bさんが変更するのは不可能）
    if (!this.userId.equals(userId)) {
      throw new Error('課題の所有者ではないので変更できません')
    }

    this.status = status
    return this
  }

  public getAllProperties() {
    return {
      userId: this.userId,
      taskId: this.taskId,
      status: this.status,
    }
  }
}
