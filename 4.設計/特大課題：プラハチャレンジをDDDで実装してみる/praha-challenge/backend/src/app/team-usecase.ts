import { ITeamRepository } from 'src/domain/team/i-team-repository'
import { Team } from 'src/domain/team/team'
import { TeamFactory } from 'src/domain/team/team-factory'
import { TeamId } from 'src/domain/team/team-id'
import { TeamService } from 'src/domain/team/team-service'
import { IUserRepository } from 'src/domain/user/i-user-repository'
import { User } from 'src/domain/user/user'
import { UserId } from 'src/domain/user/user-id'
import { TeamDTO } from './dto/team-dto'

// チームの一覧取得、新規追加、更新（少なくとも所属するペアを変更できること）、削除
export class TeamUseCase {
  private teamRepository: ITeamRepository
  private userRepository: IUserRepository
  private teamService: TeamService
  private teamFactory: TeamFactory

  public constructor(
    teamRepository: ITeamRepository,
    userRepository: IUserRepository,
    teamService: TeamService,
    teamFactory: TeamFactory,
  ) {
    this.teamRepository = teamRepository
    this.userRepository = userRepository
    this.teamService = teamService
    this.teamFactory = teamFactory
  }

  public async findAll(): Promise<TeamDTO[]> {
    try {
      const teams: Team[] = await this.teamRepository.findAll()
      return teams.map((team: Team) => {
        return new TeamDTO({
          id: team.getAllProperties().id,
          name: team.getAllProperties().name,
          teamUsers: team.getAllProperties().teamUsers.map((teamUser) => {
            return {
              id: teamUser.getAllProperties().userId,
              status: teamUser.getAllProperties().status.getStatus(),
            }
          }),
        })
      })
    } catch (error) {
      throw error
    }
  }

  public async create(props: {
    name: string
    userIds: UserId[]
  }): Promise<TeamDTO> {
    const { name, userIds } = props
    const users: User[] = await Promise.all(
      userIds.map((userId) => {
        return this.userRepository.findById(userId)
      }),
    )
    const team: Team = await this.teamFactory.createTeam({
      name,
      users,
    })
    try {
      const savedTeam = await this.teamRepository.save(team)
      return new TeamDTO({
        id: savedTeam.getAllProperties().id,
        name: savedTeam.getAllProperties().name,
        teamUsers: savedTeam.getAllProperties().teamUsers.map((teamUser) => {
          return {
            id: teamUser.getAllProperties().userId,
            status: teamUser.getAllProperties().status.getStatus(),
          }
        }),
      })
    } catch (error) {
      throw error
    }
  }

  public async createTeamUser(props: {
    teamId: TeamId
    userId: UserId
  }): Promise<TeamDTO> {
    const { teamId, userId } = props

    const user: User = await this.userRepository.findById(userId)
    const team: Team = await this.teamRepository.findById(teamId)

    try {
      const addedTeamUser = team.addTeamUser(user)
      const savedTeam = await this.teamRepository.save(addedTeamUser)
      return new TeamDTO({
        id: savedTeam.getAllProperties().id,
        name: savedTeam.getAllProperties().name,
        teamUsers: savedTeam.getAllProperties().teamUsers.map((teamUser) => {
          return {
            id: teamUser.getAllProperties().userId,
            status: teamUser.getAllProperties().status.getStatus(),
          }
        }),
      })
    } catch (error) {
      throw error
    }
  }

  public async deleteTeamUser(props: {
    teamId: TeamId
    userId: UserId
  }): Promise<TeamDTO> {
    const { teamId, userId } = props
    const user: User = await this.userRepository.findById(userId)
    const team: Team = await this.teamRepository.findById(teamId)

    try {
      const resultTeam = await this.teamService.deleteTeamUserAndSave(
        team,
        user.getAllProperties().id,
      )
      return new TeamDTO({
        id: resultTeam.getAllProperties().id,
        name: resultTeam.getAllProperties().name,
        teamUsers: resultTeam.getAllProperties().teamUsers.map((teamUser) => {
          return {
            id: teamUser.getAllProperties().userId,
            status: teamUser.getAllProperties().status.getStatus(),
          }
        }),
      })
    } catch (error) {
      throw error
    }
  }

  public delete(prop: { teamId: TeamId }): Promise<void> {
    const { teamId } = prop

    try {
      return this.teamRepository.delete(teamId)
    } catch (error) {
      throw error
    }
  }
}
