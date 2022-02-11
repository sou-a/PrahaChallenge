import { UserStatus } from 'src/domain/user/user-status'
import { prisma } from './prisma'

export const seedAllUserStatus = async () => {
  const data = [
    {
      id: '1',
      name: UserStatus.active,
    },
    {
      id: '2',
      name: UserStatus.recess,
    },
    {
      id: '3',
      name: UserStatus.leave,
    },
  ]

  await prisma.userStatus.createMany({
    data,
  })
}
