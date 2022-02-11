import { ApiProperty } from '@nestjs/swagger'
import { UserDTO } from 'src/app/dto/user-dto'

export class FindAllUserResponse {
  @ApiProperty({ type: () => [User] })
  user: User[]

  public constructor(params: { userDTOs: UserDTO[] }) {
    const { userDTOs } = params
    this.user = userDTOs.map(({ id, name, mailAddress, status }) => {
      return new User({
        id: id.value,
        name,
        mailAddress,
        status,
      })
    })
  }
}

class User {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  mailAddress: string

  @ApiProperty()
  status: string

  public constructor(params: {
    id: string
    name: string
    mailAddress: string
    status: string
  }) {
    this.id = params.id
    this.name = params.name
    this.mailAddress = params.mailAddress
    this.status = params.status
  }
}

export class FindUsersByTasksResponse {
  @ApiProperty({ type: () => [User] })
  user: User[]

  public constructor(params: { userDTOs: UserDTO[] }) {
    const { userDTOs } = params
    this.user = userDTOs.map(({ id, name, mailAddress, status }) => {
      return new User({
        id: id.value,
        name,
        mailAddress,
        status,
      })
    })
  }
}
