import { CoreConstant } from '@shared/constants';
import { TuiDay } from '@taiga-ui/cdk';

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

  public static fromShift(date: Date, shift: string): [Date, Date] {
    const end = new Date(date.getTime());
    const map = CoreConstant.SHIFTS;

    date.setHours(map[shift].start[0]);
    date.setMinutes(map[shift].start[1]);
    end.setHours(map[shift].end[0]);
    end.setMinutes(map[shift].end[1]);

    return [date, end];
  }

  public static toTuiDay(date: Date): TuiDay {
    return new TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public static weekIncludedByTwoMonths(date: Date): boolean {
    const dow = date.getDay();
    const first = new Date(date);
    const last = new Date(date);
    const lastSunday = date.getDate() - dow;

    if (dow) {
      first.setDate(lastSunday + 1);
      last.setDate(lastSunday + 1);
    } else {
      first.setDate(date.getDate() - 6);
    }

    return first.getMonth() === last.getMonth();
  }

  public static toDateOnlyString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public static toSqlDate(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
}
