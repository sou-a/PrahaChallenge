import { createRandomIdString } from 'src/util/random'
import { User } from '../user/user'
import { Team } from './team'
import { ITeamRepository } from './i-team-repository'
import { TeamId } from './team-id'

export class TeamFactory {
  private teamRepository: ITeamRepository
  public constructor(props: { teamRepository: ITeamRepository }) {
    const { teamRepository } = props

    this.teamRepository = teamRepository
  }

  public async createTeam(props: {
    name: string
    users: User[]
  }): Promise<Team> {
    const { name, users } = props
    const team = await this.teamRepository.findByName(name)
    // - 重複不可
    if (team) {
      throw new Error('チーム名が重複しています')
    }
    return Team.createFromFactory({
      id: new TeamId(createRandomIdString()),
      name: name,
      users: users,
    })
  }
}
