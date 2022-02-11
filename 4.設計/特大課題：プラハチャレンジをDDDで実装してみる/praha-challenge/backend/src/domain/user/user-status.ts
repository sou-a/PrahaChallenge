import ValueObject from '../shared/value-object'

export class UserStatus extends ValueObject<string, 'UserStatus'> {
  static readonly active = '在籍中'
  static readonly recess = '休会中'
  static readonly leave = '退会済'
  static readonly statusList = [
    UserStatus.active,
    UserStatus.recess,
    UserStatus.leave,
  ]

  constructor(value: string) {
    super(value)
    if (!UserStatus.statusList.includes(value)) {
      throw new Error('存在しない在籍ステータスです')
    }
  }

  public getStatus() {
    return this.value
  }

  public isActive(): boolean {
    return this.equals(new UserStatus(UserStatus.active))
  }
}
