import { PairId } from 'src/domain/pair/pair-id'
import { UserId } from 'src/domain/user/user-id'

export class PairDTO {
  public readonly id: PairId
  public readonly name: string
  public readonly pairUsers: PairUserDTO[]
  public constructor(props: {
    id: PairId
    name: string
    pairUsers: PairUserDTO[]
  }) {
    const { id, name, pairUsers } = props
    this.id = id
    this.name = name
    this.pairUsers = pairUsers
  }
}

export type PairUserDTO = {
  id: UserId
  status: string
}
