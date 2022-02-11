import * as faker from 'faker'
import { Team } from 'src/domain/team/team'
import { User } from 'src/domain/user/user'
import { TeamId } from 'src/domain/team/team-id'
import { prisma } from '@testUtil/prisma'
import { seedUser } from '@testUtil/user/seed-user'

export const seedTeam = async (params: { id?: string; name?: string }) => {
  let { id, name } = params
  id = id ?? faker.random.uuid()
  name = name ?? `${faker.random.number(999)}`
  await prisma.team.create({
    data: {
      id,
      name,
    },
  })
}

export const seedTeamUser = async (params: {
  userId?: string
  teamId?: string
}) => {
  let { userId, teamId } = params
  userId = userId ?? faker.random.uuid()
  teamId = teamId ?? faker.random.uuid()
  await prisma.teamUser.create({
    data: {
      userId,
      teamId,
    },
  })
}

export const seedTeamAndUsers = async (params: {
  id?: string
  name?: string
  users?: User[]
}) => {
  let { id, name } = params
  const { users } = params

  id = id ?? faker.random.uuid()
  name = name ?? `${faker.random.number(999)}`

  await prisma.team.create({
    data: {
      id,
      name,
    },
  })

  if (users) {
    await Promise.all(
      users.map(async (user: User) => {
        id = id ?? faker.random.uuid()
        await seedUser({
          id: user.getAllProperties().id.value,
        })
        await prisma.teamUser.create({
          data: {
            userId: user.getAllProperties().id.value,
            teamId: id,
          },
        })
      }),
    )
    return Team.createFromRepository({ id: new TeamId(id), name, users })
  }

  const userId = faker.random.uuid()
  const userId2 = faker.random.uuid()
  const userId3 = faker.random.uuid()
  const user1 = await seedUser({
    id: userId,
  })
  const user2 = await seedUser({
    id: userId2,
  })
  const user3 = await seedUser({
    id: userId3,
  })

  await prisma.teamUser.createMany({
    data: [
      {
        userId,
        teamId: id,
      },
      {
        userId: userId2,
        teamId: id,
      },
      {
        userId: userId3,
        teamId: id,
      },
    ],
  })
  return Team.createFromRepository({
    id: new TeamId(id),
    name,
    users: [user1, user2, user3],
  })
}
