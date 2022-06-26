import { TuiDay } from '@taiga-ui/cdk';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';

export class DateHelper {
  /** To string */
  public static beautifyTime(dt: Date): string {
    return [
      DateHelper.beautifyDay(dt.getHours()),
      DateHelper.beautifyDay(dt.getMinutes()),
    ].join(':');
  }

  public static beautifyDay(day: number): string {
    return `0${day}`.slice(-2);
  }

  public static toDateOnlyString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public static toSqlDate(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  /** From other types */
  public static fromShift(date: Date, shift: string): [Date, Date] {
    const end = new Date(date.getTime());
    const map = CoreConstant.SHIFTS;

    date.setHours(map[shift].start[0]);
    date.setMinutes(map[shift].start[1]);
    end.setHours(map[shift].end[0]);
    end.setMinutes(map[shift].end[1]);

    return [date, end];
  }

  /** To other types */
  public static toTuiDay(date: Date): TuiDay {
    return new TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /** Calculation */
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

  public static subtract(day: Date, amount: number): Date {
    day.setDate(day.getDate() - amount);
    return day;
  }

  public static sameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  /** Factory */
  public static dateAtZero(date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
