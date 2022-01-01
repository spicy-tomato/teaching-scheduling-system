import { StringHelper } from './string.helper';

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

  // eslint-disable-next-line @typescript-eslint/ban-types
  public static toSnakeCase(obj: Object): Record<string, unknown> {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = StringHelper.toSnakeCase(key);
      if (Array.isArray(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result[newKey] = value.reduce((v) => this.toSnakeCase(v));
      } else if (typeof value === 'object' && value !== null) {
        result[newKey] = this.toSnakeCase(value);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result[newKey] = value;
      }
    }
    return result;
  }
}
