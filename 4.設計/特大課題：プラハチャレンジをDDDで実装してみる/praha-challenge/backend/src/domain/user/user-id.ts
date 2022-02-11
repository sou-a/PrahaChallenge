import { isEmpty } from 'class-validator'
import ValueObject from '../shared/value-object'

export class UserId extends ValueObject<string, 'UserId'> {
  public constructor(value: string) {
    super(value)
    if (isEmpty(value)) {
      throw new Error('UserIdの値が空です')
    }
  }
}
