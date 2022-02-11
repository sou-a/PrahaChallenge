import { IPairRepository } from 'src/domain/pair/i-pair-repository'
import { Pair } from 'src/domain/pair/pair'
import { PairId } from 'src/domain/pair/pair-id'
import { IUserRepository } from 'src/domain/user/i-user-repository'
import { User } from 'src/domain/user/user'
import { UserId } from 'src/domain/user/user-id'
import { createRandomIdString } from 'src/util/random'
import { PairDTO } from './dto/pair-dto'

// ペアの一覧取得、新規追加、更新（少なくとも所属する参加者を変更できること）、削除
export class PairUseCase {
  private pairRepository: IPairRepository
  private userRepository: IUserRepository

  public constructor(
    pairRepository: IPairRepository,
    userRepository: IUserRepository,
  ) {
    this.pairRepository = pairRepository
    this.userRepository = userRepository
  }

  public async findAll(): Promise<PairDTO[]> {
    try {
      const pairs: Pair[] = await this.pairRepository.findAll()
      return pairs.map((pair: Pair) => {
        return new PairDTO({
          id: pair.getAllProperties().id,
          name: pair.getAllProperties().name,
          pairUsers: pair.getAllProperties().pairUsers.map((pairUser) => {
            return {
              id: pairUser.getAllProperties().userId,
              status: pairUser.getAllProperties().status.getStatus(),
            }
          }),
        })
      })
    } catch (error) {
      throw error
    }
  }

  public async create(props: {
    name: string
    userIds: UserId[]
  }): Promise<PairDTO> {
    const { name, userIds } = props
    const users: User[] = await Promise.all(
      userIds.map((userId) => {
        return this.userRepository.findById(userId)
      }),
    )
    const pair: Pair = new Pair({
      id: new PairId(createRandomIdString()),
      name,
      users,
    })
    try {
      const savedPair = await this.pairRepository.save(pair)
      return new PairDTO({
        id: savedPair.getAllProperties().id,
        name: savedPair.getAllProperties().name,
        pairUsers: savedPair.getAllProperties().pairUsers.map((pairUser) => {
          return {
            id: pairUser.getAllProperties().userId,
            status: pairUser.getAllProperties().status.getStatus(),
          }
        }),
      })
    } catch (error) {
      throw error
    }
  }

  public async addPairUser(props: {
    pairId: PairId
    userId: UserId
  }): Promise<PairDTO> {
    const { pairId, userId } = props

    const user: User = await this.userRepository.findById(userId)
    const pair: Pair = await this.pairRepository.findById(pairId)

    try {
      const addedPairUser = pair.addPairUser(user)
      const savedPair = await this.pairRepository.save(addedPairUser)
      return new PairDTO({
        id: savedPair.getAllProperties().id,
        name: savedPair.getAllProperties().name,
        pairUsers: savedPair.getAllProperties().pairUsers.map((pairUser) => {
          return {
            id: pairUser.getAllProperties().userId,
            status: pairUser.getAllProperties().status.getStatus(),
          }
        }),
      })
    } catch (error) {
      throw error
    }
  }

  public async removePairUser(props: {
    pairId: PairId
    userId: UserId
  }): Promise<PairDTO> {
    const { pairId, userId } = props
    const pair: Pair = await this.pairRepository.findById(pairId)

    try {
      const removedPair = pair.removePairUser(userId)
      const savedPair = await this.pairRepository.save(removedPair)
      return new PairDTO({
        id: savedPair.getAllProperties().id,
        name: savedPair.getAllProperties().name,
        pairUsers: savedPair.getAllProperties().pairUsers.map((pairUser) => {
          return {
            id: pairUser.getAllProperties().userId,
            status: pairUser.getAllProperties().status.getStatus(),
          }
        }),
      })
    } catch (error) {
      throw error
    }
  }

  public delete(prop: { pairId: PairId }): Promise<void> {
    const { pairId } = prop

    try {
      return this.pairRepository.delete(pairId)
    } catch (error) {
      throw error
    }
  }
}
