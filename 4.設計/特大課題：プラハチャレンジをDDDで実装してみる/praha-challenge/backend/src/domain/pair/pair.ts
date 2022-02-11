import { UserStatus } from 'src/domain/user/user-status'
import { User } from '../user/user'
import { UserId } from '../user/user-id'
import { PairId } from './pair-id'

export class Pair {
  private id: PairId
  private name: string
  private pairUsers: PairUser[]

  readonly pairUsersLowerLimit = 2
  readonly pairUsersUpperLimit = 3
  readonly nameRuleRegex = /^[A-Za-z]$/

  public constructor(props: { id: PairId; name: string; users: User[] }) {
    const { id, name, users } = props

    // ユーザーを詰め替えてペアユーザーインスタンス生成
    const pairUsers = users.map((user) => {
      const userProperties = user.getAllProperties()

      return new PairUser({
        pairId: this.id,
        userId: userProperties.id,
        status: userProperties.status,
      })
    })

    // - 名前がある（a,b,c,d,eのような英文字かつ１文字でなければいけない）
    if (name.match(this.nameRuleRegex) === null) {
      throw new Error('ペア名は英字のみです')
    }

    // - 参加者2名以上から成る
    if (pairUsers.length < this.pairUsersLowerLimit) {
      throw new Error(`ペアユーザーは${this.pairUsersLowerLimit}名以上必要です`)
    }

    // - 上限は3名まで。4名以上のペアは存続できない（他のペアに合併する必要がある）
    if (pairUsers.length > this.pairUsersUpperLimit) {
      throw new Error(
        `ペアユーザーは${this.pairUsersUpperLimit}名以下である必要があります`,
      )
    }

    this.id = id
    this.name = name
    this.pairUsers = pairUsers
  }

  /**
   * ペアユーザーを追加する
   * @param user
   */
  public addPairUser(user: User): Pair {
    // - 上限は3名まで。4名以上のペアは存続できない（他のペアに合併する必要がある）
    if (this.pairUsers.length === this.pairUsersUpperLimit) {
      throw new Error(
        `ペアユーザーは${this.pairUsersUpperLimit}名以下である必要があります`,
      )
    }
    const userProperties = user.getAllProperties()

    const teamUser = new PairUser({
      pairId: this.id,
      userId: userProperties.id,
      status: userProperties.status,
    })
    this.pairUsers.push(teamUser)
    return this
  }

  /**
   * ペアユーザーを削除する
   * @param user
   */
  public removePairUser(userId: UserId): Pair {
    const removedPairUser = this.pairUsers.filter(
      (pairUser) => !userId.equals(pairUser.getAllProperties().userId),
    )
    // - 参加者2名以上から成る
    if (removedPairUser.length < this.pairUsersLowerLimit) {
      throw new Error(`ペアユーザーは${this.pairUsersLowerLimit}名以上必要です`)
    }
    this.pairUsers = removedPairUser
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      pairUsers: this.pairUsers,
    }
  }
}

class PairUser {
  private pairId: PairId
  private userId: UserId
  private status: UserStatus

  public constructor(props: {
    pairId: PairId
    userId: UserId
    status: UserStatus
  }) {
    const { pairId, userId, status } = props

    // - 参加者の在籍ステータスが「休会中」か「退会済み」の場合どのペアにも所属してはいけない
    if (!status.isActive()) {
      throw new Error(
        `${UserStatus.active}ではないユーザーはペアに所属できません`,
      )
    }

    this.pairId = pairId
    this.userId = userId
    this.status = status
  }

  public getAllProperties() {
    return {
      pairId: this.pairId,
      userId: this.userId,
      status: this.status,
    }
  }
}
