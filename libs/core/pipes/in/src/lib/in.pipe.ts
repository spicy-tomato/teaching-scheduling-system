import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'in',
})
export class InPipe implements PipeTransform {
  transform(prop: string, value: any): any {
    if (prop in value) {
      return value[prop];
    }
    return null;
  }
}
