export class ArrayHelper {
  public static lastItem<T>(array: T[]): T | undefined {
    if (!array) return undefined;
    return array[array.length - 1];
  }

  public static filterTwoParts<T>(
    array: T[],
    callback: (x: T, i: number) => boolean
  ): [T[], T[]] {
    return array.reduce<[T[], T[]]>(
      (acc, curr, index) => {
        if (callback(curr, index)) {
          acc[0].push(curr);
        } else {
          acc[1].push(curr);
        }
        return acc;
      },
      [[], []]
    );
  }
}
