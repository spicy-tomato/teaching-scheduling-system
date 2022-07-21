export class ArrayHelper {
  /** SEARCH */
  public static lastItem<T>(array: T[]): T | undefined {
    if (!array) return undefined;
    return this.lastItemTruthy(array);
  }

  public static lastItemTruthy<T>(array: T[]): T {
    return array[array.length - 1];
  }

  public static onlyIn<T>(a: T[], b: T[]): T[] {
    return a.filter((x) => !b.includes(x));
  }

  public static includesArray<T>(source: T[], arr: T[]): boolean {
    return arr.every((x) => source.includes(x));
  }

  /** TRANSFORM */
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

  public static removeAt<T>(array: T[], index: number | number[]): void {
    if (typeof index === 'number') {
      array.splice(index, 1);
      return;
    }

    index.sort((a, b) => b - a);
    for (let i = 0; i < index.length; i++) {
      array.splice(index[i], 1);
    }
  }

  public static insertAt<T>(array: T[], index: number, item: T): void {
    array.splice(index, 0, item);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static mergeWith<T extends Record<string, any>>(
    prop: string,
    ...arrays: T[][]
  ): T[] {
    let result = arrays[0];

    for (let i = 1; i < arrays.length; i++) {
      result = result.concat(
        arrays[i].filter((x) => !result.find((y) => y[prop] === x[prop]))
      );
    }

    return result;
  }

  /** COMPARE */
  public static equals<T>(a: T[], b: T[]): boolean {
    return this.onlyIn(a, b).length === 0 && this.onlyIn(b, a).length === 0;
  }

  /** CHECK TYPE */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isArray(a: any): boolean {
    return !!a && a.constructor === Array;
  }
}
