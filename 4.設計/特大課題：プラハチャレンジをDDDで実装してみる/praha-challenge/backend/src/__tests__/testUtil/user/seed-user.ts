import * as faker from 'faker'
import { User } from 'src/domain/user/user'
import { UserStatus } from 'src/domain/user/user-status'
import { UserId } from 'src/domain/user/user-id'
import { prisma } from '@testUtil/prisma'

export const seedUser = async (params: {
  id?: string
  name?: string
  mailAddress?: string
  userStatusId?: string
}) => {
  let { id, name, mailAddress, userStatusId } = params
  id = id ?? faker.random.uuid()
  name = name ?? faker.name.findName()
  mailAddress = mailAddress ?? 'B'
  userStatusId = userStatusId ?? '1'

  await prisma.user.create({
    data: {
      id,
      name,
      mailAddress,
      userStatusId,
    },
  })
  const userStatus = await prisma.userStatus.findFirst({
    where: {
      id: userStatusId,
    },
  })
  if (!userStatus) {
    throw new Error('想定外のエラー')
  }
  return User.createFromRepository({
    id: new UserId(id),
    name,
    mailAddress,
    status: new UserStatus(userStatus.name),
  })
}
