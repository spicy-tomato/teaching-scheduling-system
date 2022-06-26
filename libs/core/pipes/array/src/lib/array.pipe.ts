import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'array',
})
export class ArrayPipe<T> implements PipeTransform {
  transform(array: T[], op: 'includes', args: T): boolean {
    if (op === 'includes') {
      return array.includes(args);
    }

    throw `Operation "${op}" is invalid`;
  }
}
