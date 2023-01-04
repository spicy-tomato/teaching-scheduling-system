import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TuiDayRangePeriod } from '@taiga-ui/kit';

export class InputDateRangeConstant {
  static getPeriods(): ReadonlyArray<TuiDayRangePeriod> {
    const today = TuiDay.currentLocal();
    const startOfMonth = today.append({ day: 1 - today.day });
    const startOfYear = new TuiDay(today.year, 0, 1);

    return [
      new TuiDayRangePeriod(
        new TuiDayRange(
          startOfMonth,
          startOfMonth.append({ month: 1, day: -1 })
        ),
        `Tháng hiện tại (tháng ${startOfMonth.month + 1})`
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(
          startOfMonth.append({ month: -1 }),
          startOfMonth.append({ day: -1 })
        ),
        `Tháng trước (tháng ${startOfMonth.month || 12})`
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(startOfYear, startOfYear.append({ year: 1, day: -1 })),
        `Năm hiện tại (năm ${startOfYear.year})`
      ),
      new TuiDayRangePeriod(
        new TuiDayRange(
          startOfYear.append({ year: -1 }),
          startOfYear.append({ day: -1 })
        ),
        `Năm trước (năm ${startOfYear.year - 1})`
      ),
    ];
  }

  static getPreviousMonthRange(): TuiDayRange {
    return this.getPeriods()[1].range;
  }
}
