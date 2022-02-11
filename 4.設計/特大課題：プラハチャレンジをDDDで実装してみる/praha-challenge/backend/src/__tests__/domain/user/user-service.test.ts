import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { TeamService } from 'src/domain/team/team-service'
import { UserService } from 'src/domain/user/user-service'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { UserId } from 'src/domain/user/user-id'
import { createTeam } from '@testUtil/team/team-factory'
import { createPair } from '@testUtil/pair/pair-factory'
import { PrismaClient } from '@prisma/client'
import { createUser } from '@testUtil/user/user-factory'
import { UserStatus } from 'src/domain/user/user-status'
import { User } from 'src/domain/user/user'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')
jest.mock('src/infra/db/repository/pair-repository')
jest.mock('src/infra/db/repository/team-repository')
jest.mock('src/domain/team/team-service')

describe('user-service.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockPairRepo: MockedObjectDeep<PairRepository>
  let mockTeamRepo: MockedObjectDeep<TeamRepository>
  let mockTeamService: MockedObjectDeep<TeamService>

  beforeEach(async () => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockPairRepo = mocked(new PairRepository(prisma), true)
    mockTeamRepo = mocked(new TeamRepository(prisma), true)
    mockTeamService = mocked(
      new TeamService({
        teamRepository: mockTeamRepo,
        userRepository: mockUserRepo,
      }),
      true,
    )
  })
  afterEach(async () => {
    jest.clearAllMocks()
  })
  describe('changeStatus', () => {
    it('[正常系]ユーザーの在籍ステータスを変更できる', async () => {
      mockPairRepo.findByUserId.mockResolvedValueOnce(null)
      mockTeamRepo.findByUserId.mockResolvedValueOnce(null)
      const userService = new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      })
      expect(
        userService.changeStatus(
          createUser({}),
          new UserStatus(UserStatus.leave),
        ),
      ).resolves.toEqual(expect.any(User))
    })
    it('[準正常系]activeでないステータスに変更かつペアに所属している場合エラーが発生', async () => {
      mockPairRepo.findByUserId.mockResolvedValueOnce(createPair({}))
      mockTeamRepo.findByUserId.mockResolvedValueOnce(null)
      const userService = new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      })
      expect(
        userService.changeStatus(
          createUser({}),
          new UserStatus(UserStatus.leave),
        ),
      ).rejects.toThrowError()
    })
    it('[準正常系]activeでないステータスに変更かつチームに所属している場合エラーが発生', async () => {
      mockPairRepo.findByUserId.mockResolvedValueOnce(null)
      mockTeamRepo.findByUserId.mockResolvedValueOnce(createTeam({}))
      const userService = new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      })
      expect(
        userService.changeStatus(
          createUser({}),
          new UserStatus(UserStatus.leave),
        ),
      ).rejects.toThrowError()
    })
  })
  describe('delete', () => {
    it('[正常系]ペアに所属している場合はpairRepository.saveが実行される', async () => {
      mockPairRepo.findByUserId.mockResolvedValueOnce(
        createPair({
          users: [createUser({ id: '1' }), createUser({}), createUser({})],
        }),
      )
      mockTeamRepo.findByUserId.mockResolvedValueOnce(null)
      const userService = new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      })
      await userService.deleteUser(new UserId('1'))
      expect(mockPairRepo.save).toBeCalledTimes(1)
    })
    it('[正常系]チームに所属している場合はteamService.deleteTeamUserAndSaveが実行される', async () => {
      mockPairRepo.findByUserId.mockResolvedValueOnce(null)
      mockTeamRepo.findByUserId.mockResolvedValueOnce(
        createTeam({
          users: [
            createUser({ id: '1' }),
            createUser({}),
            createUser({}),
            createUser({}),
          ],
        }),
      )
      const userService = new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      })
      await userService.deleteUser(new UserId('1'))
      expect(mockTeamService.deleteTeamUserAndSave).toBeCalledTimes(1)
    })
  })
})
