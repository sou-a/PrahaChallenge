export default abstract class ValueObject<
  T extends string | number | boolean,
  U extends string
> {
  private _: U
  public readonly value: T
  public constructor(value: T) {
    this.value = value
    this._ = '' as U
  }

  public equals(obj: ValueObject<T, U>): boolean {
    return this.value === obj.value
  }
}
