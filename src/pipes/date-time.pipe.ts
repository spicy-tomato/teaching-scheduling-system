import { Pipe, PipeTransform } from '@angular/core';

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
      (${this.getTime(from)} - ${this.getTime(to)})`;
    }

    return `${from.getDate()} Tháng ${from.getMonth()}, ${from.getFullYear()} 
    (${this.getTime(from)}) -
    ${to.getDate()} Tháng ${to.getMonth()}, ${to.getFullYear()} 
    (${this.getTime(to)})`;
  }

  private getTime(dt: Date): string {
    const hours = `0${dt.getHours()}`.slice(-2);
    const minutes = `0${dt.getMinutes()}`.slice(-2);
    return `${hours}:${minutes}`;
  }
}
