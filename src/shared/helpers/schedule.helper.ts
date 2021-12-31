import { ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule';

export class ScheduleHelper {
  public static dayInCurrentView(
    schedule: ScheduleComponent,
    view: View,
    date: Date = new Date()
  ): boolean {
    const currentViewDates = schedule.getCurrentViewDates();
    const first = currentViewDates[0];
    const last = currentViewDates[currentViewDates.length - 1];

    return (
      (view !== 'Day' && first <= date && date <= last) ||
      (view === 'Day' &&
        first.getDate() === date.getDate() &&
        first.getMonth() === date.getMonth() &&
        first.getFullYear() === date.getFullYear())
    );
  }
}
