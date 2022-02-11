import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreatePairRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly userIds!: string[]
}

export class PairUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId!: string
}
