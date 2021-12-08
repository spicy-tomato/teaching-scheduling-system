import { Pipe, PipeTransform } from '@angular/core';
import { beautifyTime } from 'src/helpers';

@Pipe({
  name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
  public transform(from: Date, to: Date): string {
    if (
      from.getDate() === to.getDate() &&
      from.getMonth() === to.getMonth() &&
      from.getFullYear() === to.getFullYear()
    ) {
      return `${from.getDate()} Tháng ${from.getMonth()}, ${from.getFullYear()} 
      (${beautifyTime(from)} - ${beautifyTime(to)})`;
    }

    return `${from.getDate()} Tháng ${from.getMonth()}, ${from.getFullYear()} 
    (${beautifyTime(from)}) -
    ${to.getDate()} Tháng ${to.getMonth()}, ${to.getFullYear()} 
    (${beautifyTime(to)})`;
  }
}
