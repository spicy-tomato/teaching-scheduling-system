import { Pipe, PipeTransform } from '@angular/core';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';

@Pipe({
  name: 'calendarDateTime',
})
export class CalendarDateTimePipe implements PipeTransform {
  transform(from: Date, to: Date): string {
    const fromDate = from.getDate();
    const fromMonth = from.getMonth() + 1;
    const fromYear = from.getFullYear();
    const fromTime = DateHelper.beautifyTime(from);
    const toTime = DateHelper.beautifyTime(to);

    if (DateHelper.sameDay(from, to)) {
      return `${fromDate} Tháng ${fromMonth}, ${fromYear} 
      (${fromTime} - ${toTime})`;
    }

    return `${fromDate} Tháng ${fromMonth}, ${fromYear} 
    (${fromTime}) -
    ${to.getDate()} Tháng ${to.getMonth() + 1}, ${to.getFullYear()} 
    (${toTime})`;
  }
}
