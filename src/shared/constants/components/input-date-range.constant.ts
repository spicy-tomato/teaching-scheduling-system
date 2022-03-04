import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TuiDayRangePeriod } from '@taiga-ui/kit';

export class InputDateRangeConstant {
  public static getPeriods(): ReadonlyArray<TuiDayRangePeriod> {
    const today = TuiDay.currentLocal();
    const startOfMonth = today.append({ day: 1 - today.day });
    const startOfYear = new TuiDay(today.year, 0, 1);

    return [
      new TuiDayRangePeriod(
        new TuiDayRange(
          startOfMonth,
          startOfMonth.append({ month: 1, day: -1 })
        ),
        'Tháng này'
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(
          startOfMonth.append({ month: -1 }),
          startOfMonth.append({ day: -1 })
        ),
        'Tháng trước'
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(startOfYear, startOfYear.append({ year: 1, day: -1 })),
        'Năm nay'
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(
          startOfYear.append({ year: -1 }),
          startOfYear.append({ day: -1 })
        ),
        'Năm trước'
      ),
    ];
  }
}
