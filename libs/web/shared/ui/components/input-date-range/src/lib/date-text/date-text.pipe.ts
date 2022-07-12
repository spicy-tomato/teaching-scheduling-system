import { Pipe, PipeTransform } from '@angular/core';
import { TuiDayRange } from '@taiga-ui/cdk';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';

@Pipe({
  name: 'dateText',
})
export class DateTextPipe implements PipeTransform {
  public transform(range: Nullable<TuiDayRange>): string {
    if (!range) {
      return '';
    }

    const { from, to } = range;
    return `${from.day}.${from.month + 1}.${from.year} - ${to.day}.${
      to.month + 1
    }.${to.year}`;
  }
}
