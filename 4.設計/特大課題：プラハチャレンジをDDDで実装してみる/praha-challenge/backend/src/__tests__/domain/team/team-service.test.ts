import { TeamService } from 'src/domain/team/team-service'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'
import { UserId } from 'src/domain/user/user-id'
import { seedTeamAndUsers } from '@testUtil/team/seed-team'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { createUser } from '@testUtil/user/user-factory'
import { PrismaClient } from '@prisma/client'
import { createTeam } from '@testUtil/team/team-factory'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')
jest.mock('src/infra/db/repository/team-repository')

describe('team-service.ts', () => {
  let mockTeamRepo: MockedObjectDeep<TeamRepository>
  let mockUserRepo: MockedObjectDeep<UserRepository>
  describe('deleteTeamUser', () => {
    beforeEach(async () => {
      const prisma = new PrismaClient()
      mockUserRepo = mocked(new UserRepository(prisma), true)
      mockTeamRepo = mocked(new TeamRepository(prisma), true)
    })
    afterEach(async () => {
      jest.clearAllMocks()
    })
    it('[正常系]チームユーザーを削除できる', async () => {
      const users = [
        createUser({ id: '1' }),
        createUser({}),
        createUser({}),
        createUser({}),
      ]
      const team = createTeam({ users })
      mockTeamRepo.save.mockResolvedValueOnce(team)
      const teamService = new TeamService({
        teamRepository: mockTeamRepo,
        userRepository: mockUserRepo,
      })
      expect(
        teamService.deleteTeamUserAndSave(team, new UserId('1')),
      ).resolves.toBe(team)
    })

    it('[正常系]削除の結果チームの参加者が2名以下の場合、最も参加人数が少ないチームと合併される', async () => {
      const team = createTeam({
        users: [
          createUser({ id: '1' }),
          createUser({ id: '2' }),
          createUser({ id: '3' }),
        ],
      })
      const mergedTeam = createTeam({
        users: [
          createUser({ id: '4' }),
          createUser({ id: '5' }),
          createUser({ id: '6' }),
        ],
      })
      const resultTeam = createTeam({
        users: [
          createUser({ id: '2' }),
          createUser({ id: '3' }),
          createUser({ id: '4' }),
          createUser({ id: '5' }),
          createUser({ id: '6' }),
        ],
      })
      mockTeamRepo.findLeastTeamUsersTeam.mockResolvedValueOnce(mergedTeam)
      mockUserRepo.findById.mockResolvedValue(createUser({}))
      mockTeamRepo.delete.mockResolvedValueOnce()
      mockTeamRepo.save.mockResolvedValueOnce(resultTeam)
      const teamService = new TeamService({
        teamRepository: mockTeamRepo,
        userRepository: mockUserRepo,
      })
      expect(
        teamService.deleteTeamUserAndSave(team, new UserId('1')),
      ).resolves.toBe(resultTeam)
    })
  })
})
