import { ApiProperty } from '@nestjs/swagger'
import { PairDTO } from 'src/app/dto/pair-dto'

export class FindAllPairResponse {
  @ApiProperty({ type: () => [Pair] })
  pairs: Pair[]

  public constructor(params: { pairDTOs: PairDTO[] }) {
    const { pairDTOs } = params
    this.pairs = pairDTOs.map(({ id, name, pairUsers }) => {
      return new Pair({
        id: id.value,
        name,
        pairUsers: pairUsers.map((pairUser) => {
          return new PairUser({
            id: pairUser.id.value,
            status: pairUser.status,
          })
        }),
      })
    })
  }
}

class Pair {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  pairUsers: PairUser[]

  public constructor(params: {
    id: string
    name: string
    pairUsers: PairUser[]
  }) {
    this.id = params.id
    this.name = params.name
    this.pairUsers = params.pairUsers
  }
}

class PairUser {
  @ApiProperty()
  id: string

  @ApiProperty()
  status: string

  public constructor(params: { id: string; status: string }) {
    this.id = params.id
    this.status = params.status
  }
}
