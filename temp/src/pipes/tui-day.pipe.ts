import { Pipe, PipeTransform } from '@angular/core';
import { TuiDay } from '@taiga-ui/cdk';

@Pipe({
  name: 'tuiDay',
})
export class TuiDayPipe implements PipeTransform {
  public transform(date: Date): TuiDay {
    return TuiDay.fromLocalNativeDate(date);
  }
}
