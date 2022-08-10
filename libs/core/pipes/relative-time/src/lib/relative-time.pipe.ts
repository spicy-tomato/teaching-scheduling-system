import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(inputDate: string): string {
    const current = new Date().valueOf();
    const input = new Date(inputDate).valueOf();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - input;

    switch (true) {
      case elapsed < msPerMinute:
        return `${Math.round(elapsed / 1000)} giây trước`;
      case elapsed < msPerHour:
        return `${Math.round(elapsed / msPerMinute)} phút trước`;
      case elapsed < msPerDay:
        return `${Math.round(elapsed / msPerHour)} giờ trước`;
      case elapsed < msPerMonth:
        return `${Math.round(elapsed / msPerDay)} ngày trước`;
      case elapsed < msPerYear:
        return `${Math.round(elapsed / msPerMonth)} tháng trước`;
      default:
        return `${Math.round(elapsed / msPerYear)} năm trước`;
    }
  }
}
