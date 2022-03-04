import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'map',
})
export class MapPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transform(value: any[], prop: string): unknown[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return value.map((x) => x[prop]);
  }
}
