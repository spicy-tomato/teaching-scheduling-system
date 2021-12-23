export class ArrayHelper {
  public static lastItem<T>(array: T[]): T | undefined {
    if (!array) return undefined;
    return array[array.length - 1];
  }
}
