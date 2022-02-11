import { createRandomIdString } from 'src/util/random'
import { User } from 'src/domain/user/user'
import { UserStatus } from 'src/domain/user/user-status'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { UserId } from 'src/domain/user/user-id'
import { prisma } from '@testUtil/prisma'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { seedUser } from '@testUtil/user/seed-user'

describe('user-repository.integration.ts', () => {
  const userRepo = new UserRepository(prisma)
  beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()
  })
  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()

    await prisma.$disconnect()
  })

  describe('findAll', () => {
    it('[正常系]userを全て取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({})
      await seedUser({})
      const users = await userRepo.findAll()
      expect(users).toHaveLength(2)
    })
  })

  describe('findById', () => {
    it('[正常系]特定のidのuserを取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      const user = await userRepo.findById(new UserId('1'))
      expect(user).toEqual(expect.any(User))
    })
  })

  describe('save', () => {
    it('[正常系]userを保存できる', async () => {
      await seedAllUserStatus()
      const userExpected = {
        id: new UserId(createRandomIdString()),
        name: 'user1',
        mailAddress: 'sample@example.com',
        status: new UserStatus(UserStatus.active),
      }
      await userRepo.save(User.createFromRepository(userExpected))

      const allUsers = await prisma.user.findMany()
      expect(allUsers).toHaveLength(1)
    })
  })

  describe('delete', () => {
    it('[正常系]特定のidのuserを削除できる', async () => {
      await seedAllUserStatus()
      const data = [
        {
          id: '1',
          userStatusId: '1',
          name: 'user1',
          mailAddress: 'sample@example.com',
        },
        {
          id: '2',
          userStatusId: '1',
          name: 'user2',
          mailAddress: 'sample@example.com',
        },
      ]
      await prisma.user.createMany({ data })
      await userRepo.delete(new UserId('1'))
      const allUsers = await prisma.user.findMany()
      expect(allUsers).toHaveLength(1)
      expect(allUsers[0]).toEqual(data[1])
    })
  })
})
