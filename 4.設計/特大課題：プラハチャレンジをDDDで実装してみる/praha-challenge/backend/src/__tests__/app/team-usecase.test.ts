import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { TeamService } from 'src/domain/team/team-service'
import { TeamFactory } from 'src/domain/team/team-factory'
import { TeamDTO } from 'src/app/dto/team-dto'
import { TeamUseCase } from 'src/app/team-usecase'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { UserId } from 'src/domain/user/user-id'
import { TeamId } from 'src/domain/team/team-id'
import { createTeam } from '@testUtil/team/team-factory'
import { createUser } from '@testUtil/user/user-factory'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')
jest.mock('src/infra/db/repository/team-repository')
jest.mock('src/domain/team/team-service')
jest.mock('src/domain/team/team-factory')

describe('team-usecase.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockTeamRepo: MockedObjectDeep<TeamRepository>
  let mockTeamService: MockedObjectDeep<TeamService>
  let mockTeamFactory: MockedObjectDeep<TeamFactory>
  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockTeamRepo = mocked(new TeamRepository(prisma), true)
    mockTeamService = mocked(
      new TeamService({
        teamRepository: mockTeamRepo,
        userRepository: mockUserRepo,
      }),
      true,
    )
    mockTeamFactory = mocked(
      new TeamFactory({
        teamRepository: mockTeamRepo,
      }),
      true,
    )
  })
  describe('findAll', () => {
    it('[正常系]: DTOを返す', async () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      mockTeamRepo.findAll.mockResolvedValueOnce([
        createTeam({}),
        createTeam({}),
      ])

      const teamDTOs = await usecase.findAll()
      teamDTOs.map((teamDTO) => {
        return expect(teamDTO).toEqual(expect.any(TeamDTO))
      })
    })
    it('[準正常系]: findAllで例外が発生した場合、例外が発生する', () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      const ERROR_MESSAGE = 'error!'
      mockTeamRepo.findAll.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(usecase.findAll()).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('create', () => {
    it('[正常系]: DTOを返す', () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      mockUserRepo.findById.mockResolvedValue(createUser({}))
      mockTeamFactory.createTeam.mockResolvedValueOnce(createTeam({}))
      mockTeamRepo.save.mockResolvedValueOnce(createTeam({}))

      return expect(
        usecase.create({
          name: 'team1',
          userIds: [new UserId('1'), new UserId('2')],
        }),
      ).resolves.toEqual(expect.any(TeamDTO))
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.findById.mockResolvedValue(createUser({}))
      mockTeamFactory.createTeam.mockResolvedValueOnce(createTeam({}))
      mockTeamRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )

      return expect(
        usecase.create({
          name: 'team1',
          userIds: [new UserId('1'), new UserId('2')],
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('createTeamUser', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      mockUserRepo.findById.mockResolvedValue(createUser({}))
      mockTeamRepo.findById.mockResolvedValueOnce(createTeam({}))
      mockTeamRepo.save.mockResolvedValueOnce(createTeam({}))

      return expect(
        usecase.createTeamUser({
          teamId: new TeamId('1'),
          userId: new UserId('1'),
        }),
      ).resolves.toEqual(expect.any(TeamDTO))
    })
    it('[準正常系]: createTeamUserで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      mockUserRepo.findById.mockResolvedValue(createUser({}))
      mockTeamRepo.findById.mockResolvedValueOnce(createTeam({}))
      mockTeamRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(
        usecase.createTeamUser({
          teamId: new TeamId('1'),
          userId: new UserId('1'),
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('deleteTeamUser', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      mockUserRepo.findById.mockResolvedValue(createUser({}))
      mockTeamRepo.findById.mockResolvedValueOnce(createTeam({}))
      mockTeamService.deleteTeamUserAndSave.mockResolvedValueOnce(
        createTeam({}),
      )

      return expect(
        usecase.deleteTeamUser({
          teamId: new TeamId('1'),
          userId: new UserId('1'),
        }),
      ).resolves.toEqual(expect.any(TeamDTO))
    })
    it('[準正常系]: deleteTeamUserで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      mockUserRepo.findById.mockResolvedValue(createUser({}))
      mockTeamRepo.findById.mockResolvedValueOnce(createTeam({}))
      mockTeamService.deleteTeamUserAndSave.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(
        usecase.deleteTeamUser({
          teamId: new TeamId('1'),
          userId: new UserId('1'),
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      mockTeamRepo.delete.mockResolvedValueOnce()

      return expect(usecase.delete({ teamId: new TeamId('1') })).resolves.toBe(
        undefined,
      )
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      mockTeamRepo.delete.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(
        usecase.delete({ teamId: new TeamId('1') }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })
})
