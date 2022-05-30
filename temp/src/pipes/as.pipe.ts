import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'as',
})
export class AsPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
  public transform<T>(value: any, _: new (...args: any[]) => T): T {
    return value as T;
  }
}
