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

  public static equals<T>(a: T[], b: T[]): boolean {
    return this.onlyIn(a, b).length === 0 && this.onlyIn(b, a).length === 0;
  }

  public static onlyIn<T>(a: T[], b: T[]): T[] {
    return a.filter((x) => !b.includes(x));
  }

  public static mergeWith<T>(prop: string, ...arrays: T[][]): T[] {
    let result = arrays[0];

    for (let i = 1; i < arrays.length; i++) {
      result = result.concat(
        arrays[i].filter((x) => !result.find((y) => y[prop] === x[prop]))
      );
    }

    return result;
  }

  public static removeAt<T>(array: T[], index: number): void {
    array.splice(index, 1);
  }

  public static insertAt<T>(array: T[], index: number, item: T): void {
    array.splice(index, 0, item);
  }
}
