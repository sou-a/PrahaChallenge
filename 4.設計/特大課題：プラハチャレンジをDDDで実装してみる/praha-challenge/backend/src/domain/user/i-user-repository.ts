import { User } from './user'
import { UserId } from './user-id'

export interface IUserRepository {
  findAll(): Promise<User[]>
  findById(userId: UserId): Promise<User>
  findByMailAddress(mailAddress: string): Promise<User | null>
  save(user: User): Promise<User>
  delete(userId: UserId): Promise<void>
}
