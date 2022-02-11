import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateTeamRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly userIds!: string[]
}

export class TeamUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId!: string
}
