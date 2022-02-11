import { ApiProperty } from '@nestjs/swagger'
import { TeamDTO } from 'src/app/dto/team-dto'

export class FindAllTeamResponse {
  @ApiProperty({ type: () => [Team] })
  teams: Team[]

  public constructor(params: { teamDTOs: TeamDTO[] }) {
    const { teamDTOs } = params
    this.teams = teamDTOs.map(({ id, name, teamUsers }) => {
      return new Team({
        id: id.value,
        name,
        teamUsers: teamUsers.map((teamUser) => {
          return new TeamUser({
            id: teamUser.id.value,
          })
        }),
      })
    })
  }
}

class Team {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  teamUsers: TeamUser[]

  public constructor(params: {
    id: string
    name: string
    teamUsers: TeamUser[]
  }) {
    this.id = params.id
    this.name = params.name
    this.teamUsers = params.teamUsers
  }
}

class TeamUser {
  @ApiProperty()
  id: string

  public constructor(params: { id: string }) {
    this.id = params.id
  }
}
