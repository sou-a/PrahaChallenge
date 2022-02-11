import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserService } from 'src/domain/user/user-service'
import { TeamService } from 'src/domain/team/team-service'
import { UserStatus } from 'src/domain/user/user-status'
import { UserDTO } from 'src/app/dto/user-dto'
import { UserUseCase } from 'src/app/user-usecase'
import { UserQS } from 'src/infra/db/query-service/user-qs'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { UserId } from 'src/domain/user/user-id'
import { createUser } from '@testUtil/user/user-factory'
import { TaskId } from 'src/domain/task/task-id'
import { UserFactory } from 'src/domain/user/user-factory'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')
jest.mock('src/domain/user/user-service')
jest.mock('src/infra/db/query-service/user-qs')
jest.mock('src/domain/user/user-factory')

describe('user-usecase.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockPairRepo: MockedObjectDeep<PairRepository>
  let mockTeamRepo: MockedObjectDeep<TeamRepository>
  let mockTeamService: MockedObjectDeep<TeamService>
  let mockUserService: MockedObjectDeep<UserService>
  let mockUserFactory: MockedObjectDeep<UserFactory>
  let mockUserQS: MockedObjectDeep<UserQS>
  beforeEach(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockUserFactory = mocked(
      new UserFactory({ userRepository: mockUserRepo }),
      true,
    )
    mockUserService = mocked(
      new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      }),
      true,
    )
    mockUserQS = mocked(new UserQS(prisma), true)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('findAll', () => {
    it('[正常系]: DTOを返す', async () => {
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      mockUserRepo.findAll.mockResolvedValueOnce([
        createUser({}),
        createUser({}),
      ])

      const userDTOs = await usecase.findAll()
      userDTOs.map((userDTO) => {
        expect(userDTO).toEqual(expect.any(UserDTO))
      })
    })
    it('[準正常系]: findAllで例外が発生した場合、例外が発生する', () => {
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.findAll.mockRejectedValueOnce(ERROR_MESSAGE)
      expect(usecase.findAll()).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('findUsersByTasks', () => {
    it('[正常系]: DTOを返す', async () => {
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      mockUserQS.findUsersByTasks.mockResolvedValue([
        new UserDTO({
          id: new UserId('1'),
          name: 'n',
          mailAddress: 'mail',
          status: '在籍中',
        }),
      ])

      const userDTOs = await usecase.findUsersByTasks({
        taskIds: [new TaskId('1')],
        taskStatus: '完了',
        page: 1,
      })
      userDTOs.map((userDTO) => {
        expect(userDTO).toEqual(expect.any(UserDTO))
      })
    })
    it('[準正常系]: findUsersByTasksで例外が発生した場合、例外が発生する', () => {
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      const ERROR_MESSAGE = 'error!'
      mockUserQS.findUsersByTasks.mockRejectedValueOnce(ERROR_MESSAGE)

      expect(
        usecase.findUsersByTasks({
          taskIds: [new TaskId('1')],
          taskStatus: '完了',
          page: 1,
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('create', () => {
    it('[正常系]: DTOを返す', async () => {
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      mockUserRepo.save.mockResolvedValueOnce(createUser({}))
      return expect(
        usecase.create({
          name: 'user1',
          mailAddress: 'mail1',
          status: UserStatus.active,
        }),
      ).resolves.toEqual(expect.any(UserDTO))
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      return expect(
        usecase.create({
          name: 'user1',
          mailAddress: 'mail1',
          status: UserStatus.active,
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('changeStatus', () => {
    it('[正常系]: DTOを返す', async () => {
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      const user = createUser({})
      const status = UserStatus.leave
      mockUserRepo.findById.mockResolvedValueOnce(user)
      mockUserService.changeStatus.mockResolvedValueOnce(user)
      mockUserRepo.save.mockResolvedValueOnce(user)

      return expect(
        usecase.changeStatus({
          userId: new UserId('1'),
          status,
        }),
      ).resolves.toEqual(expect.any(UserDTO))
    })
    it('[準正常系]: userService.changeStatusで例外が発生した場合、saveが実行されず例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      const user = createUser({})
      const status = UserStatus.leave
      mockUserRepo.findById.mockResolvedValueOnce(user)
      mockUserService.changeStatus.mockRejectedValueOnce(ERROR_MESSAGE)
      mockUserRepo.save.mockRejectedValueOnce(user)
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )

      expect(mockUserRepo.save).toBeCalledTimes(0)
      expect(
        usecase.changeStatus({
          userId: new UserId('1'),
          status,
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      const user = createUser({})
      const status = UserStatus.leave
      mockUserRepo.findById.mockResolvedValueOnce(user)
      mockUserService.changeStatus.mockResolvedValueOnce(user)
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      return expect(
        usecase.changeStatus({
          userId: new UserId('1'),
          status,
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      mockUserService.deleteUser.mockResolvedValueOnce()
      return expect(usecase.delete({ userId: new UserId('1') })).resolves.toBe(
        undefined,
      )
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserService.deleteUser.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new UserUseCase(
        mockUserRepo,
        mockUserFactory,
        mockUserService,
        mockUserQS,
      )
      return expect(
        usecase.delete({ userId: new UserId('1') }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })
})
