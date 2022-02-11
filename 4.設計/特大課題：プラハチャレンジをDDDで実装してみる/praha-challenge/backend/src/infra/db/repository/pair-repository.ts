import { PrismaClient } from '@prisma/client'
import { IPairRepository } from 'src/domain/pair/i-pair-repository'
import { Pair } from 'src/domain/pair/pair'
import { PairId } from 'src/domain/pair/pair-id'
import { User } from 'src/domain/user/user'
import { UserId } from 'src/domain/user/user-id'
import { UserStatus } from 'src/domain/user/user-status'

export class PairRepository implements IPairRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<Pair[]> {
    const models = await this.prismaClient.pair.findMany({
      include: {
        users: {
          include: {
            user: {
              include: {
                userStatus: true,
              },
            },
          },
        },
      },
    })
    const entities: Pair[] = models.map(
      (model): Pair => {
        const users = model.users.map((pairUser) => {
          return User.createFromRepository({
            id: new UserId(pairUser.user.id),
            name: pairUser.user.name,
            mailAddress: pairUser.user.mailAddress,
            status: new UserStatus(pairUser.user.userStatus.name),
          })
        })
        return new Pair({
          id: new PairId(model.id),
          name: model.name,
          users: users,
        })
      },
    )
    return entities
  }

  public async findById(pairId: PairId): Promise<Pair> {
    const model = await this.prismaClient.pair.findUnique({
      where: {
        id: pairId.value,
      },
      include: {
        users: {
          include: {
            user: {
              include: {
                userStatus: true,
              },
            },
          },
        },
      },
    })
    if (model === null) {
      throw new Error(`${pairId}が見つかりませんでした`)
    }

    const users = model.users.map((pairUser) => {
      return User.createFromRepository({
        id: new UserId(pairUser.user.id),
        name: pairUser.user.name,
        mailAddress: pairUser.user.mailAddress,
        status: new UserStatus(pairUser.user.userStatus.name),
      })
    })

    const entity = new Pair({
      id: new PairId(model.id),
      name: model.name,
      users: users,
    })
    return entity
  }

  public async findByUserId(userId: UserId): Promise<Pair | null> {
    const model = await this.prismaClient.pair.findFirst({
      where: {
        users: {
          some: {
            userId: userId.value,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              include: {
                userStatus: true,
              },
            },
          },
        },
      },
    })
    if (model === null) {
      return model
    }

    const users = model.users.map((pairUser) => {
      return User.createFromRepository({
        id: new UserId(pairUser.user.id),
        name: pairUser.user.name,
        mailAddress: pairUser.user.mailAddress,
        status: new UserStatus(pairUser.user.userStatus.name),
      })
    })

    const entity = new Pair({
      id: new PairId(model.id),
      name: model.name,
      users: users,
    })
    return entity
  }

  public async save(pair: Pair): Promise<Pair> {
    const { id, name, pairUsers } = pair.getAllProperties()

    const model = await this.prismaClient.pair.upsert({
      where: {
        id: id.value,
      },
      update: {
        name,
        users: {
          // ペアユーザー（子集約）全削除してcreateし直している（増減に対応するため）
          deleteMany: {},
          create: pairUsers.map((pairUser) => {
            return {
              userId: pairUser.getAllProperties().userId.value,
            }
          }),
        },
      },
      create: {
        id: id.value,
        name,
        users: {
          create: pairUsers.map((pairUser) => {
            return {
              userId: pairUser.getAllProperties().userId.value,
            }
          }),
        },
      },
      include: {
        users: {
          include: {
            user: {
              include: {
                userStatus: true,
              },
            },
          },
        },
      },
    })

    const userEntity = model.users.map((pairUser) => {
      return User.createFromRepository({
        id: new UserId(pairUser.user.id),
        name: pairUser.user.name,
        mailAddress: pairUser.user.mailAddress,
        status: new UserStatus(pairUser.user.userStatus.name),
      })
    })
    const entity = new Pair({
      id: new PairId(model.id),
      name: model.name,
      users: userEntity,
    })
    return entity
  }

  public async delete(pairId: PairId): Promise<void> {
    // 関連するテーブル（ペアユーザー）を削除
    await this.prismaClient.pair.update({
      where: {
        id: pairId.value,
      },
      data: {
        users: {
          deleteMany: {},
        },
      },
    })
    await this.prismaClient.pair.delete({
      where: {
        id: pairId.value,
      },
    })
  }

  public async deletePairUser(userId: UserId): Promise<void> {
    await this.prismaClient.pairUser.delete({
      where: {
        userId: userId.value,
      },
    })
  }
}
