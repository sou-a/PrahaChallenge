import { createRandomIdString } from 'src/util/random'
import { IUserRepository } from './i-user-repository'
import { User } from './user'
import { UserId } from './user-id'
import { UserStatus } from './user-status'

export class UserFactory {
  userRepository: IUserRepository
  constructor(props: { userRepository: IUserRepository }) {
    const { userRepository } = props

    this.userRepository = userRepository
  }

  public async createUser(props: {
    name: string
    mailAddress: string
    status: UserStatus
  }): Promise<User> {
    const { name, mailAddress, status } = props
    const user = await this.userRepository.findByMailAddress(mailAddress)
    // - 重複不可
    if (user) {
      throw new Error('メールアドレスが重複しています')
    }
    return User.createFromFactory({
      id: new UserId(createRandomIdString()),
      name,
      mailAddress,
      status,
    })
  }
}
