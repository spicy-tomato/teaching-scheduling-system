type Item = {
  id: number | string;
  value: string;
};

export class ObjectHelper {
  public static objectToArray(obj: Record<number | string, string>): Item[] {
    const array: Item[] = [];
    Object.keys(obj).forEach((key) => {
      array.push({ id: key, value: obj[key] });
    });
    return array;
  }

  public static isNullOrUndefined(obj: unknown): boolean {
    return obj === null || obj === undefined;
  }
}
