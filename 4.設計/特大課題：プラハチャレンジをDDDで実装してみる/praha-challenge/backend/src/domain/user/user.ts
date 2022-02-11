import { UserId } from './user-id'
import { UserStatus } from './user-status'

type UserProps = {
  id: UserId
  name: string
  mailAddress: string
  status: UserStatus
}

export class User {
  private id: UserId
  private name: string
  private mailAddress: string
  private status: UserStatus

  private constructor(props: UserProps) {
    const { id, name, mailAddress, status } = props

    this.id = id
    this.name = name
    this.mailAddress = mailAddress
    this.status = status
  }

  public static createFromFactory(props: UserProps): User {
    return new User(props)
  }

  public static createFromRepository(props: UserProps): User {
    return new User(props)
  }

  public changeStatusFromUserService(status: UserStatus): User {
    this.status = status
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      mailAddress: this.mailAddress,
      status: this.status,
    }
  }
}
