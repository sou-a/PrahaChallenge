import { PrismaClient } from '@prisma/client'
import { IUserRepository } from 'src/domain/user/i-user-repository'
import { User } from 'src/domain/user/user'
import { UserId } from 'src/domain/user/user-id'
import { UserStatus } from 'src/domain/user/user-status'

export class UserRepository implements IUserRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<User[]> {
    const models = await this.prismaClient.user.findMany({
      include: {
        userStatus: true,
      },
    })
    const entity: User[] = models.map(
      (model): User => {
        return User.createFromRepository({
          id: new UserId(model.id),
          name: model.name,
          mailAddress: model.mailAddress,
          status: new UserStatus(model.userStatus.name),
        })
      },
    )
    return entity
  }

  public async findById(userId: UserId): Promise<User> {
    const userModel = await this.prismaClient.user.findUnique({
      where: {
        id: userId.value,
      },
      include: {
        userStatus: true,
      },
    })
    if (userModel === null) {
      throw new Error(`userId: ${userId.value}が見つかりませんでした`)
    }

    const entity = User.createFromRepository({
      id: new UserId(userModel.id),
      name: userModel.name,
      mailAddress: userModel.mailAddress,
      status: new UserStatus(userModel.userStatus.name),
    })
    return entity
  }

  public async findByMailAddress(mailAddress: string): Promise<User | null> {
    const userModel = await this.prismaClient.user.findFirst({
      where: {
        mailAddress,
      },
      include: {
        userStatus: true,
      },
    })
    if (userModel === null) {
      return null
    }

    const entity = User.createFromRepository({
      id: new UserId(userModel.id),
      name: userModel.name,
      mailAddress: userModel.mailAddress,
      status: new UserStatus(userModel.userStatus.name),
    })
    return entity
  }

  public async save(user: User): Promise<User> {
    const { id, name, mailAddress, status } = user.getAllProperties()

    const userStatusModel = await this.prismaClient.userStatus.findUnique({
      where: {
        name: status.getStatus(),
      },
    })
    if (userStatusModel === null) {
      throw new Error('ステータスが見つかりませんでした')
    }

    const savedUsermodel = await this.prismaClient.user.upsert({
      where: {
        id: id.value,
      },
      update: {
        name,
        mailAddress,
        userStatusId: userStatusModel.id,
      },
      create: {
        id: id.value,
        name,
        mailAddress,
        userStatusId: userStatusModel.id,
      },
    })
    const savedUserEntity = User.createFromRepository({
      id: new UserId(savedUsermodel.id),
      name: savedUsermodel.name,
      mailAddress: savedUsermodel.mailAddress,
      status: new UserStatus(userStatusModel.name),
    })
    return savedUserEntity
  }

  public async delete(userId: UserId): Promise<void> {
    await this.prismaClient.user.delete({
      where: {
        id: userId.value,
      },
    })
  }
}
