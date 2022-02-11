import { PrismaClient } from '@prisma/client'
import { ITeamRepository } from 'src/domain/team/i-team-repository'
import { Team } from 'src/domain/team/team'
import { TeamId } from 'src/domain/team/team-id'
import { User } from 'src/domain/user/user'
import { UserId } from 'src/domain/user/user-id'
import { UserStatus } from 'src/domain/user/user-status'

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<Team[]> {
    const models = await this.prismaClient.team.findMany({
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
    const entities: Team[] = models.map(
      (model): Team => {
        const users = model.users.map((teamUser) => {
          return User.createFromRepository({
            id: new UserId(teamUser.user.id),
            name: teamUser.user.name,
            mailAddress: teamUser.user.mailAddress,
            status: new UserStatus(teamUser.user.userStatus.name),
          })
        })
        return Team.createFromRepository({
          id: new TeamId(model.id),
          name: model.name,
          users: users,
        })
      },
    )
    return entities
  }

  public async findById(teamId: TeamId): Promise<Team> {
    const model = await this.prismaClient.team.findUnique({
      where: {
        id: teamId.value,
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
      throw new Error(`teamId: ${teamId.value}が見つかりませんでした`)
    }

    const users = model.users.map((teamUser) => {
      return User.createFromRepository({
        id: new UserId(teamUser.user.id),
        name: teamUser.user.name,
        mailAddress: teamUser.user.mailAddress,
        status: new UserStatus(teamUser.user.userStatus.name),
      })
    })

    const entity = Team.createFromRepository({
      id: new TeamId(model.id),
      name: model.name,
      users: users,
    })
    return entity
  }

  public async findByUserId(userId: UserId): Promise<Team | null> {
    const model = await this.prismaClient.team.findFirst({
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

    const users = model.users.map((teamUser) => {
      return User.createFromRepository({
        id: new UserId(teamUser.user.id),
        name: teamUser.user.name,
        mailAddress: teamUser.user.mailAddress,
        status: new UserStatus(teamUser.user.userStatus.name),
      })
    })

    const entity = Team.createFromRepository({
      id: new TeamId(model.id),
      name: model.name,
      users: users,
    })
    return entity
  }

  public async findByName(name: string): Promise<Team | null> {
    const model = await this.prismaClient.team.findUnique({
      where: {
        name: name,
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
      return null
    }

    const users = model.users.map((teamUser) => {
      return User.createFromRepository({
        id: new UserId(teamUser.user.id),
        name: teamUser.user.name,
        mailAddress: teamUser.user.mailAddress,
        status: new UserStatus(teamUser.user.userStatus.name),
      })
    })

    const entity = Team.createFromRepository({
      id: new TeamId(model.id),
      name: model.name,
      users: users,
    })
    return entity
  }

  public async findLeastTeamUsersTeam(
    exceptTeamId: TeamId,
  ): Promise<Team | null> {
    const teamsCountUsers = await this.prismaClient.team.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      where: {
        NOT: {
          id: exceptTeamId.value,
        },
      },
    })
    const mostLeastTeam = teamsCountUsers.reduce((a, b) => {
      if (!a._count || !b._count) {
        throw new Error('想定外のエラー')
      }
      return a._count.users < b._count.users ? a : b
    })

    const model = await this.prismaClient.team.findUnique({
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
      where: {
        id: mostLeastTeam.id,
      },
    })
    if (model === null) {
      return model
    }
    const userEntity = model.users.map((teamUser) => {
      return User.createFromRepository({
        id: new UserId(teamUser.user.id),
        name: teamUser.user.name,
        mailAddress: teamUser.user.mailAddress,
        status: new UserStatus(teamUser.user.userStatus.name),
      })
    })

    return Team.createFromRepository({
      id: new TeamId(model.id),
      name: model.name,
      users: userEntity,
    })
  }

  public async save(team: Team): Promise<Team> {
    const { id, name, teamUsers } = team.getAllProperties()

    const model = await this.prismaClient.team.upsert({
      where: {
        id: id.value,
      },
      update: {
        name,
        users: {
          deleteMany: {},
          create: teamUsers.map((teamUser) => {
            return {
              userId: teamUser.getAllProperties().userId.value,
            }
          }),
        },
      },
      create: {
        id: id.value,
        name,
        users: {
          create: teamUsers.map((teamUser) => {
            return {
              userId: teamUser.getAllProperties().userId.value,
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

    const userEntity = model.users.map((teamUser) => {
      return User.createFromRepository({
        id: new UserId(teamUser.user.id),
        name: teamUser.user.name,
        mailAddress: teamUser.user.mailAddress,
        status: new UserStatus(teamUser.user.userStatus.name),
      })
    })
    const entity = Team.createFromRepository({
      id: new TeamId(model.id),
      name: model.name,
      users: userEntity,
    })
    return entity
  }

  public async delete(teamId: TeamId): Promise<void> {
    // 関連するテーブル（チームユーザー）を削除
    await this.prismaClient.team.update({
      where: {
        id: teamId.value,
      },
      data: {
        users: {
          deleteMany: {},
        },
      },
    })
    await this.prismaClient.team.delete({
      where: {
        id: teamId.value,
      },
    })
  }

  public async deleteTeamUser(userId: UserId): Promise<void> {
    await this.prismaClient.teamUser.delete({
      where: {
        userId: userId.value,
      },
    })
  }
}
