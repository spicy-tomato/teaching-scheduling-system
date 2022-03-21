import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  public transform(value: string[], v: string): string[] {
    return value.filter((x) => x !== v);
  }
}
