import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayIncludes',
})
export class ArrayIncludesPipe<T> implements PipeTransform {
  public transform(array: T[], value: T): boolean {
    return array.includes(value);
  }
}
