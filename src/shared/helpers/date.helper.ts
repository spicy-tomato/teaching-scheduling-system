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

  public static fromShift(date: Date, shift: number): [Date, Date] {
    const end = new Date(date.getTime());

    switch (shift) {
      case 1:
        date.setHours(7);
        end.setHours(9);
        end.setMinutes(25);
        break;
      case 2:
        date.setHours(9);
        date.setMinutes(35);
        end.setHours(12);
        break;
      case 3:
        date.setHours(13);
        end.setHours(15);
        end.setMinutes(25);
        break;
      case 4:
        date.setHours(15);
        date.setMinutes(35);
        end.setHours(18);
        break;
      case 5:
        date.setHours(19);
        end.setHours(21);
        end.setMinutes(25);
        break;
    }

    return [date, end];
  }
}
