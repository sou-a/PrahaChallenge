import { PrismaClient } from '@prisma/client'
import { createUser } from '@testUtil/user/user-factory'
import { User } from 'src/domain/user/user'
import { UserFactory } from 'src/domain/user/user-factory'
import { UserStatus } from 'src/domain/user/user-status'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')

describe('user-factory.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>

  beforeEach(async () => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
  })
  afterEach(async () => {
    jest.clearAllMocks()
  })
  describe('createUser', () => {
    it('[正常系]ユーザーを生成できる', async () => {
      const userProps = {
        name: '1',
        mailAddress: 'a@a',
        status: new UserStatus(UserStatus.active),
      }
      mockUserRepo.findByMailAddress.mockResolvedValueOnce(null)
      const userFactory = new UserFactory({
        userRepository: mockUserRepo,
      })
      expect(userFactory.createUser(userProps)).resolves.toEqual(
        expect.any(User),
      )
    })

    it('[準正常系]メールアドレスが重複している場合はエラーが発生する', async () => {
      const userProps = {
        name: '1',
        mailAddress: 'a@a',
        status: new UserStatus(UserStatus.active),
      }
      mockUserRepo.findByMailAddress.mockResolvedValueOnce(createUser({}))
      const userFactory = new UserFactory({
        userRepository: mockUserRepo,
      })
      expect(userFactory.createUser(userProps)).rejects.toThrow(Error)
    })
  })
})
