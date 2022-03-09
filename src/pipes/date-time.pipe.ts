import { Pipe, PipeTransform } from '@angular/core';
import { DateHelper } from '@shared/helpers';

@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  public transform(from: Date, to: Date): string {
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
