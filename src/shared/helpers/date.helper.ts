export class DateHelper {
  public static beautifyTime(dt: Date): string {
    const hours = `0${dt.getHours()}`.slice(-2);
    const minutes = `0${dt.getMinutes()}`.slice(-2);
    return `${hours}:${minutes}`;
  }

  public static beautifyDay(day: number): string {
    return `0${day}`.slice(-2);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public static dateTimeReviver(_: any, value: any): any {
    if (typeof value === 'string') {
      const date = Date.parse(value);
      if (date) {
        return new Date(date);
      }
    }
    return value;
  }
}
