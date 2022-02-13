import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSelf',
})
export class FilterSelfPipe implements PipeTransform {
  public transform(value: string[]): string[] {
    return value.filter((x) => x !== 'self');
  }
}
