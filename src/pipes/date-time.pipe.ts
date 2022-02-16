import { Pipe, PipeTransform } from '@angular/core';
import { DateHelper } from '@shared/helpers';

@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  public transform(from: Date, to: Date): string {
    if (DateHelper.sameDay(from, to)) {
      return `${from.getDate()} Tháng ${
        from.getMonth() + 1
      }, ${from.getFullYear()} 
      (${DateHelper.beautifyTime(from)} - ${DateHelper.beautifyTime(to)})`;
    }

    return `${from.getDate()} Tháng ${
      from.getMonth() + 1
    }, ${from.getFullYear()} 
    (${DateHelper.beautifyTime(from)}) -
    ${to.getDate()} Tháng ${to.getMonth() + 1}, ${to.getFullYear()} 
    (${DateHelper.beautifyTime(to)})`;
  }
}
