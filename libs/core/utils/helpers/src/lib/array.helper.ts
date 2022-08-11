export class ArrayHelper {
  // SEARCH
  /**
   * Get the last item of the array.
   * @param array
   * @returns Returns the last value of the array if it exists
   * @example
   * ArrayHelper.lastItem([1, 2, 3])
   * // returns 3
   * @example
   * ArrayHelper.lastItem([]);
   * // returns undefined
   */
  static lastItem<T>(array: T[]): T | undefined {
    if (!array) return undefined;
    return this.lastItemTruthy(array);
  }

  /**
   * Get the last item of the array. Developer must make sure that it exists.
   * @param array
   * @returns Returns the last value of the array
   * @example
   * ArrayHelper.lastItemTruthy([1, 2, 3])
   * // returns 3
   */
  static lastItemTruthy<T>(array: T[]): T {
    return array[array.length - 1];
  }

  /**
   * Get the elements in an array which are not in other array.
   * @param a source array to check elements in it
   * @param b comparison array
   * @returns The array of elements that is in `a` but not in `b`
   * @example
   * ArrayHelper.onlyIn([1, 2, 3, 4, 5, 6], [0, 2, 4])
   * // returns [1, 3, 5, 6]
   */
  static onlyIn<T>(a: T[], b: T[]): T[] {
    return a.filter((x) => !b.includes(x));
  }

  /**
   * Check if an array is a subset of other array.
   * @param source source array to check elements in it
   * @param arr the superset
   * @returns `source` is the subset of `arr` or not
   * @example
   * ArrayHelper.isSubset([1], [1, 2, 3])
   * // returns true
   * @example
   * ArrayHelper.isSubset([2, 3, 4], [1, 2, 3])
   * // returns false
   */
  static isSubset<T>(source: T[], arr: T[]): boolean {
    return source.every((x) => arr.includes(x));
  }

  // TRANSFORM
  /**
   * Divide an array into 2 parts, base on a callback condition function.
   * @param array
   * @param callback
   * @returns The `array` that separated by `callback` condition. First if true, second if false
   * @example
   * ArrayHelper.filterTwoParts([2, 3, 4, 5, 6], (value, index) => value % 2 === 0 && index > 0)
   * // returns [[4, 6], [2, 3, 5]]
   */
  static filterTwoParts<T>(
    array: T[],
    callback: (value: T, index: number) => boolean
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

  /**
   * Merge multiple arrays, use a property to compare objects.
   * @param prop property of object for comparison
   * @param arrays
   * @returns An array which was merged by `arrays`, according property `prop`
   * @example
   * ArrayHelper.mergeWith('id', [{id: 0, value: 0}, {id: 1, value: 1}], [{id: 0, value: 1}])
   * // returns [{id: 0, value: 0}, {id: 1, value: 1}]
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static mergeWith<T extends Record<string, any>>(
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

  // COMPARE
  /**
   * Compare two arrays, ignore position and number of appearance of elements.
   * @param a
   * @param b
   * @returns two arrays are equal or not
   * @example
   * ArrayHelper.equals([0, 0, 1, 2], [0, 1, 2, 2, 0])
   * // returns true
   */
  static equals<T>(a: T[], b: T[]): boolean {
    return this.onlyIn(a, b).length === 0 && this.onlyIn(b, a).length === 0;
  }

  // CHECK TYPE
  /**
   * Check if a variable is an array.
   * @param a
   * @returns `a` is an array or not
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isArray(a: any): boolean {
    return !!a && a.constructor === Array;
  }
}
