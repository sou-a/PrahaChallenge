import { Pair } from 'src/domain/pair/pair'
import { createRandomIdString } from 'src/util/random'
import { User } from 'src/domain/user/user'
import { UserStatus } from 'src/domain/user/user-status'
import { UserId } from 'src/domain/user/user-id'
import { PairId } from 'src/domain/pair/pair-id'
import { createUser } from '@testUtil/user/user-factory'

describe('pair.ts', () => {
  describe('constructor', () => {
    const users: User[] = [createUser({}), createUser({})]
    it('[正常系]生成できる', () => {
      expect(
        new Pair({
          id: new PairId(createRandomIdString()),
          name: 'a',
          users,
        }),
      ).toEqual(expect.any(Pair))
    })
    it('[準正常系]名前は英文字のみ', () => {
      expect(
        () =>
          new Pair({
            id: new PairId(createRandomIdString()),
            name: '1',
            users,
          }),
      ).toThrow(Error)
    })
    it('[準正常系]参加者が1名の場合はエラー', () => {
      const user: User[] = [createUser({})]

      expect(
        () =>
          new Pair({
            id: new PairId(createRandomIdString()),
            name: '1',
            users: user,
          }),
      ).toThrow(Error)
    })
    it('[準正常系]参加者が4名の場合はエラー', () => {
      const tooManyUsers: User[] = [
        createUser({}),
        createUser({}),
        createUser({}),
        createUser({}),
      ]

      expect(
        () =>
          new Pair({
            id: new PairId(createRandomIdString()),
            name: '1',
            users: tooManyUsers,
          }),
      ).toThrow(Error)
    })
    it('[準正常系]active以外のユーザーはペアに参加できない', () => {
      const recessUsers: User[] = [
        createUser({ status: new UserStatus(UserStatus.recess) }),
        createUser({ status: new UserStatus(UserStatus.recess) }),
      ]
      const leaveUsers: User[] = [
        createUser({ status: new UserStatus(UserStatus.leave) }),
        createUser({ status: new UserStatus(UserStatus.leave) }),
      ]
      expect(
        () =>
          new Pair({
            id: new PairId(createRandomIdString()),
            name: 'a',
            users: recessUsers,
          }),
      ).toThrow()
      expect(
        () =>
          new Pair({
            id: new PairId(createRandomIdString()),
            name: 'a',
            users: leaveUsers,
          }),
      ).toThrow()
    })
    describe('addPairUser', () => {
      it('[正常系]ペアユーザーを追加できる', () => {
        const pair = new Pair({
          id: new PairId(createRandomIdString()),
          name: 'a',
          users,
        })
        expect(pair.getAllProperties().pairUsers).toHaveLength(2)

        const addUser: User = createUser({})
        pair.addPairUser(addUser)
        expect(pair.getAllProperties().pairUsers).toHaveLength(3)
      })
    })
    describe('removePairUser', () => {
      it('[正常系]ペアユーザーを削除できる', () => {
        const manyUsers: User[] = [
          createUser({ id: '1' }),
          createUser({ id: '2' }),
          createUser({ id: '3' }),
        ]
        const pair = new Pair({
          id: new PairId(createRandomIdString()),
          name: 'a',
          users: manyUsers,
        })
        expect(pair.getAllProperties().pairUsers).toHaveLength(3)
        pair.removePairUser(new UserId('1'))
        expect(pair.getAllProperties().pairUsers).toHaveLength(2)
      })
    })
  })
})
