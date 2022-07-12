import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
})
export class StatusColorPipe implements PipeTransform {
  transform(statusCode: number): string {
    switch (true) {
      case statusCode === 100 || (500 <= statusCode && statusCode < 600):
        return 'text-tui-text-negative';
      case (200 <= statusCode && statusCode < 300) || statusCode === 400:
        return 'text-tui-neutral-fill';
      case 300 <= statusCode && statusCode < 400:
        return 'text-tui-text-positive';
      case statusCode === 202:
        return 'text-tui-text-link';
      default:
        return '';
    }
  }
}
