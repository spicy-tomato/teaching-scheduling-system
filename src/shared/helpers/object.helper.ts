import { StringHelper } from './string.helper';

type Item<T> = {
  id: number | string;
  value: T;
};

export class ObjectHelper {
  public static toArray<T>(
    obj: Record<number | string, T>,
    options?: {
      uniqueValue?: boolean;
    }
  ): Item<T>[] {
    const array: Item<T>[] = [];
    Object.keys(obj).forEach((key) => {
      if (options?.uniqueValue && array.find((x) => x.value === obj[key])) {
        return;
      }
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

  public static parseDateProperties<T>(obj: T, props: string[]): T {
    props.forEach((prop) => {
      obj[prop] = new Date(obj[prop]);
    });
    return obj;
  }
}
