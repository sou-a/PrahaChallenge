import { isEmpty } from 'class-validator'
import ValueObject from '../shared/value-object'

export class TaskGroupId extends ValueObject<string, 'TaskGroupId'> {
  public constructor(value: string) {
    super(value)
    if (isEmpty(value)) {
      throw new Error('TaskGroupIdの値が空です')
    }
  }
}
