import { UserId } from '../user/user-id'
import { Pair } from './pair'
import { PairId } from './pair-id'

export interface IPairRepository {
  findAll(): Promise<Pair[]>
  findById(pairId: PairId): Promise<Pair>
  findByUserId(userId: UserId): Promise<Pair | null>
  save(pair: Pair): Promise<Pair>
  delete(pairId: PairId): Promise<void>
  deletePairUser(userId: UserId): Promise<void>
}
