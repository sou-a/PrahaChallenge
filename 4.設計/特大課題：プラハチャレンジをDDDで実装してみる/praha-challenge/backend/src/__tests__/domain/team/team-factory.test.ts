import { PrismaClient } from '@prisma/client'
import { createTeam } from '@testUtil/team/team-factory'
import { createUser } from '@testUtil/user/user-factory'
import { Team } from 'src/domain/team/team'
import { TeamFactory } from 'src/domain/team/team-factory'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/team-repository')

describe('team-factory.ts', () => {
  let mockTeamRepo: MockedObjectDeep<TeamRepository>

  beforeEach(async () => {
    const prisma = new PrismaClient()
    mockTeamRepo = mocked(new TeamRepository(prisma), true)
  })
  afterEach(async () => {
    jest.clearAllMocks()
  })
  describe('createTeam', () => {
    it('[正常系]チームを生成できる', async () => {
      const users = [createUser({}), createUser({}), createUser({})]
      mockTeamRepo.findByName.mockResolvedValueOnce(null)
      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      expect(teamFactory.createTeam({ name: '1', users })).resolves.toEqual(
        expect.any(Team),
      )
    })

    it('[準正常系]チーム名は数字のみ', () => {
      const users = [createUser({}), createUser({}), createUser({})]
      mockTeamRepo.findByName.mockResolvedValueOnce(null)
      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      expect(teamFactory.createTeam({ name: 'a', users })).rejects.toThrow(
        Error,
      )
    })

    it('[準正常系]チーム名は3文字以下', () => {
      const users = [createUser({}), createUser({}), createUser({})]
      mockTeamRepo.findByName.mockResolvedValueOnce(null)
      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      expect(teamFactory.createTeam({ name: '1111', users })).rejects.toThrow(
        Error,
      )
    })

    it('[準正常系]参加者2名以下の場合エラー', () => {
      const users = [createUser({}), createUser({})]
      mockTeamRepo.findByName.mockResolvedValueOnce(null)
      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      expect(teamFactory.createTeam({ name: '1', users })).rejects.toThrow(
        Error,
      )
    })

    it('[準正常系]チーム名が重複している場合エラー', async () => {
      const users = [createUser({}), createUser({}), createUser({})]
      mockTeamRepo.findByName.mockResolvedValueOnce(createTeam({ users }))

      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      expect(() =>
        teamFactory.createTeam({ name: '1', users }),
      ).rejects.toThrow(Error)
    })
  })
})
