import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateTaskGroupRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string
}

export class updateNameRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string
}
