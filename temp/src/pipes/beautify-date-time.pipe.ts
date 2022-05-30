import { Pipe, PipeTransform } from '@angular/core';
import { DateHelper } from '@shared/helpers';

@Pipe({
  name: 'beautifyTime',
})
export class BeautifyTimePipe implements PipeTransform {
  public transform(value: number): string {
    return DateHelper.beautifyDay(value);
  }
}
