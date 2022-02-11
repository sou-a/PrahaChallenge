import { TeamId } from 'src/domain/team/team-id'
import { UserId } from 'src/domain/user/user-id'

export class TeamDTO {
  public readonly id: TeamId
  public readonly name: string
  public readonly teamUsers: TeamUserDTO[]
  public constructor(props: {
    id: TeamId
    name: string
    teamUsers: TeamUserDTO[]
  }) {
    const { id, name, teamUsers } = props
    this.id = id
    this.name = name
    this.teamUsers = teamUsers
  }
}

export type TeamUserDTO = {
  id: UserId
}
