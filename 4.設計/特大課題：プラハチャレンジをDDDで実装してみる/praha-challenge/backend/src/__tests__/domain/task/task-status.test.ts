import { TaskStatus } from 'src/domain/user-belong-task/task-status'

describe('task-status.ts', () => {
  describe('constructor', () => {
    it('[正常系]statusListにあるステータスはインスタンス生成できる', () => {
      const statusList = TaskStatus.statusList
      statusList.map((status) => {
        expect(new TaskStatus(status)).toEqual({
          value: expect.anything(),
          _: '',
        })
      })
    })

    it('[準正常系]statusListにあるステータス以外のものはインスタンス生成できない', () => {
      const statusList = ['1', 'テストステータス']
      statusList.map((status) => {
        expect(() => new TaskStatus(status)).toThrow(Error)
      })
    })
  })

  describe('getStatus', () => {
    it('[正常系]ステータスを取得できる', () => {
      const status: string = TaskStatus.notYet
      const taskStatus = new TaskStatus(status)
      expect(taskStatus.getStatus()).toBe(status)
    })
  })

  describe('isActive', () => {
    it('[正常系]完了の場合true', () => {
      const notYet = new TaskStatus(TaskStatus.notYet)
      expect(notYet.isComplete()).toBe(false)

      const review = new TaskStatus(TaskStatus.review)
      expect(review.isComplete()).toBe(false)

      const comlete = new TaskStatus(TaskStatus.complete)
      expect(comlete.isComplete()).toBe(true)
    })
  })

  describe('equals', () => {
    it('[正常系]等価性の保証', () => {
      const complete = new TaskStatus(TaskStatus.complete)
      const complete2 = new TaskStatus(TaskStatus.complete)
      expect(complete.equals(complete2)).toBe(true)

      const review = new TaskStatus(TaskStatus.review)
      expect(complete.equals(review)).toBe(false)
    })
  })
})
