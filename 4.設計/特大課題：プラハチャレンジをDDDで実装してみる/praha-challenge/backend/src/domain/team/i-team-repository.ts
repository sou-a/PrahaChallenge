import { UserId } from '../user/user-id'
import { Team } from './team'
import { TeamId } from './team-id'

export interface ITeamRepository {
  findAll(): Promise<Team[]>
  findById(teamId: TeamId): Promise<Team>
  findByUserId(userId: UserId): Promise<Team | null>
  findByName(name: string): Promise<Team | null>
  findLeastTeamUsersTeam(exceptTeamId: TeamId): Promise<Team | null>
  save(team: Team): Promise<Team>
  delete(teamId: TeamId): Promise<void>
  deleteTeamUser(userId: UserId): Promise<void>
}
