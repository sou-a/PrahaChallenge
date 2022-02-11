import { UserStatus } from 'src/domain/user/user-status'

describe('user-status.ts', () => {
  describe('constructor', () => {
    it('[正常系]statusListにあるステータスはインスタンス生成できる', () => {
      const statusList = UserStatus.statusList
      statusList.map((status) => {
        expect(new UserStatus(status)).toEqual({
          value: expect.anything(),
          _: '',
        })
      })
    })

    it('[準正常系]statusListにあるステータス以外のものはインスタンス生成できない', () => {
      const statusList = ['1', 'テストステータス']
      statusList.map((status) => {
        expect(() => new UserStatus(status)).toThrow(Error)
      })
    })
  })

  describe('getStatus', () => {
    it('[正常系]ステータスを取得できる', () => {
      const status: string = UserStatus.active
      const userStatus = new UserStatus(status)
      expect(userStatus.getStatus()).toBe(status)
    })
  })

  describe('isActive', () => {
    it('[正常系]在籍中の場合true', () => {
      const active = new UserStatus(UserStatus.active)
      expect(active.isActive()).toBe(true)

      const recess = new UserStatus(UserStatus.recess)
      expect(recess.isActive()).toBe(false)

      const leave = new UserStatus(UserStatus.leave)
      expect(leave.isActive()).toBe(false)
    })
  })

  describe('equals', () => {
    it('[正常系]等価性の保証', () => {
      const active = new UserStatus(UserStatus.active)
      const active2 = new UserStatus(UserStatus.active)
      expect(active.equals(active2)).toBe(true)

      const recess = new UserStatus(UserStatus.recess)
      expect(active.equals(recess)).toBe(false)
    })
  })
})
