import { isEmpty } from 'class-validator'
import ValueObject from '../shared/value-object'

export class TeamId extends ValueObject<string, 'TeamId'> {
  public constructor(value: string) {
    super(value)
    if (isEmpty(value)) {
      throw new Error('TeamIdの値が空です')
    }
  }
}
