import * as faker from 'faker'
import { User } from 'src/domain/user/user'
import { UserId } from 'src/domain/user/user-id'
import { UserStatus } from 'src/domain/user/user-status'

export const createUser = (params: {
  id?: string
  name?: string
  mailAddress?: string
  status?: UserStatus
}) => {
  const { name, mailAddress, status } = params
  const id = params.id ?? faker.random.uuid()
  return User.createFromRepository({
    id: new UserId(id),
    name: name ?? 'A',
    mailAddress: mailAddress ?? 'B',
    status: status ?? new UserStatus(UserStatus.active),
  })
}
