import { isEmpty } from 'class-validator'
import ValueObject from '../shared/value-object'

export class PairId extends ValueObject<string, 'PairId'> {
  public constructor(value: string) {
    super(value)
    if (isEmpty(value)) {
      throw new Error('PairIdの値が空です')
    }
  }
}
