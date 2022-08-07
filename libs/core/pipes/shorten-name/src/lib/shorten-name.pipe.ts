import { Pipe, PipeTransform } from '@angular/core';
import { StringHelper } from '@teaching-scheduling-system/core/utils/helpers';

@Pipe({
  name: 'shortenName',
})
export class ShortenNamePipe implements PipeTransform {
  transform(value: string): string {
    return StringHelper.shortenName(value);
  }
}
