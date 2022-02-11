import { UserBelongTask } from 'src/domain/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/user-belong-task/task-status'
import { createRandomIdString } from 'src/util/random'
import { UserId } from 'src/domain/user/user-id'
import { TaskId } from 'src/domain/task/task-id'

describe('user-belong-task.ts', () => {
  describe('constructor', () => {
    it('[正常系]生成できる', () => {
      expect(
        new UserBelongTask({
          userId: new UserId(createRandomIdString()),
          taskId: new TaskId(createRandomIdString()),
          status: new TaskStatus(TaskStatus.notYet),
        }),
      ).toEqual(expect.any(UserBelongTask))
    })
  })
  describe('changeStatus', () => {
    it('[正常系]進捗ステータスを変更できる', () => {
      const userBelongTask = new UserBelongTask({
        userId: new UserId('1'),
        taskId: new TaskId(createRandomIdString()),
        status: new TaskStatus(TaskStatus.notYet),
      })
      userBelongTask.changeStatus(
        new UserId('1'),
        new TaskStatus(TaskStatus.complete),
      )
    })
    it('[準正常系]一度「完了」にした進捗ステータスを他のステータスに戻すことはできない', () => {
      const userBelongTask = new UserBelongTask({
        userId: new UserId('1'),
        taskId: new TaskId(createRandomIdString()),
        status: new TaskStatus(TaskStatus.complete),
      })
      expect(() =>
        userBelongTask.changeStatus(
          new UserId('1'),
          new TaskStatus(TaskStatus.notYet),
        ),
      ).toThrow(Error)
    })
    it('[準正常系]課題の所有者以外は進捗ステータスを変更できない', () => {
      const userBelongTask = new UserBelongTask({
        userId: new UserId('1'),
        taskId: new TaskId(createRandomIdString()),
        status: new TaskStatus(TaskStatus.notYet),
      })
      expect(() =>
        userBelongTask.changeStatus(
          new UserId('2'),
          new TaskStatus(TaskStatus.complete),
        ),
      ).toThrow(Error)
    })
  })
})
