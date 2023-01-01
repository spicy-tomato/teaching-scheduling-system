import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'in',
})
export class InPipe implements PipeTransform {
  transform(prop: string | string[], value: any): any {
    if (typeof prop === 'string') {
      if (prop in value) {
        return value[prop];
      }
      return null;
    }

    if (prop.length === 0) {
      return null;
    }

    if (prop.length === 1) {
      return this.transform(prop[0], value);
    }

    const [extractedProp, newProp] = prop;
    if (extractedProp in value) {
      return this.transform(newProp, value[extractedProp]);
    }
    return null;
  }
}
