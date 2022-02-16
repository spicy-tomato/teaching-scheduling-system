import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'beautifyTime',
})
export class BeautifyTimePipe implements PipeTransform {
  public transform(value: number): string {
    return `0${value}`.slice(-2);
  }
}
